import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Upload,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Send,
  MessageSquare,
  Copy,
  Volume2,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles,
  Users,
  DollarSign
} from 'lucide-react';

export const WebDashboardPreview: React.FC = () => {
  const [whatsappSent, setWhatsappSent] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <div className="w-full space-y-4 text-slate-900 dark:text-slate-100 font-sans select-none animate-in fade-in duration-300">
      
      {/* Responsive Top Header Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">Shree Hardware Stores</h2>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 rounded-full flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3" />
                GSTIN: 29ABCDE1234F1Z5
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">VyaparDhwani Web Command Center • MSME AI Financial OS</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Receivables</div>
            <div className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">₹38,500</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Cash Runway</div>
            <div className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">6 Days Warning</div>
          </div>
        </div>
      </div>

      {/* 3-Column Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* COLUMN 1: Batch Edge-AI OCR Upload + 6-Day Cash Flow Forecaster (Left 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Batch Edge-AI OCR Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/90 via-slate-900 to-obsidian-900 border border-cyan-500/40 shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Edge-AI Batch OCR Engine
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">18 Inv/sec</span>
            </div>

            <h3 className="text-sm font-black text-white">Batch Upload Purchase Ledgers</h3>
            <p className="text-xs text-slate-300">Drag & drop multi-page invoice scans for instant extraction with 98% accuracy.</p>

            <div className="p-4 rounded-xl border-2 border-dashed border-cyan-500/40 bg-slate-950/60 hover:bg-slate-950/90 transition-colors flex flex-col items-center justify-center space-y-1.5 cursor-pointer">
              <Upload className="w-6 h-6 text-cyan-400 animate-bounce" />
              <span className="text-xs font-bold text-slate-200">Drop PDF / Image Invoices Here</span>
              <span className="text-[10px] font-mono text-slate-400">Supports JPG, PNG, PDF up to 50MB</span>
            </div>
          </div>

          {/* 6-Day Cash Flow Forecaster Alert */}
          <div className="p-4 rounded-2xl bg-white dark:bg-obsidian-900 border border-amber-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  6-Day Cash Flow Forecaster Alert
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">Projected: 30-Aug</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-xs space-y-1">
              <div className="font-bold text-amber-900 dark:text-amber-200">Liquidity Dip Warning:</div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                ₹22,000 UltraTech payment due in 6 days will reduce liquid reserves to ₹62,150 before expected customer inflows.
              </p>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Action: Accelerate customer collection from Apex Builders (₹38,000 overdue) to maintain safety buffer.
            </div>
          </div>
        </div>

        {/* COLUMN 2: GST / ITC Intelligence Panel (Middle 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-obsidian-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-cyan-500" />
                <h3 className="text-xs font-black uppercase tracking-wider">GST & GSTR-2B ITC Intelligence</h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 rounded">
                100% Deterministic Math
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30">
                <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">Claimable ITC</div>
                <div className="text-base font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">₹30,520</div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">Matched GSTR-2B</div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30">
                <div className="text-[10px] font-bold text-rose-800 dark:text-rose-400 uppercase">At-Risk ITC</div>
                <div className="text-base font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5">₹3,150</div>
                <div className="text-[9px] text-rose-600 dark:text-rose-400 mt-1 font-semibold">Missing Supplier Entry</div>
              </div>
            </div>

            {/* Reconciliation Report List */}
            <div className="space-y-2 pt-1">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                GSTR-2B Matching Ledger
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">National Traders</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">INV-2024-001234 • ±₹0.85 Variance</div>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 rounded">
                  Discrepancy
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Havells Agency</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">INV-2026-881290 • Exact Match</div>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 rounded">
                  Verified 100%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Overdue Receivables + WhatsApp Reminder Automation (Right 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-obsidian-800 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-black uppercase tracking-wider">Overdue Customer Receivables</h3>
              </div>
              <span className="text-[10px] font-mono text-rose-500 font-bold">31 Days Overdue</span>
            </div>

            {/* Customer Overdue Card */}
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-rose-900 dark:text-white">Apex Builders</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">GSTIN: 29DDDAB3456D1Z4</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono">₹38,000</div>
                  <div className="text-[9px] text-rose-700 dark:text-rose-300 font-bold">Limit Exceeded</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-obsidian-950 border border-rose-200 dark:border-rose-900/50 text-[11px] text-slate-700 dark:text-slate-300">
                "Dear Apex Builders, your payment of ₹38,000 for Invoice #SHS-S-1089 is overdue by 31 days. Kindly settle today."
              </div>

              {/* 1-Click WhatsApp Direct Payment Reminder Trigger */}
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => setWhatsappSent(true)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
                    whatsappSent
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>{whatsappSent ? 'WHATSAPP REMINDER SENT TO APEX BUILDERS ✅' : '1-CLICK WHATSAPP PAYMENT REMINDER'}</span>
                </button>

                <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Supported Languages: EN | HI | KN</span>
                  <span>Deep Link: whatsapp://send</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
