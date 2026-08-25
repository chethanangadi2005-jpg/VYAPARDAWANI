import React, { useState } from 'react';
import {
  Camera,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Home,
  PieChart,
  Settings,
  Send,
  ArrowUpRight,
  Plus,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

export const MobileAppPreview: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<'home' | 'invoice' | 'analytics'>('home');
  const [approvedItc, setApprovedItc] = useState<boolean>(false);
  const [reminderSent, setReminderSent] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-md mx-auto">
      {/* Mobile Screen Selector Tabs (Above Phone Frame) */}
      <div className="flex items-center justify-center space-x-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-4 text-xs font-semibold w-full max-w-xs shadow-lg">
        <button
          onClick={() => setActiveScreen('home')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
            activeScreen === 'home'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Home
        </button>
        <button
          onClick={() => setActiveScreen('invoice')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
            activeScreen === 'invoice'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Invoice
        </button>
        <button
          onClick={() => setActiveScreen('analytics')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
            activeScreen === 'analytics'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Stats
        </button>
      </div>

      {/* Dynamic Device Phone Shell Frame */}
      <div className="relative w-full max-w-[360px] h-[720px] bg-[#070A0F] border-[10px] border-slate-900 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col select-none ring-1 ring-slate-800">
        
        {/* Dynamic Island / Top Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 flex items-center justify-between px-6 z-40">
          <span className="text-[10px] font-semibold text-slate-300 font-mono">09:41</span>
          <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center space-x-1.5 border border-slate-800/60">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <div className="w-2.5 h-1 bg-slate-700 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Signal className="w-2.5 h-2.5" />
            <Wifi className="w-2.5 h-2.5" />
            <Battery className="w-3 h-3 text-slate-300" />
          </div>
        </div>

        {/* Mobile Header Bar */}
        <div className="pt-8 px-4 pb-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between z-20 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.3)]">
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-tight text-white">VYAPAR<span className="text-cyan-400 italic">DHWANI</span></h2>
              <p className="text-[9px] text-slate-400 font-medium leading-none">Shree Hardware Stores</p>
            </div>
          </div>

          <span className="px-2 py-0.5 text-[9px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5" />
            98% Edge
          </span>
        </div>

        {/* Scrollable Viewport Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0F17] text-slate-100">
          
          {/* SCREEN VIEW 1: HOME / DASHBOARD */}
          {activeScreen === 'home' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* Hero Action Button: Capture Invoice & OCR */}
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)] overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                    98% AI Confidence
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700">
                    Batch Mode Active
                  </span>
                </div>

                <h3 className="text-sm font-black text-white mt-1">CAPTURE INVOICE & OCR</h3>
                <p className="text-[10px] text-slate-300 mt-0.5">Single-tap camera scan & edge AI extraction</p>

                <button className="mt-3 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(34,211,238,0.25)] flex items-center justify-center space-x-2 active:scale-95 transition-all">
                  <Camera className="w-4 h-4 fill-slate-950" />
                  <span>START EDGE SCAN</span>
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-md">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Ledgers</div>
                  <div className="text-lg font-black text-white mt-0.5 font-mono">12,450</div>
                  <div className="text-[9px] font-bold text-emerald-400 mt-1 flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    <span>+14.2% MoM</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 shadow-md">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Low Cash Runway</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5 font-mono">6 Days</div>
                  <div className="text-[9px] font-bold text-amber-400 mt-1 flex items-center gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>₹22k Due Aug 30</span>
                  </div>
                </div>
              </div>

              {/* Activity List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Recent Ledger Activity</span>
                  <button onClick={() => setActiveScreen('invoice')} className="text-cyan-400 hover:underline">View All</button>
                </div>

                {/* Card 1 */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      GM
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Global Motors</div>
                      <div className="text-[9px] text-slate-400 font-mono">INV-2026-0012 • 24 Aug</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-white font-mono">₹14,500</div>
                    <span className="px-1.5 py-0.5 text-[8px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded">
                      Claimable ITC
                    </span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                      SS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Sharma & Sons</div>
                      <div className="text-[9px] text-slate-400 font-mono">INV-2026-0014 • 22 Aug</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-white font-mono">₹8,200</div>
                    <span className="px-1.5 py-0.5 text-[8px] font-extrabold bg-blue-950 text-blue-400 border border-blue-500/30 rounded">
                      In Stock
                    </span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
                      AP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">ABC Paints</div>
                      <div className="text-[9px] text-slate-400 font-mono">INV-2026-0018 • 18 Aug</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-white font-mono">₹22,000</div>
                    <span className="px-1.5 py-0.5 text-[8px] font-extrabold bg-amber-950 text-amber-400 border border-amber-500/30 rounded">
                      Pending GSTR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN VIEW 2: INVOICE DETAILS */}
          {activeScreen === 'invoice' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded">
                      PURCHASE INVOICE
                    </span>
                    <h3 className="text-base font-black text-white mt-1">INV-00124</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Vendor: Global Motors Distributors</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-cyan-400 font-mono">₹18,500</div>
                    <div className="text-[9px] text-slate-400">Tax: ₹2,822 (18% GST)</div>
                  </div>
                </div>

                {/* GSTR-2B Progress Bar */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-300">GSTR-2B ITC Claimable Progress</span>
                    <span className="text-emerald-400 font-mono">78% Matched</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[78%] rounded-full"></div>
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Discrepancy: ±₹0.85 rounding tolerance matched against portal.
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-b border-slate-800/80 py-2.5">
                  <div>
                    <div className="text-slate-400">Supplier GSTIN</div>
                    <div className="font-mono text-white font-bold">29AAACG1111A1Z1</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Invoice Date</div>
                    <div className="font-mono text-white font-bold">24-Aug-2026</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setApprovedItc(true)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                      approvedItc
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-md'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-slate-950" />
                    <span>{approvedItc ? 'ITC APPROVED FOR GSTR-3B' : 'APPROVE ITC CLAIM'}</span>
                  </button>

                  <button
                    onClick={() => setReminderSent(true)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                      reminderSent
                        ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{reminderSent ? 'WHATSAPP REMINDER SENT ✅' : 'ISSUE PAYMENT REMINDER'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN VIEW 3: ANALYTICS OVERVIEW */}
          {activeScreen === 'analytics' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* Vyapar Health Score */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-center space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vyapar Financial Health Score</div>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-cyan-400 bg-cyan-950/40 shadow-[0_0_25px_rgba(34,211,238,0.25)]">
                  <span className="text-2xl font-black text-white font-mono">85</span>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">/100</span>
                </div>
                <div className="text-xs font-extrabold text-emerald-400">HEALTHY OPERATING STATUS</div>
              </div>

              {/* Trend Chart Mockup */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-300">6-Month Revenue & Inflows</span>
                  <span className="text-cyan-400 font-mono">₹4.82 Lakhs/mo</span>
                </div>

                <div className="h-20 flex items-end justify-between gap-1.5 pt-2 px-1">
                  {[45, 62, 58, 74, 88, 95].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        style={{ height: `${val}%` }}
                        className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                      ></div>
                      <span className="text-[8px] font-mono text-slate-400">M{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Receivables & Risk Cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Receivables</div>
                  <div className="text-base font-black text-white font-mono mt-0.5">₹38,500</div>
                  <div className="text-[8px] text-emerald-400 font-bold mt-1">4.2k avg collection</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/30 text-left">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">ITC at Risk</div>
                  <div className="text-base font-black text-rose-400 font-mono mt-0.5">12%</div>
                  <div className="text-[8px] text-rose-400 font-bold mt-1">2 Supplier mismatches</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Floating Navigation Bar with Raised Cyan FAB */}
        <div className="relative bg-slate-950/95 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-around z-30 backdrop-blur-md">
          
          <button
            onClick={() => setActiveScreen('home')}
            className={`flex flex-col items-center space-y-0.5 text-[9px] font-bold ${
              activeScreen === 'home' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveScreen('invoice')}
            className={`flex flex-col items-center space-y-0.5 text-[9px] font-bold ${
              activeScreen === 'invoice' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices</span>
          </button>

          {/* Raised Glowing Cyan Floating Action Button (FAB) */}
          <div className="relative -top-5">
            <button
              onClick={() => setActiveScreen('home')}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] border-2 border-slate-950 active:scale-95 transition-all"
            >
              <Camera className="w-6 h-6 fill-slate-950" />
            </button>
          </div>

          <button
            onClick={() => setActiveScreen('analytics')}
            className={`flex flex-col items-center space-y-0.5 text-[9px] font-bold ${
              activeScreen === 'analytics' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Stats</span>
          </button>

          <button
            onClick={() => setActiveScreen('home')}
            className="flex flex-col items-center space-y-0.5 text-[9px] font-bold text-slate-400 hover:text-slate-200"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
