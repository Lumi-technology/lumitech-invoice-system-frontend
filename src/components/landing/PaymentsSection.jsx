import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, CreditCard, Landmark, Banknote, BadgeCheck } from "lucide-react";

export default function PaymentsSection() {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100 mb-5">
            Built for African businesses
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Send invoices. Get paid.{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Any way they want to pay.
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
            Create a professional invoice in seconds. Your clients can pay by Paystack, bank transfer, or cash — every payment is recorded automatically in your books.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: <CreditCard className="w-5 h-5 text-white" />,
              gradient: "from-blue-600 to-indigo-600",
              glow: "shadow-blue-600/25",
              title: "Paystack",
              badge: "Online",
              badgeCls: "bg-blue-100 text-blue-700 border-blue-200",
              border: "border-slate-200",
              desc: "One-click payment link. Clients pay by card, bank transfer, USSD, or QR code — Paystack handles it all.",
              features: ["Card payments", "USSD & bank transfer", "QR code payments", "Instant confirmation"],
            },
            {
              icon: <Landmark className="w-5 h-5 text-white" />,
              gradient: "from-emerald-500 to-teal-500",
              glow: "shadow-emerald-500/25",
              title: "Bank Transfer",
              badge: "Most used in NG",
              badgeCls: "bg-emerald-100 text-emerald-700 border-emerald-200",
              border: "border-emerald-200 ring-1 ring-emerald-100",
              desc: "Your account number on every invoice. Clients transfer and you confirm — no friction, no middleman.",
              features: ["Your account on every invoice", "Works with local banks across Africa", "Manual confirmation flow", "Auto-records in your books"],
            },
            {
              icon: <Banknote className="w-5 h-5 text-white" />,
              gradient: "from-amber-500 to-orange-500",
              glow: "shadow-amber-500/25",
              title: "Cash",
              badge: "Offline",
              badgeCls: "bg-amber-100 text-amber-700 border-amber-200",
              border: "border-slate-200",
              desc: "Record cash payments in seconds. Your books stay up to date — whether collected in person or at delivery.",
              features: ["Record in seconds", "Updates invoice status", "Reflects in P&L report", "Full audit trail"],
            },
          ].map(m => (
            <div key={m.title} className={`bg-white rounded-2xl p-6 border ${m.border} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group`}>
              <div className={`w-12 h-12 bg-gradient-to-br ${m.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg ${m.glow} group-hover:scale-110 transition-transform`}>
                {m.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-slate-900">{m.title}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${m.badgeCls}`}>{m.badge}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{m.desc}</p>
              <div className="space-y-2">
                {m.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 overflow-hidden shadow-xl">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 rounded-full text-xs font-semibold mb-3">
              <BadgeCheck className="w-3.5 h-3.5" /> Payment Setup Support Included
            </div>
            <h3 className="text-white font-bold text-xl mb-2">We help you set everything up</h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
              No need to figure out Paystack or payment settings on your own. We guide you through setup so your clients can pay directly from your invoices — from day one. Available during your free trial.
            </p>
          </div>
          <Link to="/register" className="relative flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all text-sm">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
