import { Globe, Receipt, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const COUNTRIES = [
  {
    flag: "🇳🇬", country: "Nigeria",      currency: "NGN — Naira",
    tax: "VAT 7.5% · FIRS", payroll: "PAYE · Pension · NHF",
    border: "border-emerald-500/40", highlight: false,
  },
  {
    flag: "🇬🇭", country: "Ghana",        currency: "GHS — Cedi",
    tax: "VAT 15% · GRA",  payroll: "PAYE · SSNIT",
    border: "border-emerald-500/40", highlight: false,
  },
  {
    flag: "🇿🇦", country: "South Africa", currency: "ZAR — Rand",
    tax: "VAT 15% · SARS", payroll: "PAYE · UIF · SDL",
    border: "border-emerald-500/40", highlight: false,
  },
  {
    flag: "🇰🇪", country: "Kenya",        currency: "KES — Shilling",
    tax: "VAT 16% · KRA",  payroll: "PAYE · NHIF · NSSF",
    border: "border-emerald-500/40", highlight: false,
  },
  {
    flag: "🇹🇿", country: "Tanzania",     currency: "TZS — Shilling",
    tax: "VAT 18% · TRA",  payroll: "PAYE · NSSF",
    border: "border-emerald-500/40", highlight: false,
  },
  {
    flag: "🇷🇼", country: "Rwanda",       currency: "RWF — Franc",
    tax: "VAT 18% · RRA",  payroll: "PAYE · RSSB",
    border: "border-emerald-500/40", highlight: false,
  },
  {
    flag: "🇺🇬", country: "Uganda",       currency: "UGX — Shilling",
    tax: "VAT 18% · URA",  payroll: "PAYE · NSSF",
    border: "border-emerald-500/40", highlight: false,
  },
  {
    flag: "🇿🇲", country: "Zambia",       currency: "ZMW — Kwacha",
    tax: "VAT 16% · ZRA",  payroll: "PAYE · NAPSA",
    border: "border-emerald-500/40", highlight: false,
  },
];

export default function CountriesSection() {
  return (
    <section id="countries" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-xs font-semibold rounded-full border border-white/20 mb-6">
            <Globe className="w-3.5 h-3.5" /> Pan-African · 8 Countries Live Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Built for Africa.{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              All of it.
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Register your business in any of these 8 countries and LumiLedger automatically
            adapts — correct currency, VAT rate, and tax authority. No configuration needed.
          </p>
        </div>

        {/* Flag strip */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-12 flex-wrap">
          {COUNTRIES.map(c => (
            <div key={c.country} className="flex flex-col items-center gap-1 group">
              <span className="text-4xl sm:text-5xl leading-none group-hover:scale-125 transition-transform cursor-default select-none">{c.flag}</span>
              <span className="text-[10px] text-slate-500 font-medium">{c.country.split(" ")[0]}</span>
            </div>
          ))}
        </div>

        {/* Country cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {COUNTRIES.map(c => (
            <div key={c.country}
              className={`bg-white/5 backdrop-blur-sm rounded-2xl p-5 border ${c.border} hover:bg-white/10 hover:scale-[1.02] transition-all group`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl leading-none">{c.flag}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-0.5">{c.country}</h3>
              <p className="text-slate-400 text-xs mb-3">{c.currency}</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Receipt className="w-3 h-3 text-slate-500 flex-shrink-0" /> {c.tax}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Users className="w-3 h-3 text-slate-500 flex-shrink-0" /> {c.payroll}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Globe className="w-3 h-3 text-slate-500 flex-shrink-0" /> Multi-currency
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What "adaptive" means */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-10">
          <h3 className="text-white font-bold text-lg mb-4 text-center">What "country-adaptive" actually means</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "💱", title: "Correct currency", desc: "Register as Ghana → every page shows ₵. South Africa → R. Nigeria → ₦. No settings needed." },
              { icon: "📊", title: "Right VAT rate", desc: "Ghana uses 15% GRA. Nigeria uses 7.5% FIRS. South Africa uses 15% SARS. Automatically applied to every invoice." },
              { icon: "🏛️", title: "Local compliance", desc: "Tax reports export to the right authority for your country — FIRS, GRA, SARS, KRA, and more." },
            ].map(f => (
              <div key={f.title} className="flex gap-3">
                <span className="text-2xl shrink-0">{f.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-6">More countries coming — Ethiopia, Côte d'Ivoire, Senegal, and beyond.</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-xl shadow-amber-500/30 hover:scale-[1.02] transition-all">
            Start Free in Your Country
          </Link>
        </div>
      </div>
    </section>
  );
}
