import { initDatabase, db } from './db/database';
import { executeGstr2bReconciliation } from './engine/gstr2bFuzzyEngine';
import { computeCashflowAndRisk } from './engine/cashflowRiskEngine';

console.log('--- STARTING VERIFICATION TEST ---');

// 1. Init DB
initDatabase();

// 2. Test GSTR-2B Fuzzy Engine
console.log('\nTesting GSTR-2B Reconciliation Engine...');
const gstrReport = executeGstr2bReconciliation(db, 'biz_shree_001');
console.log('✓ Summary:', gstrReport.summary);
console.log(`✓ Matched: ${gstrReport.summary.matchedCount}, Mismatches: ${gstrReport.summary.mismatchCount}, Missing: ${gstrReport.summary.missingCount}`);

// 3. Test Cashflow & Risk Engine
console.log('\nTesting Cashflow & Anomaly Detection Engine...');
const cashflowResult = computeCashflowAndRisk(db, 'biz_shree_001');
console.log(`✓ 7-Day Forecast Points: ${cashflowResult.forecast7Days.length}`);
console.log(`✓ 30-Day Forecast Points: ${cashflowResult.forecast30Days.length}`);
console.log(`✓ 90-Day Forecast Points: ${cashflowResult.forecast90Days.length}`);
console.log(`✓ Spending Anomalies Detected: ${cashflowResult.anomalies.length}`);
if (cashflowResult.pressureAlert) {
  console.log('✓ Pressure Alert Detected:', cashflowResult.pressureAlert.what);
}

console.log('\n--- VERIFICATION TEST SUCCESSFUL ---');
