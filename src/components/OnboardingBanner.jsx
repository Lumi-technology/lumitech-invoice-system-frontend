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

// Fallback — show banner with all steps unchecked if API fails
const FALLBACK = { onboardingCompleted: false, percentComplete: 0, steps: {} };

function OnboardingBanner() {
  const location = useLocation();
  const [status, setStatus] = useState(null);   // null = loading
  const [apiError, setApiError] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const fetchStatus = useCallback(() => {
    api.get("/api/onboarding/status")
      .then(res => {
        setStatus(res.data);
        setApiError(false);
      })
      .catch(err => {
        const status = err.response?.status;
        // 404 or 501 → endpoint not built yet, hide banner entirely
        if (status === 404 || status === 501) {
          setDismissed(true);
          return;
        }
        // Any other error (400, 500 etc.) → show fallback so user can still navigate
        setStatus(FALLBACK);
        setApiError(true);
      });
  }, []);

  // Re-fetch on every route change so steps update after user completes them
  useEffect(() => {
    if (dismissed) return;
    fetchStatus();
  }, [location.pathname, dismissed, fetchStatus]);

  const handleDismiss = async () => {
    setDismissing(true);
    try {
      await api.post("/api/onboarding/dismiss");
    } catch {
      // dismiss locally even if API fails
    } finally {
      setDismissed(true);
      setDismissing(false);
    }
  };

  if (dismissed) return null;
  if (!status) return null;                      // still loading
  if (status.onboardingCompleted) return null;   // all done

  const percent = Math.round(status.percentComplete ?? 0);
  const steps = status.steps ?? {};
  const activeStep = STEPS.find(s => !steps[s.key]);

  // All steps done client-side but API hasn't confirmed yet
  if (!activeStep) return null;

  return (
    <div className="mx-4 md:mx-6 mt-4 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Header + progress bar */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-sm font-semibold text-slate-800">Get started with LumiCash</p>
            <span className="text-xs text-slate-400 font-medium">{percent}% complete</span>
          </div>
          <button
            onClick={handleDismiss}
            disabled={dismissing}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            title="Skip for now"
          >
            <X size={15} />
          </button>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="px-5 py-4 flex flex-col sm:flex-row gap-3">
        {STEPS.map((step, i) => {
          const done = !!steps[step.key];
          const isActive = activeStep?.key === step.key;
          return (
            <div
              key={step.key}
              className={`flex-1 flex items-start gap-3 p-3 rounded-xl border transition-all ${
                isActive
                  ? "bg-blue-50 border-blue-200"
                  : done
                  ? "bg-emerald-50/60 border-emerald-100"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {done ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    isActive ? "border-blue-500 text-blue-600" : "border-slate-300 text-slate-400"
                  }`}>
                    {i + 1}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${
                  done ? "text-emerald-700 line-through opacity-60"
                  : isActive ? "text-blue-800"
                  : "text-slate-500"
                }`}>
                  {step.label}
                </p>
                {!done && (
                  <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                )}
                {isActive && (
                  <Link
                    to={step.to}
                    className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    {step.cta}
                    <ChevronRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleDismiss}
            disabled={dismissing}
            className="text-xs text-slate-400 hover:text-slate-600 transition underline underline-offset-2"
          >
            {dismissing ? "Dismissing..." : "Skip for now"}
          </button>
          {apiError && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
              <AlertCircle size={12} />
              Status sync unavailable
            </span>
          )}
        </div>
        {activeStep && (
          <Link
            to={activeStep.to}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-600/20 hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            {activeStep.cta}
            <ChevronRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default OnboardingBanner;
