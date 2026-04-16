// OnboardingBanner.jsx
import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import { CheckCircle, ChevronRight, X, AlertCircle } from "lucide-react";

const STEPS = [
  {
    key: "orgProfileComplete",
    label: "Complete your org profile",
    description: "Add your company name, email, and address.",
    to: "/settings/org",
    cta: "Go to Org Settings",
  },
  {
    key: "firstClientAdded",
    label: "Add your first client",
    description: "Create a client you can invoice.",
    to: "/clients/create",
    cta: "Add a Client",
  },
  {
    key: "firstInvoiceCreated",
    label: "Create your first invoice",
    description: "Send your first invoice and get paid.",
    to: "/create",
    cta: "Create Invoice",
  },
];

const FALLBACK = { onboardingCompleted: false, percentComplete: 0, steps: {} };

function OnboardingBanner() {
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [apiError, setApiError] = useState(false);

  const fetchStatus = useCallback(() => {
    api.get("/api/onboarding/status")
      .then(res => { setStatus(res.data); setApiError(false); })
      .catch(err => {
        const code = err.response?.status;
        if (code === 404 || code === 501) { setDismissed(true); return; }
        setStatus(FALLBACK);
        setApiError(true);
      });
  }, []);

  useEffect(() => {
    if (dismissed) return;
    fetchStatus();
  }, [location.pathname, dismissed, fetchStatus]);

  const handleDismiss = async () => {
    setDismissing(true);
    try { await api.post("/api/onboarding/dismiss"); } catch {}
    finally { setDismissed(true); setDismissing(false); }
  };

  if (dismissed || !status || status.onboardingCompleted) return null;

  const steps = status.steps ?? {};
  const doneCount = STEPS.filter(s => !!steps[s.key]).length;
  const activeStep = STEPS.find(s => !steps[s.key]);
  if (!activeStep) return null;

  const activeIndex = STEPS.indexOf(activeStep);

  return (
    <div className="mx-4 md:mx-6 mt-4 bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900 rounded-2xl shadow-sm overflow-hidden">

      {/* Progress bar */}
      <div className="h-1 bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${Math.round((doneCount / STEPS.length) * 100)}%` }}
        />
      </div>

      <div className="px-4 py-3 flex items-center gap-3">

        {/* Step dots */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {STEPS.map((s, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${
              !!steps[s.key] ? "bg-emerald-500" :
              i === activeIndex ? "bg-blue-500 w-3" : "bg-slate-200"
            }`} />
          ))}
        </div>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 font-medium">
            Step {activeIndex + 1} of {STEPS.length}
          </p>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
            {activeStep.label}
          </p>
        </div>

        {/* CTA */}
        <Link
          to={activeStep.to}
          className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all"
        >
          {activeStep.cta}
          <ChevronRight size={12} />
        </Link>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          disabled={dismissing}
          className="shrink-0 p-1.5 text-slate-300 hover:text-slate-500 rounded-lg hover:bg-slate-100 transition"
          title="Skip for now"
        >
          <X size={14} />
        </button>
      </div>

      {apiError && (
        <div className="px-4 pb-2 flex items-center gap-1 text-xs text-amber-600">
          <AlertCircle size={11} /> Status sync unavailable — complete steps manually
        </div>
      )}
    </div>
  );
}

export default OnboardingBanner;
