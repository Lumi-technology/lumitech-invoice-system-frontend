// Landing.jsx — LumiLedger marketing page
import { Link } from "react-router-dom";
import {
  FileText, CheckCircle, TrendingUp, BarChart3, Layers, ArrowRight,
  Shield, Zap, Clock, ChevronRight, BookOpen, Landmark, Bell,
  Eye, Users, Star, AlertTriangle, XCircle, Banknote, Lock,
  Wallet, PiggyBank, Briefcase, Calculator,
} from "lucide-react";

/* ─── Mock Dashboard ─────────────────────────────────────────────────────── */
function MockDashboard() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/10 rounded-3xl blur-3xl" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-slate-400 font-medium">LumiLedger — Dashboard</span>
        </div>
        {/* Capital tracking hero */}
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
        {/* Invoice rows */}
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
  { icon: <FileText className="w-5 h-5 text-indigo-600" />,   bg: "bg-indigo-50",  title: "Invoicing & Payments",           desc: "Create, send, and track invoices with Paystack payment links. Partial payments tracked automatically." },
  { icon: <BarChart3 className="w-5 h-5 text-violet-600" />,  bg: "bg-violet-50",  title: "Financial Dashboard",            desc: "Revenue, expenses, profit — updated in real time. Understand your business money at a glance." },
  { icon: <Layers className="w-5 h-5 text-amber-600" />,      bg: "bg-amber-50",   title: "Project & Client Tracking",      desc: "Group invoices by project. Track total earned vs balance remaining per client." },
  { icon: <TrendingUp className="w-5 h-5 text-rose-600" />,   bg: "bg-rose-50",    title: "Financial Reports",              desc: "Trial Balance, Profit & Loss, Balance Sheet — real accounting reports built into the platform." },
  { icon: <BookOpen className="w-5 h-5 text-cyan-600" />,     bg: "bg-cyan-50",    title: "Chart of Accounts",              desc: "Full double-entry bookkeeping — assets, liabilities, equity, income, expenses." },
  { icon: <Users className="w-5 h-5 text-teal-600" />,        bg: "bg-teal-50",    title: "Team Access & Roles",            desc: "Add admins and staff. Everyone sees exactly what they need — nothing more." },
  { icon: <Landmark className="w-5 h-5 text-slate-600" />,    bg: "bg-slate-50",   title: "Bank Statement Import",          desc: "Reconcile your books in minutes by uploading your bank statement directly.", comingSoon: true },
];

const steps = [
  { n: "1", title: "Record your transactions",       desc: "Add income, expenses, and invoices. Your dashboard updates instantly.", color: "from-blue-600 to-blue-700", glow: "shadow-blue-600/30" },
  { n: "2", title: "Track your capital investment",  desc: "Record money you put into the business and watch your recovery grow.", color: "from-indigo-600 to-indigo-700", glow: "shadow-indigo-600/30" },
  { n: "3", title: "Watch your business pay you back", desc: "As revenue comes in, see your outstanding capital decrease in real time.", color: "from-violet-600 to-violet-700", glow: "shadow-violet-600/30" },
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
              LumiLedger<span className="text-blue-600">.</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features"     className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-500 hover:text-slate:900 transition">How it works</a>
            <a href="#pricing"      className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition hidden sm:block">Sign In</Link>
            <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:scale-[1.02] transition-all">
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
                Track your business finances —{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  and your money inside it.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-8 max-w-lg">
                Manage invoices, expenses, and see exactly how much your business owes you. Built for business owners and accountants.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-[1.02] transition-all text-base">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition shadow-sm text-base">
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
              <p className="text-sm text-slate-500 mt-0.5">Businesses using LumiLedger</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">₦50M+</p>
              <p className="text-sm text-slate-500 mt-0.5">Tracked through the platform</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">SMEs + Accountants</p>
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
          <div className="grid lg:grid-cols-2 gap-16 items-center">
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
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 hover:scale-[1.02] transition-all">
                Start Tracking Your Capital <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex justify-center">
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
            <p className="text-slate-500 max-w-xl mx-auto">Built for SMEs, freelancers, agencies, and accountants who need financial clarity without complexity.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(f => (
              <div key={f.title} className={`relative bg-white rounded-2xl p-5 border transition-all hover:shadow-md hover:-translate-y-0.5 ${
                f.highlight ? "border-blue-300 shadow-md ring-1 ring-blue-100" : f.comingSoon ? "border-dashed border-slate-300" : "border-slate-200 shadow-sm"
              }`}>
                {f.highlight && (
                  <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">★ Unique</span>
                )}
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 mb-5">Simple by design</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Up and running in 3 steps</h2>
            <p className="text-slate-500 max-w-md mx-auto">If you can use a smartphone, you can use LumiLedger. Set up in under 2 minutes.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200" />
            <div className="grid md:grid-cols-3 gap-8">
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
          <div className="grid md:grid-cols-2 gap-8">
            {/* Business Owners */}
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-8">
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
            {/* Accountants */}
            <div className="bg-slate-800/60 rounded-2xl border border-indigo-500/30 p-8">
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

          <div className="grid md:grid-cols-4 gap-5 items-stretch">

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
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 shadow-2xl shadow-blue-600/40 flex flex-col md:-mt-4 md:-mb-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
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
                {["Everything in Business", "Multi-business management", "Team roles & permissions", "Priority support", "Advanced controls"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />{f}
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
              Take control of your<br />business finances today
            </h2>
            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              Join 100+ businesses already using LumiLedger to understand their money — and track what their business owes them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-extrabold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-base">
                Start Using LumiLedger <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-base backdrop-blur-sm">
                See How It Works
              </a>
            </div>
            <p className="mt-5 text-blue-300 text-sm">30-day free trial · No credit card required · Set up in 2 minutes</p>
            <p className="mt-3 text-blue-400/70 text-xs font-medium tracking-wide">LumiLedger — Your business finances, simplified.</p>
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
              <span className="font-bold text-slate-900 text-sm">LumiLedger<span className="text-blue-600">.</span></span>
            </div>
            <p className="text-xs text-slate-400 text-center">
              © {new Date().getFullYear()} LumiLedger by Lumitech Systems. Your business finances, simplified.
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
