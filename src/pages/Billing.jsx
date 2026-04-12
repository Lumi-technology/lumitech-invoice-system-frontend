// Billing.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { CreditCard, CheckCircle, Clock, ArrowRight, Zap } from "lucide-react";
import Toast from "../components/Toast";

function Billing() {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  useEffect(() => {
    api.get("/api/billing/status")
      .then(res => setBilling(res.data))
      .catch(() => setToast({ visible: true, message: "Failed to load billing info", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planKey) => {
    try {
      setUpgrading(planKey);
      const res = await api.post("/api/billing/subscribe", { plan: planKey });
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setToast({ visible: true, message: "Subscription updated!", type: "success" });
        setBilling(prev => ({ ...prev, plan: planKey, status: "ACTIVE" }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to start subscription.";
      setToast({ visible: true, message: msg, type: "error" });
    } finally {
      setUpgrading(null);
    }
  };

  const currentPlan = billing?.plan ?? "FREE";
  const currentStatus = billing?.status ?? "ACTIVE";
  const isTrial = currentPlan === "FREE";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          Billing & Subscription
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your plan and subscription.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600" />
        </div>
      ) : (
        <>
          {/* Current plan status banner */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{currentPlan}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      currentStatus === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}>
                      {currentStatus}
                    </span>
                  </div>
                  {billing?.expiresAt && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Renews {new Date(billing.expiresAt).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
              {isTrial && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-medium">
                  <Zap size={15} />
                  Subscribe to keep access after your trial
                </div>
              )}
            </div>
          </div>

          {/* Plan cards — same design as landing page */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">

            {/* Trial / FREE */}
            <div className={`bg-white rounded-2xl border-2 border-dashed p-8 flex flex-col transition-all ${
              currentPlan === "FREE" ? "border-blue-400 ring-2 ring-blue-500/20" : "border-slate-200"
            }`}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mb-6 self-start border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Free Trial
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-1">₦0</p>
              <p className="text-slate-500 text-sm mb-2">for 30 days</p>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Full access to every feature. No restrictions. No card needed.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Starter — free",
                  "Unlimited invoices & clients",
                  "Project & cashflow tracking",
                  "Client payment portal",
                  "PDF export & email reminders",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                {currentPlan === "FREE" ? (
                  <div className="w-full text-center py-2.5 text-sm font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-xl">
                    Current Plan
                  </div>
                ) : (
                  <div className="w-full text-center py-2.5 text-sm font-medium text-slate-400 bg-slate-50 border border-slate-100 rounded-xl">
                    Trial period
                  </div>
                )}
                <p className="text-center text-xs text-slate-400 mt-3">
                  Trial ends → account locks until you subscribe
                </p>
              </div>
            </div>

            {/* STARTER — hero */}
            <div className={`relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 shadow-2xl shadow-blue-600/40 flex flex-col md:-mt-4 md:-mb-4 ${
              currentPlan === "STARTER" ? "ring-4 ring-white/50" : ""
            }`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-blue-600 text-xs font-bold rounded-full shadow-lg border border-blue-100">
                  ⭐ Most Popular
                </span>
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-white/15 text-white text-xs font-bold rounded-full mb-6 self-start tracking-widest uppercase">
                Starter
              </div>
              <div className="mb-2">
                <span className="text-5xl font-extrabold text-white">₦9,900</span>
                <span className="text-blue-200 text-base ml-1">/month</span>
              </div>
              <p className="text-blue-200 text-sm mb-6">
                Best for individuals and small teams managing client work
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Up to 50 clients",
                  "Unlimited invoices",
                  "Project tracking",
                  "Partial payment tracking",
                  "Email reminders",
                  "Paystack online payments",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-blue-200 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                {currentPlan === "STARTER" ? (
                  <div className="w-full text-center py-2.5 text-sm font-semibold text-blue-700 bg-white rounded-xl">
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade("STARTER")}
                    disabled={!!upgrading}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg text-sm disabled:opacity-50"
                  >
                    {upgrading === "STARTER" ? "Processing..." : <>Upgrade to Starter <ArrowRight className="w-4 h-4" /></>}
                  </button>
                )}
                <p className="text-center text-xs text-blue-300 mt-3">Cancel anytime.</p>
              </div>
            </div>

            {/* GROWTH — premium */}
            <div className={`bg-slate-900 rounded-2xl border-2 p-8 flex flex-col transition-all ${
              currentPlan === "GROWTH" ? "border-indigo-400 ring-2 ring-indigo-500/30" : "border-slate-700"
            }`}>
              <div className="inline-flex items-center px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full mb-6 self-start border border-indigo-500/30 tracking-widest uppercase">
                Growth
              </div>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-white">₦24,900</span>
                <span className="text-slate-400 text-base ml-1">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                For growing businesses that need more control and team collaboration
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Unlimited clients",
                  "Unlimited invoices",
                  "Everything in Starter",
                  "Multi-user access",
                  "Team roles (Admin, Staff)",
                  "Advanced reports (profit per project)",
                  "Activity logs",
                  "Priority support",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                {currentPlan === "GROWTH" ? (
                  <div className="w-full text-center py-2.5 text-sm font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade("GROWTH")}
                    disabled={!!upgrading}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm disabled:opacity-50"
                  >
                    {upgrading === "GROWTH" ? "Processing..." : <>Upgrade to Growth <ArrowRight className="w-4 h-4" /></>}
                  </button>
                )}
                <p className="text-center text-xs text-slate-500 mt-3">Cancel anytime.</p>
              </div>
            </div>
          </div>

          {/* Urgency + trust */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <span className="font-semibold text-amber-900">Your trial ends in 30 days</span> — continue only if it's valuable to you. Nothing is deleted. Subscribe and pick up exactly where you left off.
            </p>
          </div>

          <p className="text-center text-sm text-slate-400 font-medium tracking-wide pb-4">
            LumiCash — Your business money, simplified.
          </p>
        </>
      )}

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}

export default Billing;
