import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full border border-rose-100 mb-6">
          Sound familiar?
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 leading-tight">
          Your business is making money…<br className="hidden sm:block" /> but are you actually up?
        </h2>
        <div className="space-y-5 text-left max-w-2xl mx-auto">
          <p className="text-slate-600 text-base leading-relaxed">
            Most African business owners fund their own business — rent, equipment, stock, salaries — straight from their pocket. You do this month after month because you believe in what you're building.
          </p>
          <p className="text-slate-600 text-base leading-relaxed">
            Then money starts coming in. Clients pay. Sales happen. But without tracking it properly, you never really know the answer to the most important question:{" "}
            <strong className="text-slate-900">have I gotten back what I put in?</strong>
          </p>
          <p className="text-slate-600 text-base leading-relaxed">
            LumiLedger gives you one clear number — the money your business still owes you — so you always know exactly where you stand.
          </p>
        </div>
        <div className="mt-10">
          <Link to="/register" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-[1.02] transition-all">
            See what your business owes you <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
