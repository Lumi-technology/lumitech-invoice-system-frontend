// Landing.jsx — LumiLedger marketing page (fully mobile responsive + support)
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FileText, CheckCircle, TrendingUp, BarChart3, Layers, ArrowRight,
  Shield, Zap, Clock, ChevronRight, BookOpen, Landmark, Bell,
  Eye, Users, Star, AlertTriangle, XCircle, Banknote, Lock,
  Wallet, PiggyBank, Briefcase, Calculator, Menu, X as XIcon,
  CreditCard, Receipt, Download, LifeBuoy, Mail, Ticket, FolderOpen,
  Smartphone, BadgeCheck,
} from "lucide-react";

/* ─── Mock Dashboard ─────────────────────────────────────────────────────── */
function MockDashboard() {
  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden">
      <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/10 rounded-3xl blur-3xl" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-slate-400 font-medium">LumiLedger — Dashboard</span>
        </div>
        <div className="mx-4 mt-4 mb-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Your Capital Overview</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "You Put In",       value: "₦850,000", color: "text-blue-700"   },
              { label: "You've Got Back",  value: "₦520,000", color: "text-emerald-700" },
              { label: "Business Owes You",value: "₦330,000", color: "text-rose-700"    },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-sm font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { label: "Phoenix Plus — Web Redesign",  amount: "₦550,000", status: "Paid",    color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
            { label: "TechCorp — API Integration",   amount: "₦280,000", status: "Partial", color: "text-amber-600 bg-amber-50 border-amber-200" },
            { label: "Nova Agency — Brand Identity", amount: "₦190,000", status: "Unpaid",  color: "text-rose-600 bg-rose-50 border-rose-200" },
          ].map(inv => (
            <div key={inv.label} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs text-slate-700 font-medium truncate">{inv.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-slate-900">{inv.amount}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${inv.color}`}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Capital recovery rate</span>
            <span className="text-xs font-bold text-blue-600">61%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "61%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Mock Tax Report (fully responsive with horizontal scroll) ────────── */
const TAX_ROWS = [
  { inv: "INV-003", desc: "Web Design Services",  client: "Apex Ventures",    vat: "₦7,500", wht: "—",      total: "₦107,500" },
  { inv: "INV-002", desc: "Consulting — Q2",      client: "Crestfield Agency", vat: "₦3,000", wht: "₦2,000", total: "₦43,000"  },
  { inv: "INV-004", desc: "Construction Works",   client: "Nova Build Co.",    vat: "—",      wht: "—",      total: "₦50,000"  },
];

function MockTaxReport() {
  return (
    <div className="relative w-full max-w-full">
      <div className="absolute -inset-y-6 inset-x-0 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-blue-500/10 rounded-3xl blur-3xl pointer-events-none" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden text-left">

        {/* title bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
          <div className="w-3 h-3 rounded-full bg-rose-400 shrink-0" />
          <div className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
          <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
          <span className="ml-2 text-xs text-slate-400 font-medium truncate">LumiLedger — Tax Report</span>
        </div>

        {/* header row */}
        <div className="px-4 pt-4 pb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-slate-900">Tax Report</p>
            <p className="text-xs text-slate-400">VAT payable &amp; WHT — FIRS compliance</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg shrink-0">
            <Download className="w-3 h-3 shrink-0" /> <span>Export for FIRS</span>
          </div>
        </div>

        {/* quarter tabs */}
        <div className="px-4 pb-3 flex flex-wrap items-center gap-1.5">
          {["Q1", "Q2", "Q3", "Q4"].map((q, i) => (
            <span key={q} className={`px-3 py-1 rounded-lg text-xs font-semibold border ${i === 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200"}`}>{q}</span>
          ))}
          <span className="ml-auto text-[10px] text-slate-400 font-medium">FY 2026</span>
        </div>

        {/* summary cards — 3 columns on all sizes */}
        <div className="px-4 pb-3 grid grid-cols-3 gap-2">
          {[
            { label: "Total Revenue", value: "₦840,000", sub: "5 invoices",        color: "text-slate-900", bg: "bg-slate-50",  border: "border-slate-200" },
            { label: "VAT Payable",   value: "₦10,500",  sub: "Remit to FIRS",     color: "text-rose-600",  bg: "bg-rose-50",   border: "border-rose-200"  },
            { label: "WHT Withheld",  value: "₦2,000",   sub: "Credit receivable", color: "text-blue-600",  bg: "bg-blue-50",   border: "border-blue-200"  },
          ].map(c => (
            <div key={c.label} className={`${c.bg} border ${c.border} rounded-xl p-2`}>
              <p className="text-[10px] text-slate-500 mb-1 leading-tight">{c.label}</p>
              <p className={`text-xs font-extrabold ${c.color}`}>{c.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Mobile invoice list (shown below sm) ── */}
        <div className="sm:hidden mx-3 mb-3 rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Invoice Breakdown</span>
            <span className="text-[10px] text-slate-400">Q2 2026</span>
          </div>
          <div className="divide-y divide-slate-100">
            {TAX_ROWS.map(r => (
              <div key={r.inv} className="px-3 py-2.5 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-700 truncate">{r.desc}</p>
                  <p className="text-[10px] text-slate-400 truncate">{r.client}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">{r.inv}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-900">{r.total}</p>
                  {r.vat !== "—" && <p className="text-[10px] text-rose-600">VAT {r.vat}</p>}
                  {r.wht !== "—" && <p className="text-[10px] text-blue-600">WHT {r.wht}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 border-t-2 border-slate-200 px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Totals</span>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">₦850,500</p>
              <p className="text-[10px] text-rose-600">VAT ₦10,500</p>
            </div>
          </div>
        </div>

        {/* ── Desktop table (hidden below sm) ── */}
        <div className="hidden sm:block mx-3 mb-3 rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Invoice Breakdown</span>
            <span className="text-[10px] text-slate-400">5 records · Q2 2026</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide w-16">Ref</th>
                  <th className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">Description</th>
                  <th className="px-3 py-1.5 text-[10px] font-bold text-rose-400 uppercase tracking-wide text-right w-14">VAT</th>
                  <th className="px-3 py-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wide text-right w-14">WHT</th>
                  <th className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide text-right w-16">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TAX_ROWS.map(r => (
                  <tr key={r.inv}>
                    <td className="px-3 py-2 font-mono text-slate-400 text-[10px]">{r.inv}</td>
                    <td className="px-3 py-2">
                      <p className="text-slate-700 font-semibold text-[11px] truncate max-w-[160px]">{r.desc}</p>
                      <p className="text-slate-400 text-[10px] truncate max-w-[160px]">{r.client}</p>
                    </td>
                    <td className={`px-3 py-2 text-right text-xs font-semibold ${r.vat !== "—" ? "text-rose-600" : "text-slate-300"}`}>{r.vat}</td>
                    <td className={`px-3 py-2 text-right text-xs font-semibold ${r.wht !== "—" ? "text-blue-600" : "text-slate-300"}`}>{r.wht}</td>
                    <td className="px-3 py-2 text-right text-xs font-bold text-slate-900">{r.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Totals</td>
                  <td />
                  <td className="px-3 py-2 text-right font-bold text-rose-600 text-xs">₦10,500</td>
                  <td className="px-3 py-2 text-right font-bold text-blue-600 text-xs">₦2,000</td>
                  <td className="px-3 py-2 text-right font-bold text-slate-900 text-xs">₦850,500</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* filing status */}
        <div className="mx-3 mb-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-emerald-700">Q2 report ready to file</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 shrink-0">
            Review &amp; File <ArrowRight className="w-3 h-3" />
          </span>
        </div>

      </div>
    </div>
  );
}

/* ─── Capital Tracking Card ──────────────────────────────────────────────── */
function CapitalCard() {
  return (
    <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-sm w-full">
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">Owner Capital Tracker</p>
          <p className="text-xs text-slate-400 mt-0.5">Money you've put into this business</p>
        </div>
        <div className="p-2 bg-blue-600 rounded-lg">
          <PiggyBank className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "You Put In",    value: "₦850,000", color: "text-blue-700"   },
            { label: "Recovered",     value: "₦520,000", color: "text-emerald-600" },
            { label: "Still Owed",    value: "₦330,000", color: "text-rose-600"    },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <p className={`text-sm font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Capital recovery progress</span><span className="font-bold text-blue-600">61% recovered</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "61%" }} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Capital history</p>
          {[
            { date: "Jan 10, 2026", amount: "₦500,000", note: "Initial capital injection" },
            { date: "Mar 5, 2026",  amount: "₦350,000", note: "Equipment purchase" },
          ].map(p => (
            <div key={p.date} className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
              <div>
                <p className="text-xs font-semibold text-slate-800">{p.note}</p>
                <p className="text-xs text-slate-400">{p.date}</p>
              </div>
              <span className="text-xs font-bold text-blue-600">{p.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Visual (African businesswoman + floating cards) ──────────────── */
function HeroVisual() {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Ambient glow */}
      <div className="absolute -inset-10 bg-gradient-to-br from-blue-400/30 via-violet-400/20 to-rose-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Photo frame */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/25" style={{aspectRatio:"4/5"}}>
          {!imgError ? (
            <img
              src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=700&q=85&auto=format&fit=crop&crop=faces"
              alt="African business owner delighted by LumiLedger"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800 flex items-center justify-center">
              <div className="text-center text-white/80 px-8">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <p className="text-lg font-bold">Your finances,<br/>finally clear.</p>
              </div>
            </div>
          )}
          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900/50 to-transparent" />
        </div>

        {/* Floating card: Revenue */}
        <div className="absolute -right-4 sm:-right-8 top-8 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3.5 z-10 min-w-[155px]">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1">This month</p>
          <p className="text-xl font-extrabold text-slate-900">₦840,000</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="text-[10px] text-emerald-600 font-bold">+23% vs last month</span>
          </div>
        </div>

        {/* Floating card: Claim approved */}
        <div className="absolute -left-4 sm:-left-8 bottom-20 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3.5 z-10 max-w-[195px]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Expense claim approved</p>
              <p className="text-sm font-extrabold text-slate-900">₦125,000 ✓</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[10px] text-slate-500">Just now · January 2026</span>
          </div>
        </div>

        {/* Floating card: Star rating */}
        <div className="absolute -right-2 sm:-right-6 bottom-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-3.5 z-10">
          <div className="flex items-center gap-0.5 mb-1">
            {Array.from({length:5},(_,i)=><Star key={i} className="w-3 h-3 text-amber-300 fill-amber-300"/>)}
          </div>
          <p className="text-[10px] text-blue-200 font-medium">100+ businesses</p>
          <p className="text-xs text-white font-extrabold">trust LumiLedger</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Mock Expense Claim (for expense reporting section) ─────────────────── */
function MockExpenseClaim() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute -inset-6 bg-gradient-to-br from-violet-500/15 via-rose-500/8 to-blue-500/10 rounded-3xl blur-3xl pointer-events-none" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden text-left">
        {/* Browser bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
          <div className="w-3 h-3 rounded-full bg-rose-400 shrink-0" />
          <div className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
          <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
          <span className="ml-2 text-xs text-slate-400 font-medium truncate">LumiLedger — February 2026 Expenses</span>
        </div>

        {/* Claim header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-bold text-slate-900">February 2026 Expenses</p>
            <p className="text-xs text-slate-400 mt-0.5">Submitted by Adaeze O. · 3 expenses</p>
          </div>
          <span className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200 shrink-0">✓ Approved</span>
        </div>

        {/* Expense rows */}
        <div className="divide-y divide-slate-50">
          {[
            { label: "Bolt – Client Site Visit", type: "Transport",  date: "Feb 3",  amount: "₦15,000",  icon: "🚖", receipt: true },
            { label: "Transcorp Hilton",          type: "Hotel",      date: "Feb 8",  amount: "₦120,000", icon: "🏨", receipt: true },
            { label: "Client Business Dinner",    type: "Meals",      date: "Feb 15", amount: "₦40,000",  icon: "🍽️", receipt: true },
          ].map(exp => (
            <div key={exp.label} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-base">
                  {exp.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{exp.label}</p>
                  <p className="text-[10px] text-slate-400">{exp.type} · {exp.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {exp.receipt && (
                  <span className="hidden sm:flex items-center gap-1 text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">
                    📎 receipt
                  </span>
                )}
                <p className="text-sm font-bold text-slate-900">{exp.amount}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">3 expenses</span>
          <span className="text-base font-extrabold text-slate-900">₦175,000</span>
        </div>

        {/* Approval banner */}
        <div className="px-5 py-3 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-emerald-700">Approved by GBA · Auto-posted to journal entries</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
            P&amp;L updated ✓
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const testimonials = [
  {
    quote: "I finally know how much my business owes me. I had put in over ₦800,000 and had no idea how much was coming back. LumiLedger showed me everything on day one.",
    name: "Amara O.",
    role: "Business Owner, Lagos",
    initials: "AO",
    color: "from-blue-500 to-indigo-600",
    metric: "₦800K tracked",
  },
  {
    quote: "As an accountant managing 6 businesses, this is the only tool that gives me the full picture — journal entries, balance sheet, and capital tracking all in one place.",
    name: "Chidi N.",
    role: "Accountant, Abuja",
    initials: "CN",
    color: "from-emerald-500 to-teal-600",
    metric: "6 clients managed",
  },
  {
    quote: "Set up in 5 minutes. My dashboard now shows revenue, expenses, profit — and how much my business owes me personally. I've never had this clarity before.",
    name: "Funmilayo B.",
    role: "Branding Consultant, Ibadan",
    initials: "FB",
    color: "from-violet-500 to-purple-600",
    metric: "Set up in 5 min",
  },
];

const benefits = [
  {
    icon: <Wallet className="w-5 h-5 text-blue-600" />,
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    badgeText: "Unique",
    title: "Track money you've put into your business",
    desc: "Record capital injections and watch your recovery rate grow as revenue comes in. Know exactly what your business owes you — always.",
  },
  {
    icon: <Eye className="w-5 h-5 text-indigo-600" />,
    bg: "bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-700",
    badgeText: "Clarity",
    title: "Know exactly who owes you — and how much",
    desc: "Every invoice status live: paid, partial, overdue. No guesswork, no chasing spreadsheet rows.",
  },
  {
    icon: <Bell className="w-5 h-5 text-violet-600" />,
    bg: "bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    badgeText: "Automated",
    title: "Send invoices and get paid faster",
    desc: "Create professional invoices in seconds. Automatic reminders so clients never forget — and you don't have to follow up manually.",
  },
  {
    icon: <Banknote className="w-5 h-5 text-emerald-600" />,
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    badgeText: "Complete",
    title: "Accounting-grade tools without the complexity",
    desc: "Chart of accounts, journal entries, profit & loss, balance sheet — full double-entry bookkeeping built right in.",
  },
];

const features = [
  { icon: <PiggyBank className="w-5 h-5 text-blue-600" />,    bg: "bg-blue-50",    title: "Owner Capital Tracking",         desc: "Record money you put in. Track how much comes back. See exactly what your business owes you over time.", highlight: true },
  { icon: <FileText className="w-5 h-5 text-indigo-600" />,   bg: "bg-indigo-50",  title: "Invoicing & Payments",           desc: "Create, send, and track invoices. Clients pay via Paystack, bank transfer, or cash — your choice." },
  { icon: <BarChart3 className="w-5 h-5 text-violet-600" />,  bg: "bg-violet-50",  title: "Financial Dashboard",            desc: "Revenue, expenses, profit — updated in real time. Understand your business money at a glance." },
  { icon: <Layers className="w-5 h-5 text-amber-600" />,      bg: "bg-amber-50",   title: "Project & Client Tracking",      desc: "Group invoices by project. Track total earned vs balance remaining per client." },
  { icon: <TrendingUp className="w-5 h-5 text-rose-600" />,   bg: "bg-rose-50",    title: "Financial Reports",              desc: "Trial Balance, Profit & Loss, Balance Sheet — real accounting reports built into the platform." },
  { icon: <BookOpen className="w-5 h-5 text-cyan-600" />,     bg: "bg-cyan-50",    title: "Chart of Accounts",              desc: "Full double-entry bookkeeping — assets, liabilities, equity, income, expenses." },
  { icon: <Users className="w-5 h-5 text-teal-600" />,        bg: "bg-teal-50",    title: "Team Access & Roles",            desc: "Add admins and staff. Everyone sees exactly what they need — nothing more." },
  { icon: <Landmark className="w-5 h-5 text-slate-600" />,    bg: "bg-slate-50",   title: "Bank Reconciliation",            desc: "Import bank statements, auto-match transactions, and reconcile your books in minutes." },
  { icon: <Receipt className="w-5 h-5 text-violet-600" />,    bg: "bg-violet-50",  title: "Expense Reporting & Claims",     desc: "Staff submit expense claims with receipts. You approve, return, or reject. Auto-posts to journal on approval.", highlight: false },
];

const steps = [
  { n: "1", title: "Record your transactions",       desc: "Add income, expenses, and invoices. Your dashboard updates instantly.", color: "from-blue-600 to-blue-700", glow: "shadow-blue-600/30" },
  { n: "2", title: "Track your capital investment",  desc: "Record money you put into the business and watch your recovery grow.", color: "from-indigo-600 to-indigo-700", glow: "shadow-indigo-600/30" },
  { n: "3", title: "Watch your business pay you back", desc: "As revenue comes in, see your outstanding capital decrease in real time.", color: "from-violet-600 to-violet-700", glow: "shadow-violet-600/30" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">
      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-600/20">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              LumiLedger<span className="text-blue-600">.</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features"     className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">How it works</a>
            <a href="#pricing"      className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">Pricing</a>
            <Link to="/pricing"     className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">Plans & FAQ</Link>
            <a href="#support"      className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">Support</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition hidden sm:block">Sign In</Link>
            <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:scale-[1.02] transition-all">
              Start Free <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
            {[
              { label: "Features", href: "#features" },
              { label: "How it works", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
              { label: "Support", href: "#support" },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"
            >
              Plans & FAQ
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-20 sm:pb-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 mb-7">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                30-Day Free Trial · No credit card required
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5 sm:mb-6">
                Track your business finances —{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  and your money inside it.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Manage invoices, expenses, and see exactly how much your business owes you. Built for business owners and accountants.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center lg:justify-start">
                <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-[1.02] transition-all text-base">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition shadow-sm text-base">
                  See How It Works
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />No credit card required</div>
                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />Set up in under 2 minutes</div>
                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />Cancel anytime</div>
              </div>
            </div>
            <div className="hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ─────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">100+</p>
              <p className="text-sm text-slate-500 mt-0.5">Businesses using LumiLedger</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">₦50M+</p>
              <p className="text-sm text-slate-500 mt-0.5">Tracked through the platform</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-extrabold text-slate-900">SMEs + Accountants</p>
              <p className="text-sm text-slate-500 mt-0.5">Two modes, one platform</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
              <span className="ml-2 text-sm font-semibold text-slate-700">4.9 / 5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── OWNER CAPITAL — UNIQUE FEATURE ───────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 mb-6">
                ✦ What makes LumiLedger different
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-5">
                Finally know{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  what your business owes you
                </span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Most business owners put money into their business and never track it. LumiLedger lets you record every capital injection and see exactly how much comes back to you over time.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, text: "Record money you put into the business — any amount, any time" },
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, text: "Track your recovery rate as revenue comes in" },
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, text: "See 'Business Owes You' — one clear number, always up to date" },
                ].map(f => (
                  <div key={f.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">{f.icon}</div>
                    <p className="text-slate-700 text-sm leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 hover:scale-[1.02] transition-all w-full sm:w-auto">
                Start Tracking Your Capital <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-6 lg:mt-0 flex justify-center">
              <CapitalCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full border border-rose-100 mb-5">Sound familiar?</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Running a business shouldn't mean<br className="hidden sm:block" /> losing track of your money
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
              Most business owners are flying blind. They fund their business but never track it.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <XCircle className="w-6 h-6 text-rose-500" />,      title: "You fund your business but don't track it",        desc: "You've put in money over months or years — but you have no idea how much, or how much has come back." },
              { icon: <AlertTriangle className="w-6 h-6 text-amber-500" />, title: "You don't know what your business owes you",       desc: "There's no clear number. Just a feeling that you've put in more than you've gotten back." },
              { icon: <XCircle className="w-6 h-6 text-rose-500" />,      title: "Your records are scattered and incomplete",        desc: "Notes, chats, memory, spreadsheets — nothing paints the full picture of your financial position." },
            ].map(p => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center mb-4 border border-rose-100">{p.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2 leading-snug">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg font-semibold text-slate-700">LumiLedger fixes all of this — starting today.</p>
          </div>
        </div>
      </section>

      {/* ── SOLUTION / BENEFITS ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 mb-5">Everything in one place</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              One platform. Complete financial clarity.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built for how African businesses actually operate — invoicing, expenses, accounting, and capital tracking all in one place.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map(b => (
              <div key={b.title} className="flex gap-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                <div className={`w-12 h-12 ${b.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {b.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-slate-900 leading-snug">{b.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${b.badge}`}>{b.badgeText}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GET PAID YOUR WAY ────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100 mb-5">
              Built for Nigerian businesses
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Your clients pay the way{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                that works for them
              </span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
              Not everyone pays by card. LumiLedger lets you accept Paystack, bank transfer, or cash — and every payment is automatically recorded in your books.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/25 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-slate-900">Paystack</h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">Online</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Generate a payment link in one click. Clients pay by card, bank transfer, USSD, or QR code — Paystack handles it all.
              </p>
              <div className="space-y-2">
                {["Card payments", "USSD & bank transfer", "QR code payments", "Instant confirmation"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group ring-1 ring-emerald-100">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-slate-900">Bank Transfer</h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">Most used in NG</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Display your account number directly on every invoice. Clients transfer and you confirm receipt — no friction, no middleman.
              </p>
              <div className="space-y-2">
                {["Your account on every invoice", "Works with all Nigerian banks", "Manual confirmation flow", "Auto-records in your books"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                <Banknote className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-slate-900">Cash</h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full border border-amber-200">Offline</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Record cash payments instantly. Whether collected in-person or at delivery, your books stay up to date — automatically.
              </p>
              <div className="space-y-2">
                {["Record in seconds", "Updates invoice status", "Reflects in P&L report", "Full audit trail"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-10">
            <div className="flex-1">
              <p className="font-bold text-slate-900 mb-1">Every payment updates your books automatically</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Whether a client pays online, by transfer, or in cash — LumiLedger records it, updates the invoice status, and reflects it in your Profit &amp; Loss and Balance Sheet instantly. No manual entry needed.
              </p>
            </div>
            <Link
              to="/register"
              className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 hover:scale-[1.02] transition-all text-sm"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FIRS TAX COMPLIANCE ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="text-center lg:text-left min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100 mb-6">
                🇳🇬 Built for Nigerian tax law
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-5">
                Stay{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  FIRS-ready
                </span>{" "}
                all year round
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Every invoice you raise automatically calculates VAT and WHT. No spreadsheets, no scrambling at tax time — just one report and a CSV you can file straight with FIRS.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: <Receipt className="w-4 h-4 text-emerald-600" />, title: "Auto-calculates VAT on every invoice", desc: "Set your VAT rate once. LumiLedger tracks VAT payable across all invoices, per quarter." },
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, title: "WHT withheld tracked by transaction type", desc: "Rent, consulting, contracts — WHT is categorised automatically so you know your receivable credit." },
                  { icon: <Download className="w-4 h-4 text-emerald-600" />, title: "One-click FIRS CSV export", desc: "Q1–Q4 breakdown ready to go. Export and file — no manual data entry, no missed figures." },
                ].map(f => (
                  <div key={f.title} className="flex gap-4 text-left">
                    <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-emerald-100 mt-0.5">
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 mb-0.5">{f.title}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 hover:scale-[1.02] transition-all text-sm">
                  Start Filing Smarter <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="inline-flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-xl border border-emerald-100">
                  <CheckCircle className="w-4 h-4" /> VAT &amp; WHT supported
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 w-full min-w-0">
              <MockTaxReport />
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPENSE REPORTING ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full border border-violet-100 mb-6">
                ✦ New — Expense Reporting
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-5">
                Staff expense claims —{" "}
                <span className="bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent">
                  approved in seconds
                </span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Your team submits expense claims with receipts attached. You review and approve with one click. Every approved claim flows directly into your books — no manual journal entries, ever.
              </p>
              <div className="space-y-5 mb-8">
                {[
                  { icon: <FolderOpen className="w-4 h-4 text-violet-600" />, bg: "bg-violet-50 border-violet-100", title: "Simple expense claims, built for Nigerian teams", desc: "Staff submit claims with expense type, amount, and receipt. No paperwork, no spreadsheets — everything tracked in one place." },
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, bg: "bg-emerald-50 border-emerald-100", title: "Approve, return, or reject", desc: "Accountants review each claim, add a reason if returning, and notify staff instantly by email and bell." },
                  { icon: <BookOpen className="w-4 h-4 text-blue-600" />, bg: "bg-blue-50 border-blue-100", title: "Auto-posts to your books", desc: "Approval triggers a journal entry. P&L and Balance Sheet update automatically. Nothing falls through the cracks." },
                ].map(f => (
                  <div key={f.title} className="flex gap-4 text-left">
                    <div className={`w-9 h-9 ${f.bg} rounded-xl flex items-center justify-center flex-shrink-0 border mt-0.5`}>
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 mb-0.5">{f.title}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-violet-600/25 hover:scale-[1.02] transition-all text-sm">
                  Try Expense Reporting Free <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="inline-flex items-center gap-2 px-4 py-3 bg-white text-slate-600 text-sm font-medium rounded-xl border border-slate-200 shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-violet-500" /> Accountant Pro plan
                </div>
              </div>
            </div>
            <div className="mt-6 lg:mt-0 flex justify-center">
              <MockExpenseClaim />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built for SMEs, freelancers, agencies, and accountants who need financial clarity without complexity.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(f => (
              <div key={f.title} className={`relative bg-white rounded-2xl p-5 border transition-all hover:shadow-md hover:-translate-y-0.5 ${
                f.highlight ? "border-blue-300 shadow-md ring-1 ring-blue-100" : "border-slate-200 shadow-sm"
              }`}>
                {f.highlight && (
                  <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">★ Unique</span>
                )}
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4 border border-slate-100`}>{f.icon}</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 mb-5">Simple by design</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Up and running in 3 steps</h2>
            <p className="text-slate-500 max-w-md mx-auto">If you can use a smartphone, you can use LumiLedger. Set up in under 2 minutes.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map(s => (
                <div key={s.n} className="relative text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-extrabold text-3xl shadow-xl ${s.glow} mx-auto mb-5 relative z-10`}>{s.n}</div>
                  <h3 className="font-bold text-slate-900 mb-2 text-lg">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 text-center">
            <Link to="/register" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-[1.02] transition-all">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-3 text-xs text-slate-400">No credit card. No setup fee. Ready in minutes.</p>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Built for two kinds of people</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Same platform. Different experience. Adapted to how you work.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/20">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">For Business Owners</h3>
                  <p className="text-xs text-slate-400">Simple, clear, non-technical</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  "Stay in control of your business money",
                  "Know exactly what your business owes you",
                  "Track invoices, expenses, and profit simply",
                  "Advanced tools available when you need them",
                ].map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm">{f}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-emerald-400 font-semibold italic">"I understand my money in seconds"</p>
            </div>
            <div className="bg-slate-800/60 rounded-2xl border border-indigo-500/30 p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/20">
                  <Calculator className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">For Accountants</h3>
                  <p className="text-xs text-slate-400">Powerful, structured, professional</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  "Manage multiple businesses from one dashboard",
                  "Full journal entries and chart of accounts",
                  "Trial balance, P&L, and balance sheet reports",
                  "Team roles and client access controls",
                ].map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm">{f}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-indigo-400 font-semibold italic">"I have full control over the books"</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-1 mb-5">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Trusted by 100+ businesses</h2>
            <p className="text-slate-500 max-w-lg mx-auto">₦50M+ tracked. Real businesses. Real clarity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">{t.metric}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{t.initials}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-5">
              <Zap className="w-3.5 h-3.5" /> 30-Day Free Trial — Full Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Simple pricing.<br className="hidden sm:block" /> Start free, scale when you're ready.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">Try everything for 30 days. No restrictions. No card needed.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {/* FREE TRIAL */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-5 self-start border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Free Trial
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mb-1">₦0</p>
              <p className="text-slate-500 text-sm mb-2">for 30 days</p>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">Full access. No restrictions. No card needed.</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["All features included", "Invoicing & payments", "Capital tracking", "Financial reports"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link to="/register" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition text-sm">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-slate-400 mt-2">No card. No commitment.</p>
              </div>
            </div>

            {/* ESSENTIAL — hero */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 pt-8 shadow-2xl shadow-blue-600/40 flex flex-col sm:-mt-4 sm:-mb-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-700 text-xs font-extrabold rounded-full shadow-lg border border-blue-100">⭐ Most Popular</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-5 self-start tracking-widest uppercase">Essential</div>
              <div className="mb-1">
                <span className="text-4xl font-extrabold text-white">₦9,900</span>
                <span className="text-blue-200 text-sm ml-1">/month</span>
              </div>
              <p className="text-blue-200 text-sm mb-5">For business owners managing their finances</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Invoicing & payments", "Expense tracking", "Financial reports", "✅ Capital tracking", "Up to 50 clients", "Email reminders"].map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${f.startsWith("✅") ? "text-white font-semibold" : "text-white"}`}>
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${f.startsWith("✅") ? "text-emerald-300" : "text-blue-200"}`} />
                    {f.replace("✅ ", "")}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link to="/register" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-blue-700 font-extrabold rounded-xl hover:bg-blue-50 transition shadow-lg text-sm">
                  Start 30-Day Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-blue-300 mt-2">Then ₦9,900/month. Cancel anytime.</p>
              </div>
            </div>

            {/* BUSINESS */}
            <div className="bg-slate-900 rounded-2xl border-2 border-slate-700 p-6 flex flex-col">
              <div className="inline-flex items-center px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full mb-5 self-start border border-indigo-500/30 tracking-widest uppercase">Business</div>
              <div className="mb-1">
                <span className="text-3xl font-extrabold text-white">₦24,900</span>
                <span className="text-slate-400 text-sm ml-1">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-5">For growing businesses that need more</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Everything in Essential", "Unlimited clients", "Multi-user access", "Advanced reports", "Chart of Accounts", "Journal Entries"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link to="/register" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition shadow-lg text-sm">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-slate-500 mt-2">Then ₦24,900/month.</p>
              </div>
            </div>

            {/* ACCOUNTANT PRO */}
            <div className="bg-white rounded-2xl border-2 border-violet-200 p-6 flex flex-col">
              <div className="inline-flex items-center px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full mb-5 self-start border border-violet-200 tracking-widest uppercase">Accountant Pro</div>
              <div className="mb-1">
                <span className="text-3xl font-extrabold text-slate-900">₦59,900</span>
                <span className="text-slate-400 text-sm ml-1">/month</span>
              </div>
              <p className="text-slate-500 text-sm mb-5">For accountants managing multiple clients</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Everything in Business", "✦ Expense reporting & claims", "Audit Trail (full activity log)", "VAT & WHT tracking (FIRS)", "Multi-business management", "Team roles & permissions", "Priority support"].map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${f.startsWith("✦") ? "text-violet-700 font-semibold" : "text-slate-600"}`}>
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${f.startsWith("✦") ? "text-violet-500" : "text-violet-400"}`} />
                    {f.replace("✦ ", "")}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-violet-600 font-semibold italic mb-4">Built for accountants managing multiple clients</p>
              <div className="mt-auto">
                <Link to="/register" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition shadow-lg text-sm">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-slate-400 mt-2">Then ₦59,900/month.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { icon: <Shield className="w-4 h-4 text-emerald-600" />,      text: "No hidden fees" },
              { icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, text: "Cancel anytime" },
              { icon: <Clock className="w-4 h-4 text-emerald-600" />,       text: "Set up in under 2 minutes" },
              { icon: <Layers className="w-4 h-4 text-emerald-600" />,      text: "Your data is always preserved" },
            ].map(t => (
              <div key={t.text} className="flex items-center gap-2 text-sm text-slate-600">{t.icon}{t.text}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAYMENT SETUP & ONBOARDING SUPPORT ──────────────────────────── */}
      <section className="py-20 sm:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl px-6 sm:px-12 py-14 sm:py-20 shadow-2xl shadow-blue-900/40 overflow-hidden">

            {/* Background glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

              {/* Left — copy */}
              <div className="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 rounded-full text-xs font-semibold mb-6 tracking-wide uppercase">
                  <BadgeCheck className="w-3.5 h-3.5" /> Payment Setup & Onboarding Support
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-5">
                  We help you get paid —<br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">
                    without the setup stress
                  </span>
                </h2>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                  No need to figure out integrations or payment systems yourself.
                  We guide you through setting up Paystack, bank transfer, and other
                  payment methods so your clients can pay you <em className="not-italic text-white font-medium">directly from your invoices</em>.
                </p>

                <ul className="space-y-4 mb-10 text-left">
                  {[
                    { icon: <CreditCard className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />, text: "Set up Paystack in minutes with guided support" },
                    { icon: <Banknote   className="w-4 h-4 text-blue-400   flex-shrink-0 mt-0.5" />, text: "Display your bank account on every invoice automatically" },
                    { icon: <Zap        className="w-4 h-4 text-amber-400  flex-shrink-0 mt-0.5" />, text: "Start receiving payments immediately — no technical experience needed" },
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-start gap-3 text-slate-200 text-sm sm:text-base">
                      {icon}
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-slate-400 text-sm mb-8 flex items-center gap-2 justify-center lg:justify-start">
                  <Shield className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  Available during your free trial. We make sure everything works before you start.
                </p>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-blue-700/30 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all text-sm"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right — visual mock */}
              <div className="flex-shrink-0 w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0">
                <div className="relative">
                  {/* Phone frame */}
                  <div className="relative mx-auto w-64 sm:w-72">
                    {/* Glow behind phone */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-3xl blur-2xl scale-110" />

                    <div className="relative bg-slate-800 rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden">
                      {/* Phone notch */}
                      <div className="flex justify-center pt-3 pb-2">
                        <div className="w-20 h-1.5 bg-slate-700 rounded-full" />
                      </div>

                      {/* Screen */}
                      <div className="px-4 pb-6 space-y-3">
                        {/* App header */}
                        <div className="flex items-center justify-between py-2 border-b border-slate-700/60">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                              <FileText className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-white text-xs font-bold">LumiLedger</span>
                          </div>
                          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                        </div>

                        {/* Payment received notification card */}
                        <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-3.5">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-emerald-300 text-xs font-bold">Payment Received!</p>
                              <p className="text-white text-xs font-semibold mt-0.5">₦550,000</p>
                              <p className="text-slate-400 text-[11px] mt-0.5">Phoenix Plus — Web Redesign</p>
                            </div>
                          </div>
                        </div>

                        {/* Invoice status row */}
                        <div className="bg-slate-700/50 rounded-xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Receipt className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-300 text-xs">INV-0042</span>
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                            PAID
                          </span>
                        </div>

                        {/* Paystack row */}
                        <div className="bg-slate-700/50 rounded-xl p-3 flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-extrabold text-blue-700">P</span>
                          </div>
                          <div>
                            <p className="text-slate-200 text-xs font-semibold">Paystack</p>
                            <p className="text-slate-500 text-[11px]">Connected &amp; ready</p>
                          </div>
                          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60" />
                        </div>

                        {/* Bank row */}
                        <div className="bg-slate-700/50 rounded-xl p-3 flex items-center gap-2.5">
                          <Banknote className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <div>
                            <p className="text-slate-200 text-xs font-semibold">Bank Transfer</p>
                            <p className="text-slate-500 text-[11px]">GTBank • 0123456789</p>
                          </div>
                          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating "just received" badge */}
                  <div className="absolute -top-3 -right-2 sm:-right-6 bg-white rounded-xl shadow-xl px-3 py-2 flex items-center gap-2 border border-slate-100">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-800 leading-none">Payment confirmed</p>
                      <p className="text-[10px] text-slate-400 leading-none mt-0.5">Just now</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl px-5 sm:px-8 py-14 sm:py-20 shadow-2xl shadow-blue-600/30 overflow-hidden text-center">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-1 mb-6">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-5 h-5 text-amber-300 fill-amber-300" />)}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
              Take control of your<br />business finances today
            </h2>
            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              Join 100+ businesses already using LumiLedger to understand their money — and track what their business owes them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-extrabold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-base">
                Start Using LumiLedger <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-base backdrop-blur-sm">
                See How It Works
              </a>
            </div>
            <p className="mt-5 text-blue-300 text-sm">30-day free trial · No credit card required · Set up in 2 minutes</p>
            <p className="mt-3 text-blue-400/70 text-xs font-medium tracking-wide">LumiLedger — Your business finances, simplified.</p>
          </div>
        </div>
      </section>

      {/* ── SUPPORT SECTION ──────────────────────────────────────────────── */}
      <section id="support" className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              <LifeBuoy className="w-4 h-4" /> Help & Support
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">We're here to help</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">Questions? Issues? Reach out to our support team.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="mailto:support@lumitechsystems.com"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-blue-300 group"
            >
              <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">Email us</p>
                <p className="text-xs text-slate-500">support@lumitechsystems.com</p>
              </div>
            </a>
            <a
              href="https://www.issuetask.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all group"
            >
              <Ticket className="w-5 h-5 group-hover:rotate-12 transition" />
              <div className="text-left">
                <p className="text-sm font-semibold">Create a support ticket</p>
                <p className="text-xs text-blue-200">Get dedicated help</p>
              </div>
            </a>
          </div>
          <p className="text-center text-xs text-slate-400 mt-8">
            Typical response time: within 24 hours (business days)
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-sm">
                <FileText className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-sm">LumiLedger<span className="text-blue-600">.</span></span>
            </div>
            <p className="text-xs text-slate-400 text-center">
              © {new Date().getFullYear()} LumiLedger by Lumitech Systems. Your business finances, simplified.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/login"    className="text-xs text-slate-500 hover:text-blue-600 transition">Sign In</Link>
              <Link to="/register" className="text-xs text-slate-500 hover:text-blue-600 transition">Register</Link>
              <a href="#support"   className="text-xs text-slate-500 hover:text-blue-600 transition">Support</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}