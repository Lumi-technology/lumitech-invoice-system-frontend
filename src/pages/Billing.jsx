// Billing.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { CreditCard, CheckCircle, Zap } from "lucide-react";
import Toast from "../components/Toast";

const PLANS = [
  {
    key: "FREE",
    name: "Free",
    price: "₦0",
    period: "forever",
    color: "border-slate-200",
    badge: "bg-slate-100 text-slate-600",
    features: ["5 clients", "10 invoices/month", "Basic PDF export", "Client portal"],
  },
  {
    key: "STARTER",
    name: "Starter",
    price: "₦9,900",
    period: "/month",
    color: "border-blue-400",
    badge: "bg-blue-100 text-blue-700",
    highlight: true,
    features: ["50 clients", "Unlimited invoices", "Project tracking", "Email reminders", "Paystack payments"],
  },
  {
    key: "GROWTH",
    name: "Growth",
    price: "₦24,900",
    period: "/month",
    color: "border-indigo-400",
    badge: "bg-indigo-100 text-indigo-700",
    features: ["Unlimited clients", "Unlimited invoices", "All Starter features", "Priority support", "Multi-user access"],
  },
];

function Billing() {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(null); // plan key being upgraded to
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          Billing & Subscription
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your plan and subscription.</p>
      </div>

      {/* Current Plan Card */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600" />
        </div>
      ) : (
        <>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Current Plan</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-900">{currentPlan}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    currentStatus === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}>
                    {currentStatus}
                  </span>
                </div>
                {billing?.expiresAt && (
                  <p className="text-xs text-slate-400 mt-1">
                    Renews {new Date(billing.expiresAt).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
              {currentPlan === "FREE" && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-medium">
                  <Zap size={16} />
                  Upgrade to unlock more features
                </div>
              )}
            </div>
          </div>

          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map(plan => {
              const isCurrent = plan.key === currentPlan;
              const isUpgrading = upgrading === plan.key;
              return (
                <div
                  key={plan.key}
                  className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 overflow-hidden transition-all ${
                    plan.highlight ? "border-blue-400 shadow-blue-100" : plan.color
                  } ${isCurrent ? "ring-2 ring-offset-1 ring-blue-500" : ""}`}
                >
                  {plan.highlight && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold text-center py-1.5 tracking-wider uppercase">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${plan.badge}`}>{plan.key}</span>
                    </div>
                    <div className="mb-5">
                      <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-slate-500 text-sm">{plan.period}</span>
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <div className="w-full text-center py-2.5 text-sm font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-xl">
                        Current Plan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan.key)}
                        disabled={!!upgrading}
                        className={`w-full py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50 ${
                          plan.highlight
                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02]"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {isUpgrading ? "Processing..." : `Upgrade to ${plan.name}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}

export default Billing;
