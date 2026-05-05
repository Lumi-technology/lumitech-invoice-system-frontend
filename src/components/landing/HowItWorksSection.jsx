import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const steps = [
  { n: "1", title: "Record your transactions",        desc: "Add income, expenses, and invoices. Your dashboard updates instantly.", color: "from-blue-600 to-blue-700",    glow: "shadow-blue-600/30" },
  { n: "2", title: "Track your capital investment",   desc: "Record money you put into the business and watch your recovery grow.", color: "from-indigo-600 to-indigo-700", glow: "shadow-indigo-600/30" },
  { n: "3", title: "Watch your business pay you back",desc: "As revenue comes in, see your outstanding capital decrease in real time.", color: "from-violet-600 to-violet-700", glow: "shadow-violet-600/30" },
];

export default function HowItWorksSection() {
  return (
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
  );
}
