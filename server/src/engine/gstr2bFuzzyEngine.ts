import { DatabaseSync } from 'node:sqlite';

export interface PurchaseInvoice {
  id: string;
  business_id: string;
  vendor_name: string | null;
  type: string;
  invoice_number: string;
  gstin: string;
  invoice_date: string;
  due_date: string;
  taxable_amount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_amount: number;
  payment_status: string;
  status: string;
}

export interface GstPortalRecord {
  id: string;
  business_id: string;
  gstr_type: string;
  supplier_gstin: string;
  supplier_name: string;
  invoice_number: string;
  invoice_date: string;
  taxable_amount: number;
  tax_amount: number;
  is_matched: number;
  mismatch_reason: string | null;
}

export interface ReconciliationMatchItem {
  id: string;
  business_id: string;
  invoice_id: string | null;
  gst_record_id: string | null;
  status: 'MATCHED' | 'PARTIAL_MATCH' | 'MISSING' | 'DUPLICATE' | 'AMOUNT_MISMATCH' | 'DATE_MISMATCH' | 'GSTIN_MISMATCH';
  difference_amount: number;
  confidence_score: number;
  ai_explanation: string;
  invoice_number: string;
  supplier_name: string;
  supplier_gstin: string;
  taxable_amount_ledger: number;
  taxable_amount_portal: number;
  tax_amount_ledger: number;
  tax_amount_portal: number;
  created_at: string;
}

export interface Gstr2bReconciliationReport {
  summary: {
    totalPurchaseTax: number;
    claimableItc: number;
    pendingItc: number;
    atRiskItc: number;
    purchaseLedgerTotal: number;
    matchedRecordsTotal: number;
    difference: number;
    matchedCount: number;
    mismatchCount: number;
    missingCount: number;
    aiExplanation: string;
  };
  reconciliationResults: ReconciliationMatchItem[];
  gstRecords: GstPortalRecord[];
  atRiskVendors: Array<{
    id: string;
    name: string;
    gstin: string;
    risk_level: string;
    mismatch_count: number;
    total_payables: number;
  }>;
}

/**
 * Strips non-alphanumeric characters and converts string to lowercase
 * for fuzzy invoice number comparison.
 * e.g. "INV-2026/001" -> "inv2026001", "INV 1044" -> "inv1044"
 */
