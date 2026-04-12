// Landing.jsx — public marketing page
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Layers,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  ChevronRight,
} from "lucide-react";

/* ── tiny mock dashboard card ── */
function MockDashboard() {
  const invoices = [
    { label: "Phoenix Plus — Web Redesign", amount: "₦550,000", status: "Paid", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "TechCorp — API Integration", amount: "₦280,000", status: "Partial", color: "text-amber-600 bg-amber-50 border-amber-200" },
    { label: "Nova Agency — Brand Kit", amount: "₦190,000", status: "Unpaid", color: "text-rose-600 bg-rose-50 border-rose-200" },
  ];
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* title bar */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-slate-400 font-medium">LumiCash — Dashboard</span>
        </div>
        {/* stat row */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
          {[
            { label: "Total Invoiced", value: "₦1.02M", color: "text-slate-900" },
            { label: "Collected", value: "₦550K", color: "text-emerald-600" },
            { label: "Outstanding", value: "₦470K", color: "text-rose-600" },
          ].map(s => (
            <div key={s.label} className="px-4 py-3 text-center">
              <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        {/* invoice rows */}
        <div className="divide-y divide-slate-50">
          {invoices.map(inv => (
            <div key={inv.label} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs text-slate-700 truncate">{inv.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-semibold text-slate-900">{inv.amount}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${inv.color}`}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
        {/* cashflow bar */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Project cashflow</span>
            <span className="text-xs font-semibold text-slate-700">54% collected</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "54%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

const valueProps = [
  {
    icon: <Zap className="w-5 h-5 text-blue-600" />,
    bg: "bg-blue-50",
    title: "Smart Invoicing",
    desc: "Create and send professional invoices in seconds. No accounting degree needed.",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    bg: "bg-emerald-50",
    title: "Track Partial Payments",
    desc: "Never lose track of what's been paid and what's still outstanding — ever again.",
  },
  {
    icon: <Layers className="w-5 h-5 text-indigo-600" />,
    bg: "bg-indigo-50",
    title: "Project-Based Tracking",
    desc: "See how much each project has earned versus what's still left to collect.",
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-amber-600" />,
    bg: "bg-amber-50",
    title: "Cashflow Clarity",
    desc: "Know exactly where your money is going — at a glance, every single day.",
  },
];

const steps = [
  { n: "01", title: "Create a project", desc: "Set up a project and link it to a client in under 30 seconds." },
  { n: "02", title: "Send an invoice", desc: "Issue branded invoices instantly with one click. Clients get a payment link." },
  { n: "03", title: "Record payments", desc: "Log full or partial payments as they come in. The balance updates automatically." },
  { n: "04", title: "Track everything", desc: "See live cashflow, outstanding balances, and payment history per project." },
];

const trustItems = [
  { icon: <Shield className="w-5 h-5 text-blue-600" />, title: "Built for real businesses", desc: "Designed around how SMEs, freelancers, and agencies actually work." },
  { icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, title: "Designed for clarity", desc: "No cluttered dashboards. No confusing reports. Just the numbers that matter." },
  { icon: <Clock className="w-5 h-5 text-indigo-600" />, title: "No accounting knowledge required", desc: "If you can send an email, you can use this. That's the whole point." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-lg">LumiCash</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Sign In
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Start Free Trial <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 mb-6">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              30-Day Free Trial · No credit card required
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-6">
              Know who owes you.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Track every project.
              </span>{" "}
              Stay in control of your money.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
              Send invoices, track payments, and monitor project cashflow — all in one simple system built for how your business actually runs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-[1.02] transition-all"
              >
                Start Free 30-Day Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
              >
                See How It Works
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Free for 30 days. Full access. Cancel anytime.
            </p>
          </div>
          <MockDashboard />
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="bg-slate-50 border-y border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything you need. Nothing you don't.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built for SMEs, freelancers, agencies, and contractors who need clarity without complexity.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all group">
                <div className={`w-10 h-10 ${v.bg} rounded-xl flex items-center justify-center mb-4`}>
                  {v.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Up and running in minutes</h2>
          <p className="text-slate-500 max-w-md mx-auto">Four simple steps and your finances are completely under control.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-slate-200 to-transparent -translate-x-4 z-0" />
              )}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/20 mb-4">
                  {s.n}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURE HIGHLIGHT ── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/20 mb-6">
                Financial Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                Your project finances, always up to date
              </h2>
              <div className="space-y-5">
                {[
                  { icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, text: "Remaining balance calculated automatically after every payment" },
                  { icon: <BarChart3 className="w-4 h-4 text-blue-400" />, text: "Full payment history per project — partial, full, or overdue" },
                  { icon: <TrendingUp className="w-4 h-4 text-indigo-400" />, text: "Timeline view of all transactions so you never lose the thread" },
                  { icon: <Layers className="w-4 h-4 text-amber-400" />, text: "See outstanding balances across all clients at a glance" },
                ].map(f => (
                  <div key={f.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">{f.icon}</div>
                    <p className="text-slate-300 text-sm leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* mini feature card */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
              <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">TechCorp — API Integration</span>
                <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-full font-medium">Partial</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Invoice Total", value: "₦280,000", color: "text-white" },
                    { label: "Paid", value: "₦120,000", color: "text-emerald-400" },
                    { label: "Outstanding", value: "₦160,000", color: "text-rose-400" },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-700/50 rounded-xl p-3 text-center">
                      <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Collection progress</span><span>43%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "43%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Payment history</p>
                  {[
                    { date: "Mar 12, 2026", amount: "₦80,000", note: "Initial deposit" },
                    { date: "Mar 28, 2026", amount: "₦40,000", note: "Milestone 1" },
                  ].map(p => (
                    <div key={p.date} className="flex items-center justify-between bg-slate-700/40 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-xs text-white font-medium">{p.note}</p>
                        <p className="text-xs text-slate-400">{p.date}</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">{p.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Simple pricing. No surprises.</h2>
          <p className="text-slate-500 max-w-md mx-auto">Start free. Upgrade when you're ready. Your data is always safe.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free Trial */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 hover:border-slate-300 hover:shadow-lg transition-all">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100 mb-5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Free Trial
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">₦0</p>
            <p className="text-slate-500 text-sm mb-6">Full access for 30 days</p>
            <ul className="space-y-3 mb-8">
              {["30 days full access", "Unlimited invoices", "Project tracking", "Payment tracking", "Client portal links"].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-md"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pro */}
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-2xl shadow-blue-600/30">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center px-4 py-1 bg-white text-blue-600 text-xs font-bold rounded-full shadow-md border border-blue-100">
                RECOMMENDED
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-5">
              Pro Plan
            </div>
            <p className="text-3xl font-bold text-white mb-1">Contact us</p>
            <p className="text-blue-200 text-sm mb-6">After your 30-day trial</p>
            <ul className="space-y-3 mb-8">
              {["Unlimited invoices", "Full project tracking", "Payment & balance tracking", "Reports & insights", "Priority support", "Client portal"].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white">
                  <CheckCircle className="w-4 h-4 text-blue-200 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition shadow-md"
            >
              Subscribe Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* trial notice */}
        <div className="mt-10 max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">What happens after your trial?</p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Your 30-day free trial gives you full access to every feature. After the trial ends, your account will be temporarily locked until you subscribe — ensuring your data stays safe and intact. Nothing is deleted. You pick up exactly where you left off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="bg-slate-50 border-y border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Trusted by businesses that take their finances seriously</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {trustItems.map(t => (
              <div key={t.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                  {t.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{t.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl px-8 py-16 shadow-2xl shadow-blue-600/30 relative overflow-hidden">
          {/* decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Stop guessing your finances.<br />Start tracking them.
            </h2>
            <p className="text-blue-200 text-lg mb-10 max-w-lg mx-auto">
              Join businesses already using LumiCash to stay on top of every invoice, every project, and every naira.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-base"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-base backdrop-blur-sm"
              >
                Get Started Now
              </Link>
            </div>
            <p className="mt-5 text-blue-300 text-sm">30-day free trial · No credit card required · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">LumiCash</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} LumiCash by Lumitech Systems. All rights reserved.</p>
          <Link to="/login" className="text-xs text-slate-500 hover:text-blue-600 transition">Sign In →</Link>
        </div>
      </footer>

    </div>
  );
}
