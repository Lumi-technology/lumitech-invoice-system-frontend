import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl px-5 sm:px-8 py-14 sm:py-20 shadow-2xl shadow-blue-600/30 overflow-hidden text-center">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-1 mb-6">
            {Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-5 h-5 text-amber-300 fill-amber-300" />)}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Know exactly what your<br />business owes you — today
          </h2>
          <p className="text-blue-100 text-lg mb-4 leading-relaxed">
            Join 100+ businesses already using LumiLedger to understand their money.
          </p>
          <p className="text-blue-200 text-base mb-10 leading-relaxed font-medium">
            See what your business owes you in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-extrabold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-base">
              Start Free Trial <ArrowRight className="w-5 h-5" />
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
  );
}