export function normalizeInvoiceNumber(invNo: string | null | undefined): string {
  if (!invNo) return '';
  return invNo.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

/**
 * Calculates string similarity ratio between 0 and 1.
 */
function getInvoiceNumberSimilarity(a: string, b: string): number {
  const normA = normalizeInvoiceNumber(a);
  const normB = normalizeInvoiceNumber(b);

  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0.0;

  // Check prefix or suffix inclusion (e.g. '1044' vs 'inv1044')
  if (normA.endsWith(normB) || normB.endsWith(normA) || normA.includes(normB) || normB.includes(normA)) {
    const minLen = Math.min(normA.length, normB.length);
    const maxLen = Math.max(normA.length, normB.length);
    return minLen / maxLen >= 0.5 ? 0.85 : 0.6;
  }

  return 0.0;
}

/**
 * Deterministic Fuzzy GSTR-2B Reconciliation Engine.
 * Completely free of LLM hallucinations for 100% mathematical accuracy.
 */
export function executeGstr2bReconciliation(db: DatabaseSync, businessId: string = 'biz_shree_001'): Gstr2bReconciliationReport {
  // Fetch purchase invoices and GSTR-2B records
  const invoices = (db
    .prepare("SELECT * FROM invoices WHERE business_id = ? AND type = 'PURCHASE'")
    .all(businessId) as unknown) as PurchaseInvoice[];

  const gstRecords = (db
    .prepare('SELECT * FROM gst_records WHERE business_id = ?')
    .all(businessId) as unknown) as GstPortalRecord[];

  const reconciliationResults: ReconciliationMatchItem[] = [];
  const processedGstRecordIds = new Set<string>();

  let claimableItc = 0;
  let pendingItc = 0;
  let atRiskItc = 0;

  let matchedCount = 0;
  let mismatchCount = 0;
  let missingCount = 0;

  let totalPurchaseTax = 0;
  let purchaseLedgerTotal = 0;
  let matchedRecordsTotal = 0;

  const vendorMismatchCounts: Record<string, number> = {};

  // Step 1: Iterate over Purchase Invoices and fuzzy-match against GST records
  for (const inv of invoices) {
    const invTax = (inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0);
    totalPurchaseTax += invTax;
    purchaseLedgerTotal += inv.total_amount || 0;

    let bestMatchRecord: GstPortalRecord | null = null;
    let maxMatchScore = 0;

    const normInvGstin = (inv.gstin || '').trim().toUpperCase();

    for (const gst of gstRecords) {
      if (processedGstRecordIds.has(gst.id)) continue;

      const normGstGstin = (gst.supplier_gstin || '').trim().toUpperCase();
      const gstinMatch = normInvGstin === normGstGstin || normInvGstin === '' || normGstGstin === '';

      const invNoSim = getInvoiceNumberSimilarity(inv.invoice_number, gst.invoice_number);

      if (gstinMatch && invNoSim > 0.5) {
        const score = (gstinMatch ? 0.4 : 0) + invNoSim * 0.6;
        if (score > maxMatchScore) {
          maxMatchScore = score;
          bestMatchRecord = gst;
        }
      }
    }

    if (bestMatchRecord && maxMatchScore >= 0.7) {
      processedGstRecordIds.add(bestMatchRecord.id);

      const taxableDiff = Math.abs(inv.taxable_amount - bestMatchRecord.taxable_amount);
      const ledgerTax = invTax;
      const portalTax = bestMatchRecord.tax_amount;
      const taxDiff = Math.abs(ledgerTax - portalTax);

      // Tolerance rule: ±₹1.00 for rounding discrepancies
      const isTaxableExact = taxableDiff <= 1.0;
      const isTaxExact = taxDiff <= 1.0;

      let status: ReconciliationMatchItem['status'] = 'MATCHED';
      let confidenceScore = 98;
      let explanation = '';

      if (isTaxableExact && isTaxExact) {
        status = 'MATCHED';
        confidenceScore = 99;
        claimableItc += ledgerTax;
        matchedRecordsTotal += inv.total_amount;
        matchedCount++;
        explanation = `Exact GSTR-2B match verified for ${bestMatchRecord.supplier_name} (${inv.invoice_number}). ITC of ₹${ledgerTax.toLocaleString('en-IN')} is 100% claimable.`;

        // Update DB status
        db.prepare("UPDATE invoices SET status = 'VERIFIED', confidence_score = ? WHERE id = ?").run(confidenceScore, inv.id);
        db.prepare("UPDATE gst_records SET is_matched = 1, mismatch_reason = NULL WHERE id = ?").run(bestMatchRecord.id);

      } else {
        status = 'AMOUNT_MISMATCH';
        confidenceScore = 82;
        pendingItc += Math.min(ledgerTax, portalTax);
        atRiskItc += Math.abs(ledgerTax - portalTax);
        mismatchCount++;
        explanation = `Value discrepancy detected: Ledger taxable ₹${inv.taxable_amount.toLocaleString('en-IN')} vs Portal ₹${bestMatchRecord.taxable_amount.toLocaleString('en-IN')}. Tax variance of ₹${taxDiff.toFixed(2)}.`;

        const vGstin = inv.gstin || bestMatchRecord.supplier_gstin;
        vendorMismatchCounts[vGstin] = (vendorMismatchCounts[vGstin] || 0) + 1;

        db.prepare("UPDATE invoices SET status = 'MISMATCH', confidence_score = ? WHERE id = ?").run(confidenceScore, inv.id);
        db.prepare("UPDATE gst_records SET is_matched = 0, mismatch_reason = ? WHERE id = ?").run(explanation, bestMatchRecord.id);
      }

      reconciliationResults.push({
        id: `rec_${inv.id}_${Date.now()}`,
        business_id: businessId,
        invoice_id: inv.id,
        gst_record_id: bestMatchRecord.id,
        status,
        difference_amount: Number((inv.taxable_amount - bestMatchRecord.taxable_amount).toFixed(2)),
        confidence_score: confidenceScore,
        ai_explanation: explanation,
        invoice_number: inv.invoice_number,
        supplier_name: inv.vendor_name || bestMatchRecord.supplier_name,
        supplier_gstin: inv.gstin || bestMatchRecord.supplier_gstin,
        taxable_amount_ledger: inv.taxable_amount,
        taxable_amount_portal: bestMatchRecord.taxable_amount,
        tax_amount_ledger: ledgerTax,
        tax_amount_portal: portalTax,
        created_at: new Date().toISOString()
      });

    } else {
      // Invoice present in purchase ledger but completely missing from GSTR-2B portal
      missingCount++;
      atRiskItc += invTax;
      const confidenceScore = 65;
      const explanation = `Invoice ${inv.invoice_number} from ${inv.vendor_name || 'Vendor'} (Tax: ₹${invTax.toLocaleString('en-IN')}) is missing from GSTR-2B portal. Input Tax Credit cannot be claimed until supplier files return.`;

      const vGstin = inv.gstin;
      if (vGstin) {
        vendorMismatchCounts[vGstin] = (vendorMismatchCounts[vGstin] || 0) + 1;
      }

      db.prepare("UPDATE invoices SET status = 'MISSING_GST_DATA', confidence_score = ? WHERE id = ?").run(confidenceScore, inv.id);

      reconciliationResults.push({
        id: `rec_${inv.id}_${Date.now()}`,
        business_id: businessId,
        invoice_id: inv.id,
        gst_record_id: null,
        status: 'MISSING',
        difference_amount: inv.taxable_amount,
        confidence_score: confidenceScore,
        ai_explanation: explanation,
        invoice_number: inv.invoice_number,
        supplier_name: inv.vendor_name || 'Unknown Supplier',
        supplier_gstin: inv.gstin || 'N/A',
        taxable_amount_ledger: inv.taxable_amount,
        taxable_amount_portal: 0,
        tax_amount_ledger: invTax,
        tax_amount_portal: 0,
        created_at: new Date().toISOString()
      });
    }
  }

  // Update vendor mismatch counts in DB
  for (const [gstin, count] of Object.entries(vendorMismatchCounts)) {
    db.prepare(`
      UPDATE vendors 
      SET mismatch_count = mismatch_count + ?,
          risk_level = CASE WHEN mismatch_count + ? >= 2 THEN 'HIGH' ELSE 'MEDIUM' END
      WHERE gstin = ? AND business_id = ?
    `).run(count, count, gstin, businessId);
  }

  // Save reconciliation results to DB
  db.prepare('DELETE FROM reconciliation_results WHERE business_id = ?').run(businessId);
  const insertStmt = db.prepare(`
    INSERT INTO reconciliation_results (id, business_id, invoice_id, gst_record_id, status, difference_amount, ai_explanation, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const res of reconciliationResults) {
    insertStmt.run(
      res.id,
      res.business_id,
      res.invoice_id,
      res.gst_record_id,
      res.status,
      res.difference_amount,
      res.ai_explanation,
      res.created_at
    );
  }

  // Fetch updated at-risk vendors
  const atRiskVendors = (db
    .prepare("SELECT id, name, gstin, risk_level, mismatch_count, total_payables FROM vendors WHERE business_id = ? AND (risk_level IN ('HIGH', 'MEDIUM') OR mismatch_count > 0)")
    .all(businessId) as unknown) as Array<{
      id: string;
      name: string;
      gstin: string;
      risk_level: string;
      mismatch_count: number;
      total_payables: number;
    }>;

  const difference = purchaseLedgerTotal - matchedRecordsTotal;

  const overallAiExplanation = missingCount > 0 || mismatchCount > 0
    ? `${missingCount + mismatchCount} invoice(s) require action. ₹${atRiskItc.toLocaleString('en-IN')} in Input Tax Credit is at risk due to missing GSTR-2B entries or value variances.`
    : `All purchase invoices match GSTR-2B portal records perfectly. 100% of Input Tax Credit (₹${claimableItc.toLocaleString('en-IN')}) is safe to claim.`;

  return {
    summary: {
      totalPurchaseTax: Number(totalPurchaseTax.toFixed(2)),
      claimableItc: Number(claimableItc.toFixed(2)),
      pendingItc: Number(pendingItc.toFixed(2)),
      atRiskItc: Number(atRiskItc.toFixed(2)),
      purchaseLedgerTotal: Number(purchaseLedgerTotal.toFixed(2)),
      matchedRecordsTotal: Number(matchedRecordsTotal.toFixed(2)),
      difference: Number(difference.toFixed(2)),
      matchedCount,
      mismatchCount,
      missingCount,
      aiExplanation: overallAiExplanation
    },
    reconciliationResults,
    gstRecords,
    atRiskVendors
  };
}
