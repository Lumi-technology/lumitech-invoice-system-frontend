import { CheckCircle, Briefcase, Calculator } from "lucide-react";

export default function WhoIsItForSection() {
  return (
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
  );
}
