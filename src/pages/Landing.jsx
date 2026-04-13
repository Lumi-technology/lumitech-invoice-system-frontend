// Landing.jsx — LumiCash marketing page (redesigned)
import { Link } from "react-router-dom";
import {
  FileText, CheckCircle, TrendingUp, BarChart3, Layers, ArrowRight,
  Shield, Zap, Clock, ChevronRight, BookOpen, Landmark, Bell,
  Eye, Users, Star, AlertTriangle, XCircle, Banknote,
} from "lucide-react";

/* ─── Mock product UI ────────────────────────────────────────────────────── */
function MockDashboard() {
  const invoices = [
    { label: "Phoenix Plus — Web Redesign",    amount: "₦550,000", status: "Paid",    color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "TechCorp — API Integration",     amount: "₦280,000", status: "Partial", color: "text-amber-600 bg-amber-50 border-amber-200" },
    { label: "Nova Agency — Brand Identity",   amount: "₦190,000", status: "Unpaid",  color: "text-rose-600 bg-rose-50 border-rose-200" },
  ];
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/10 rounded-3xl blur-3xl" />
      <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Window chrome */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-slate-50 to-white">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-slate-400 font-medium">LumiCash — Dashboard</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-16 h-2 bg-slate-100 rounded-full" />
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
          {[
            { label: "Total Invoiced", value: "₦1.02M",  color: "text-slate-900" },
            { label: "Collected",      value: "₦550K",   color: "text-emerald-600" },
            { label: "Outstanding",    value: "₦470K",   color: "text-rose-500" },
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
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-400/30">
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
        <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500 font-medium">Collection rate this month</span>
            <span className="text-xs font-bold text-blue-600">54%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: "54%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const testimonials = [
  {
    quote: "Before LumiCash I was using Excel to track payments. I didn't even know I had ₦340,000 outstanding until I switched. Now I chase it every week.",
    name: "Amara O.",
    role: "Freelance Designer, Lagos",
    initials: "AO",
    color: "from-blue-500 to-indigo-600",
  },
  {
    quote: "My clients now pay faster. The payment portal link in the invoice makes it effortless for them. Our payment cycle dropped from 45 days to under 14.",
    name: "Chidi N.",
    role: "Tech Agency Owner, Abuja",
    initials: "CN",
    color: "from-emerald-500 to-teal-600",
  },
  {
    quote: "Setting up took about 5 minutes. I sent my first real invoice that same day. The dashboard is genuinely the clearest I've used for a tool like this.",
    name: "Funmilayo B.",
    role: "Branding Consultant, Ibadan",
    initials: "FB",
    color: "from-violet-500 to-purple-600",
  },
];

const painPoints = [
  {
    icon: <XCircle className="w-6 h-6 text-rose-500" />,
    title: "Chasing clients for payment — every single week",
    desc: "You send the invoice. Then nothing. You follow up. Still nothing. It's exhausting — and it takes time away from the work you should be doing.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    title: "No idea what's been paid and what's still outstanding",
    desc: "Partial payments, multiple clients, different projects — keeping track in your head or a spreadsheet breaks down fast. And mistakes cost you money.",
  },
  {
    icon: <XCircle className="w-6 h-6 text-rose-500" />,
    title: "Invoices that don't look like a real business",
    desc: "Sending a Word document or a WhatsApp message as your invoice signals amateurism. It also makes it easier for clients to delay or ignore payment.",
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
    title: "Know when clients view your invoice",
    desc: "Track exactly when your invoice was opened. Stop wondering if it was received — follow up with confidence, not guesswork.",
  },
  {
    icon: <Bell className="w-5 h-5 text-violet-600" />,
    bg: "bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    badgeText: "Automated",
    title: "Automatic payment reminders",
    desc: "Let LumiCash chase clients for you. Polite, timed reminders go out automatically so you never have to send an awkward follow-up again.",
  },
  {
    icon: <Banknote className="w-5 h-5 text-emerald-600" />,
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    badgeText: "Complete",
    title: "Manage all your finances in one place",
    desc: "Chart of accounts, journal entries, profit & loss, balance sheet — accounting-grade tools built for real businesses, without the accountant price tag.",
  },
];

const features = [
  { icon: <FileText className="w-5 h-5 text-blue-600" />,    bg: "bg-blue-50",    title: "Professional Invoices",      desc: "Branded invoices with your logo, line items, and a direct payment link. Clients can pay online." },
  { icon: <BarChart3 className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50",  title: "Cashflow Dashboard",         desc: "See your total invoiced, collected, and outstanding at a glance — updated in real time." },
  { icon: <Layers className="w-5 h-5 text-violet-600" />,    bg: "bg-violet-50",  title: "Project-Based Tracking",     desc: "Group invoices by project. See total earned, amount paid, and balance remaining per client." },
  { icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50", title: "Partial Payment Support",  desc: "Record multiple payments against one invoice. The outstanding balance always stays accurate." },
  { icon: <Users className="w-5 h-5 text-amber-600" />,      bg: "bg-amber-50",   title: "Team Roles",                 desc: "Add admins and staff with controlled permissions. Everyone sees exactly what they need to." },
  { icon: <TrendingUp className="w-5 h-5 text-rose-600" />,  bg: "bg-rose-50",    title: "Financial Reports",          desc: "Trial Balance, Profit & Loss, Balance Sheet — built right into the platform." },
  { icon: <BookOpen className="w-5 h-5 text-cyan-600" />,    bg: "bg-cyan-50",    title: "Chart of Accounts",          desc: "Full double-entry bookkeeping with assets, liabilities, equity, income and expenses." },
  { icon: <Landmark className="w-5 h-5 text-teal-600" />,    bg: "bg-teal-50",    title: "Bank Statement Import",      desc: "Upload bank statements and reconcile your books in minutes.", comingSoon: true },
];

const steps = [
  {
    n: "1",
    title: "Create your invoice",
    desc: "Add your client, line items, and due date. Your invoice is ready in under 2 minutes.",
    color: "from-blue-600 to-blue-700",
    glow: "shadow-blue-600/30",
  },
  {
    n: "2",
    title: "Send it to your client",
    desc: "Your client gets a professional invoice with a one-click payment link. No friction.",
    color: "from-indigo-600 to-indigo-700",
    glow: "shadow-indigo-600/30",
  },
  {
    n: "3",
    title: "Get paid & track it",
    desc: "Payments are recorded automatically. Your dashboard updates in real time.",
    color: "from-violet-600 to-violet-700",
    glow: "shadow-violet-600/30",
  },
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
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">How it works</a>
            <a href="#pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition hidden sm:block">
              Sign In
            </Link>
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
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 mb-7">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                30-Day Free Trial · No credit card required
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Get Paid Faster{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Without the Stress
                  </span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 300 4" fill="none">
                    <path d="M0 2 Q75 0 150 2 Q225 4 300 2" stroke="url(#underline)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <defs>
                      <linearGradient id="underline" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#2563eb" /><stop offset="1" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-8 max-w-lg">
                LumiCash is the invoicing platform built for African businesses. Send professional invoices, track every payment, and always know what you're owed.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-[1.02] transition-all text-base"
                >
                  Start Free — It's Free <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-sm text-base"
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

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">100+</p>
              <p className="text-sm text-slate-500 mt-0.5">Businesses using LumiCash</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">₦50M+</p>
              <p className="text-sm text-slate-500 mt-0.5">Invoiced through the platform</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">14 days</p>
              <p className="text-sm text-slate-500 mt-0.5">Average payment cycle (down from 45)</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-700">4.9 / 5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full border border-rose-100 mb-5">
              Sound familiar?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Running a business shouldn't feel<br className="hidden sm:block" /> like chasing money all day
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
              If you're managing invoices manually, you're losing time, losing money, and losing sleep. You're not alone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {painPoints.map(p => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center mb-4 border border-rose-100">
                  {p.icon}
                </div>
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
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 mb-5">
              The LumiCash way
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              One platform. Every tool you need<br className="hidden sm:block" /> to get paid and stay paid.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              Designed for how African businesses actually operate — fast, flexible, and built around outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map(b => (
              <div key={b.title} className="flex gap-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                <div className={`w-12 h-12 ${b.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {b.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-slate-900">{b.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.badge}`}>{b.badgeText}</span>
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
            <p className="text-slate-500 max-w-xl mx-auto">Built for SMEs, freelancers, agencies, and contractors who need clarity without complexity.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(f => (
              <div key={f.title} className={`relative bg-white rounded-2xl p-5 border transition-all hover:shadow-md hover:-translate-y-0.5 ${f.comingSoon ? "border-dashed border-slate-300" : "border-slate-200 shadow-sm"}`}>
                {f.comingSoon && (
                  <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full border border-violet-200">
                    Soon
                  </span>
                )}
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4 border border-slate-100`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 mb-5">
              Simple by design
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Up and running in 3 steps</h2>
            <p className="text-slate-500 max-w-md mx-auto">If you can send an email, you can use LumiCash. Set up in under 2 minutes.</p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200" />

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
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
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-[1.02] transition-all"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-3 text-xs text-slate-400">No credit card. No setup fee. Ready in minutes.</p>
          </div>
        </div>
      </section>

      {/* ── FEATURE DEEP DIVE (dark section) ─────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/20 mb-6">
                Financial Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
                Your finances, always up to date — without the spreadsheet headache
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                LumiCash gives you accounting-grade tools without the accounting degree. From invoicing to full double-entry bookkeeping — everything in one place.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, text: "Remaining balance recalculates automatically after every partial payment" },
                  { icon: <BarChart3 className="w-4 h-4 text-blue-400" />,     text: "Full payment history per project — see exactly what came in and when" },
                  { icon: <TrendingUp className="w-4 h-4 text-indigo-400" />,  text: "Trial Balance, P&L, and Balance Sheet — real financial reports, built in" },
                  { icon: <Layers className="w-4 h-4 text-amber-400" />,       text: "Outstanding balances across all clients at a glance — no digging required" },
                ].map(f => (
                  <div key={f.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 p-1.5 rounded-lg bg-white/5">{f.icon}</div>
                    <p className="text-slate-300 text-sm leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini project card */}
            <div className="bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
              <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">TechCorp — API Integration</p>
                  <p className="text-xs text-slate-400 mt-0.5">Project #PRJ-009</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-full font-semibold">Partial</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Invoice Total",  value: "₦280,000", color: "text-white" },
                    { label: "Paid",           value: "₦120,000", color: "text-emerald-400" },
                    { label: "Outstanding",    value: "₦160,000", color: "text-rose-400" },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-700/50 rounded-xl p-3 text-center border border-slate-700/50">
                      <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Collection progress</span><span className="font-semibold text-blue-400">43%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "43%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Payment history</p>
                  {[
                    { date: "Mar 12, 2026", amount: "₦80,000", note: "Initial deposit" },
                    { date: "Mar 28, 2026", amount: "₦40,000", note: "Milestone 1"     },
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
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Trusted by 100+ African businesses</h2>
            <p className="text-slate-500 max-w-lg mx-auto">From Lagos to Abuja to Ibadan — LumiCash users get paid faster and sleep better at night.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
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
              <Zap className="w-3.5 h-3.5" />Free plan available — no card needed
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Simple pricing.<br className="hidden sm:block" />Start free, scale when you're ready.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">Full access for 30 days. After that, choose the plan that fits your business.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">

            {/* Free Trial */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-6 self-start border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Free Trial
              </div>
              <p className="text-4xl font-extrabold text-slate-900 mb-1">₦0</p>
              <p className="text-slate-500 text-sm mb-2">for 30 days</p>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Full access to every feature. No restrictions. No card needed. Ever.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Starter — free",
                  "Unlimited invoices & clients",
                  "Project & cashflow tracking",
                  "Client payment portal",
                  "PDF export & email reminders",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
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
              <div className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-6 self-start tracking-widest uppercase">
                Starter
              </div>
              <div className="mb-2">
                <span className="text-5xl font-extrabold text-white">₦9,900</span>
                <span className="text-blue-200 text-sm ml-1">/month</span>
              </div>
              <p className="text-blue-200 text-sm mb-6">For freelancers and small teams managing client work</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Up to 50 clients",
                  "Unlimited invoices",
                  "Project-based tracking",
                  "Partial payment tracking",
                  "Automatic email reminders",
                  "Paystack payment links",
                ].map(f => (
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
              <div className="inline-flex items-center px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full mb-6 self-start border border-indigo-500/30 tracking-widest uppercase">
                Growth
              </div>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-white">₦24,900</span>
                <span className="text-slate-400 text-sm ml-1">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">For growing businesses that need team collaboration</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Unlimited clients",
                  "Unlimited invoices",
                  "Everything in Starter",
                  "Multi-user access",
                  "Team roles (Admin, Staff)",
                  "Advanced financial reports",
                  "Chart of Accounts",
                  "Priority support",
                ].map(f => (
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

          {/* Trust signals */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { icon: <Shield className="w-4 h-4 text-emerald-600" />,       text: "No hidden fees" },
              { icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,  text: "Cancel anytime" },
              { icon: <Clock className="w-4 h-4 text-emerald-600" />,        text: "Set up in under 2 minutes" },
              { icon: <Layers className="w-4 h-4 text-emerald-600" />,       text: "Your data is always preserved" },
            ].map(t => (
              <div key={t.text} className="flex items-center gap-2 text-sm text-slate-600">
                {t.icon}{t.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl px-8 py-20 shadow-2xl shadow-blue-600/30 overflow-hidden text-center">
          {/* Decorative */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1 mb-6">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-5 h-5 text-amber-300 fill-amber-300" />)}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
              Start Sending Invoices Today
            </h2>
            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              Join 100+ businesses already using LumiCash to get paid faster, track every naira, and take back control of their finances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-extrabold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-base"
              >
                Start Free — No Card Needed <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-base backdrop-blur-sm"
              >
                Sign In to Your Account
              </Link>
            </div>
            <p className="mt-5 text-blue-300 text-sm">30-day free trial · No credit card required · Set up in 2 minutes</p>
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
              © {new Date().getFullYear()} LumiCash by Lumitech Systems. Built for African businesses.
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
