// Landing.jsx — LumiCash marketing page
import { Link } from "react-router-dom";
import {
  FileText, CheckCircle, TrendingUp, BarChart3, Layers, ArrowRight,
  Shield, Zap, Clock, ChevronRight, BookOpen, Landmark, Bell,
  Eye, Users, Star, AlertTriangle, XCircle, Banknote, Lock,
} from "lucide-react";

/* ─── Mock dashboard UI ──────────────────────────────────────────────────── */
function MockDashboard() {
  const invoices = [
    { label: "Phoenix Plus — Web Redesign",  amount: "₦550,000", status: "Paid",    color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "TechCorp — API Integration",   amount: "₦280,000", status: "Partial", color: "text-amber-600 bg-amber-50 border-amber-200" },
    { label: "Nova Agency — Brand Identity", amount: "₦190,000", status: "Unpaid",  color: "text-rose-600 bg-rose-50 border-rose-200" },
  ];
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/10 rounded-3xl blur-3xl" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Window chrome */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-slate-400 font-medium">LumiCash — Dashboard</span>
        </div>
        {/* Outstanding Revenue — hero stat */}
        <div className="mx-4 mt-4 mb-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide">Outstanding Revenue</p>
            <p className="text-xl font-extrabold text-rose-700 mt-0.5">₦470,000</p>
          </div>
          <div className="text-xs text-rose-500 text-right">
            <p className="font-medium">2 unpaid</p>
            <p>1 partial</p>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 divide-x divide-slate-100 border-y border-slate-100 mx-0">
          {[
            { label: "Total Invoiced", value: "₦1.02M", color: "text-slate-900" },
            { label: "Collected",      value: "₦550K",  color: "text-emerald-600" },
          ].map(s => (
            <div key={s.label} className="px-4 py-3 text-center">
              <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        {/* Invoice rows */}
        <div className="divide-y divide-slate-50">
          {invoices.map(inv => (
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
        {/* Progress */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Collection rate this month</span>
            <span className="text-xs font-bold text-blue-600">54%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "54%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Partial Payment Visual ─────────────────────────────────────────────── */
function PartialPaymentCard() {
  return (
    <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-sm w-full">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">TechCorp — API Integration</p>
          <p className="text-xs text-slate-400 mt-0.5">Invoice #INV-0042</p>
        </div>
        <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full font-bold">Partial</span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Invoice Total", value: "₦280,000", color: "text-slate-900" },
            { label: "Paid So Far",   value: "₦120,000", color: "text-emerald-600" },
            { label: "Still Owed",    value: "₦160,000", color: "text-rose-600"    },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <p className={`text-sm font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Payment progress</span><span className="font-bold text-blue-600">43% collected</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: "43%" }} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Payment history</p>
          {[
            { date: "Mar 12, 2026", amount: "₦80,000", note: "Initial deposit" },
            { date: "Mar 28, 2026", amount: "₦40,000", note: "Milestone 1" },
          ].map(p => (
            <div key={p.date} className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
              <div>
                <p className="text-xs font-semibold text-slate-800">{p.note}</p>
                <p className="text-xs text-slate-400">{p.date}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">{p.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const testimonials = [
  {
    quote: "I didn't realize how much clients owed me until I started using LumiCash. I had ₦340,000 outstanding that I wasn't tracking properly. Found it on day one.",
    name: "Amara O.",
    role: "Freelance Designer, Lagos",
    initials: "AO",
    color: "from-blue-500 to-indigo-600",
    metric: "₦340K recovered",
  },
  {
    quote: "The partial payment tracking alone changed everything. Before, I had no idea which clients had paid half and who was avoiding me. Now I know instantly.",
    name: "Chidi N.",
    role: "Tech Agency Owner, Abuja",
    initials: "CN",
    color: "from-emerald-500 to-teal-600",
    metric: "Payment cycle: 45 → 14 days",
  },
  {
    quote: "Setting up took 5 minutes. I sent my first invoice that same day. The dashboard shows me exactly who owes what — it's the clarity I never had with spreadsheets.",
    name: "Funmilayo B.",
    role: "Branding Consultant, Ibadan",
    initials: "FB",
    color: "from-violet-500 to-purple-600",
    metric: "Set up in under 5 min",
  },
];

const benefits = [
  {
    icon: <Zap className="w-5 h-5 text-blue-600" />,
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    badgeText: "Instant",
    title: "Send invoices in seconds",
    desc: "Create a professional, branded invoice and deliver it to your client with a payment link — in under 2 minutes. No design skills needed.",
  },
  {
    icon: <Eye className="w-5 h-5 text-indigo-600" />,
    bg: "bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-700",
    badgeText: "Visibility",
    title: "Know exactly which clients have paid — and who hasn't",
    desc: "See every invoice status in real time. Paid, partial, overdue — no guesswork, no chasing Excel rows.",
  },
  {
    icon: <Bell className="w-5 h-5 text-violet-600" />,
    bg: "bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    badgeText: "Automated",
    title: "Get paid faster with automatic reminders",
    desc: "Let LumiCash follow up for you. Polite, timed reminders go out automatically so your clients never forget.",
  },
  {
    icon: <Banknote className="w-5 h-5 text-emerald-600" />,
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    badgeText: "Complete",
    title: "Understand your business money at a glance",
    desc: "Chart of accounts, journal entries, profit & loss, balance sheet — accounting-grade tools without the accountant price tag.",
  },
];

const features = [
  { icon: <FileText className="w-5 h-5 text-blue-600" />,    bg: "bg-blue-50",    title: "Know which clients owe you — and exactly how much",  desc: "Every invoice status is live. Paid, partial, or overdue — see the full picture instantly." },
  { icon: <BarChart3 className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50",  title: "Understand your business money at a glance",           desc: "Total invoiced, collected, and outstanding — updated in real time on your dashboard." },
  { icon: <Layers className="w-5 h-5 text-violet-600" />,    bg: "bg-violet-50",  title: "See how much each project has earned — and what's left", desc: "Group invoices by project. Track total earned vs balance remaining per client." },
  { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50", title: "Track partial payments without confusion",            desc: "Clients pay in parts? LumiCash tracks every instalment and always shows the right balance." },
  { icon: <Users className="w-5 h-5 text-amber-600" />,      bg: "bg-amber-50",   title: "Team access with the right permissions",              desc: "Add admins and staff. Everyone sees exactly what they need — nothing more." },
  { icon: <TrendingUp className="w-5 h-5 text-rose-600" />,  bg: "bg-rose-50",    title: "Financial reports that actually make sense",           desc: "Trial Balance, Profit & Loss, Balance Sheet — built right into the platform." },
  { icon: <BookOpen className="w-5 h-5 text-cyan-600" />,    bg: "bg-cyan-50",    title: "Full chart of accounts for serious bookkeeping",      desc: "Double-entry accounting — assets, liabilities, equity, income, expenses." },
  { icon: <Landmark className="w-5 h-5 text-teal-600" />,    bg: "bg-teal-50",    title: "Bank statement import (coming soon)",                 desc: "Reconcile your books in minutes by uploading your bank statement directly.", comingSoon: true },
];

const steps = [
  { n: "1", title: "Create your invoice",    desc: "Add your client, line items, and due date. Done in under 2 minutes.", color: "from-blue-600 to-blue-700",    glow: "shadow-blue-600/30" },
  { n: "2", title: "Send to your client",    desc: "Your client receives a professional invoice with a one-click payment link.", color: "from-indigo-600 to-indigo-700", glow: "shadow-indigo-600/30" },
  { n: "3", title: "Get paid. Track it all", desc: "Payments are recorded automatically. Your outstanding balance updates instantly.", color: "from-violet-600 to-violet-700", glow: "shadow-violet-600/30" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-600/20">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              LumiCash<span className="text-blue-600">.</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features"      className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">Features</a>
            <a href="#how-it-works"  className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">How it works</a>
            <a href="#pricing"       className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition hidden sm:block">Sign In</Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Start Free <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 mb-7">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                30-Day Free Trial · No credit card required
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Know exactly who owes you —{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  and how much is still coming in.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-8 max-w-lg">
                Track invoices, partial payments, and project cashflow in one place — without spreadsheets or confusion.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-[1.02] transition-all text-base"
                >
                  Start Free 30-Day Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition shadow-sm text-base"
                >
                  See How It Works
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />No credit card required</div>
                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />Set up in under 2 minutes</div>
                <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />Cancel anytime</div>
              </div>
            </div>

            <MockDashboard />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ─────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">100+</p>
              <p className="text-sm text-slate-500 mt-0.5">Businesses using LumiCash</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">₦50M+</p>
              <p className="text-sm text-slate-500 mt-0.5">Tracked through the platform</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">14 days</p>
              <p className="text-sm text-slate-500 mt-0.5">Avg. payment cycle (down from 45)</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
              <span className="ml-2 text-sm font-semibold text-slate-700">4.9 / 5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── POSITIONING: Partial Payment Tracking ────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100 mb-6">
                The #1 problem we solve
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-5">
                Finally, track partial payments{" "}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">without confusion</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                When clients pay in parts, LumiCash automatically tracks what's been paid and what's still owed — so nothing slips through the cracks.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, text: "Outstanding balance recalculates after every partial payment" },
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, text: "Full payment history per invoice — date, amount, and note" },
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, text: "One dashboard showing all clients with open balances" },
                ].map(f => (
                  <div key={f.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">{f.icon}</div>
                    <p className="text-slate-700 text-sm leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 hover:scale-[1.02] transition-all"
                >
                  Start Tracking Payments <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: card */}
            <div className="flex justify-center">
              <PartialPaymentCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full border border-rose-100 mb-5">
              Sound familiar?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Running a business shouldn't mean<br className="hidden sm:block" /> chasing money all day
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
              If you're managing invoices manually, you're losing time, losing money, and losing sleep.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <XCircle className="w-6 h-6 text-rose-500" />, title: "Chasing clients for payment — every week", desc: "You send the invoice. Then nothing. You follow up. Still nothing. It eats your time and your confidence." },
              { icon: <AlertTriangle className="w-6 h-6 text-amber-500" />, title: "No idea what's been paid vs what's still owed", desc: "Partial payments, multiple clients, different projects — it breaks down fast. And mistakes cost you real money." },
              { icon: <XCircle className="w-6 h-6 text-rose-500" />, title: "Invoices that don't look like a real business", desc: "Sending a Word doc or WhatsApp message makes it easy for clients to ignore or delay. You deserve better." },
            ].map(p => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center mb-4 border border-rose-100">{p.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2 leading-snug">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg font-semibold text-slate-700">LumiCash fixes all of this — in minutes, not months.</p>
          </div>
        </div>
      </section>

      {/* ── SOLUTION / BENEFITS ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 mb-5">
              The LumiCash way
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              One platform. Every tool you need<br className="hidden sm:block" /> to get paid and stay paid.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built for how African businesses actually operate — fast, flexible, and focused on outcomes.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map(b => (
              <div key={b.title} className="flex gap-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                <div className={`w-12 h-12 ${b.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {b.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
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

      {/* ── FEATURES GRID ────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built for SMEs, freelancers, agencies, and contractors who need financial clarity without complexity.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(f => (
              <div key={f.title} className={`relative bg-white rounded-2xl p-5 border transition-all hover:shadow-md hover:-translate-y-0.5 ${f.comingSoon ? "border-dashed border-slate-300" : "border-slate-200 shadow-sm"}`}>
                {f.comingSoon && (
                  <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full border border-violet-200">Soon</span>
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 mb-5">
              Simple by design
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Up and running in 3 steps</h2>
            <p className="text-slate-500 max-w-md mx-auto">If you can send an email, you can use LumiCash. Set up in under 2 minutes.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200" />
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map(s => (
                <div key={s.n} className="relative text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-extrabold text-3xl shadow-xl ${s.glow} mx-auto mb-5 relative z-10`}>
                    {s.n}
                  </div>
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

      {/* ── DARK FEATURE SECTION ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/20 mb-6">
                Financial Clarity
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
                Your finances, always up to date — without the spreadsheet headache
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                LumiCash gives you accounting-grade tools without the accounting degree. From invoicing to full double-entry bookkeeping — everything in one place.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, text: "Outstanding balance recalculates automatically after every partial payment" },
                  { icon: <BarChart3   className="w-4 h-4 text-blue-400" />,   text: "Full payment history per project — see exactly what came in and when" },
                  { icon: <TrendingUp  className="w-4 h-4 text-indigo-400" />, text: "Trial Balance, P&L, and Balance Sheet — real financial reports built in" },
                  { icon: <Layers      className="w-4 h-4 text-amber-400" />,  text: "All outstanding balances across every client — at a glance" },
                ].map(f => (
                  <div key={f.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 p-1.5 rounded-lg bg-white/5">{f.icon}</div>
                    <p className="text-slate-300 text-sm leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Dark project card */}
            <div className="bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
              <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">TechCorp — API Integration</p>
                  <p className="text-xs text-slate-400 mt-0.5">Invoice #INV-0042</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-full font-semibold">Partial</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Invoice Total", value: "₦280,000", color: "text-white" },
                    { label: "Paid",          value: "₦120,000", color: "text-emerald-400" },
                    { label: "Outstanding",   value: "₦160,000", color: "text-rose-400" },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-700/50 rounded-xl p-3 text-center border border-slate-700/50">
                      <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Collection progress</span><span className="font-bold text-blue-400">43%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "43%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Payment history</p>
                  {[
                    { date: "Mar 12, 2026", amount: "₦80,000", note: "Initial deposit" },
                    { date: "Mar 28, 2026", amount: "₦40,000", note: "Milestone 1" },
                  ].map(p => (
                    <div key={p.date} className="flex items-center justify-between bg-slate-700/40 rounded-lg px-3 py-2.5 border border-slate-700/30">
                      <div>
                        <p className="text-xs text-white font-medium">{p.note}</p>
                        <p className="text-xs text-slate-400">{p.date}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{p.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Trusted by 100+ African businesses</h2>
            <p className="text-slate-500 max-w-lg mx-auto">₦50M+ tracked. Real businesses. Real results.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
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
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
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
              <Zap className="w-3.5 h-3.5" />30-Day Free Trial — Full Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Simple pricing.<br className="hidden sm:block" />Start free, scale when you're ready.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Try everything for 30 days. After that, your account will be locked until you subscribe.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">

            {/* Free Trial */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-5 self-start border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Free Trial
              </div>
              <p className="text-4xl font-extrabold text-slate-900 mb-1">₦0</p>
              <p className="text-slate-500 text-sm mb-2">for 30 days — full access</p>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Every feature unlocked. No restrictions. No card needed.</p>
              <ul className="space-y-3 mb-6 flex-1">
                {[
                  "All features included",
                  "Project & cashflow tracking",
                  "Client payment portal",
                  "PDF export & email reminders",
                  "Financial reports",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              {/* Lock message */}
              <div className="mb-5 flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <Lock className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">Your data stays safe. Unlock anytime by subscribing.</p>
              </div>
              <div className="mt-auto">
                <Link to="/register" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md text-sm">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-slate-400 mt-3">No card. No commitment.</p>
              </div>
            </div>

            {/* Starter — hero */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 shadow-2xl shadow-blue-600/40 flex flex-col md:-mt-4 md:-mb-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-blue-700 text-xs font-extrabold rounded-full shadow-lg border border-blue-100">
                  ⭐ Most Popular
                </span>
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-6 self-start tracking-widest uppercase">Starter</div>
              <div className="mb-2">
                <span className="text-5xl font-extrabold text-white">₦9,900</span>
                <span className="text-blue-200 text-sm ml-1">/month</span>
              </div>
              <p className="text-blue-200 text-sm mb-6">For freelancers and small teams managing client work</p>
              <ul className="space-y-3 mb-8 flex-1">
                {["Up to 50 clients", "Unlimited invoices", "Project-based tracking", "Partial payment tracking", "Automatic email reminders", "Paystack payment links"].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-blue-200 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link to="/register" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-blue-700 font-extrabold rounded-xl hover:bg-blue-50 transition-all shadow-lg text-sm">
                  Start 30-Day Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-blue-300 mt-3">Then ₦9,900/month. Cancel anytime.</p>
              </div>
            </div>

            {/* Growth */}
            <div className="bg-slate-900 rounded-2xl border-2 border-slate-700 p-8 flex flex-col">
              <div className="inline-flex items-center px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full mb-6 self-start border border-indigo-500/30 tracking-widest uppercase">Growth</div>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-white">₦24,900</span>
                <span className="text-slate-400 text-sm ml-1">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">For growing businesses that need team collaboration</p>
              <ul className="space-y-3 mb-8 flex-1">
                {["Unlimited clients", "Unlimited invoices", "Everything in Starter", "Multi-user access", "Team roles (Admin, Staff)", "Advanced financial reports", "Chart of Accounts", "Priority support"].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link to="/register" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm">
                  Start 30-Day Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-slate-500 mt-3">Then ₦24,900/month. Cancel anytime.</p>
              </div>
            </div>
          </div>

          {/* Trust row */}
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

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl px-8 py-20 shadow-2xl shadow-blue-600/30 overflow-hidden text-center">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-1 mb-6">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-5 h-5 text-amber-300 fill-amber-300" />)}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
              Stop guessing your finances.<br />Start tracking them.
            </h2>
            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              Join 100+ businesses already using LumiCash to know exactly who owes them — and get paid faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-extrabold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-base"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-base backdrop-blur-sm"
              >
                Get Started Now
              </Link>
            </div>
            <p className="mt-5 text-blue-300 text-sm">30-day free trial · No credit card required · Set up in 2 minutes</p>
            <p className="mt-3 text-blue-400/70 text-xs font-medium tracking-wide">LumiCash — Your business money, simplified.</p>
          </div>
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
              <span className="font-bold text-slate-900 text-sm">LumiCash<span className="text-blue-600">.</span></span>
            </div>
            <p className="text-xs text-slate-400 text-center">
              © {new Date().getFullYear()} LumiCash by Lumitech Systems. Your business money, simplified.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/login"    className="text-xs text-slate-500 hover:text-blue-600 transition">Sign In</Link>
              <Link to="/register" className="text-xs text-slate-500 hover:text-blue-600 transition">Register</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
