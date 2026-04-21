import { useEffect, useState } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

const STEPS = [
  {
    title: "Welcome to LumiLedger 👋",
    body: "Your dashboard gives you a real-time snapshot — revenue, unpaid invoices, and recent activity all in one place.",
    target: null,
  },
  {
    title: "Create invoices in seconds",
    body: "Hit New Invoice to bill a client. Send by email, share a payment link, or let them pay via Paystack.",
    target: "[data-tour='new-invoice']",
  },
  {
    title: "Your customers live here",
    body: "Add clients once, then pick them when creating invoices. Their full payment history is tracked automatically.",
    target: "[data-tour='nav-clients']",
  },
  {
    title: "Get paid faster",
    body: "Every invoice gets a unique client portal link. Clients can view and pay online without logging in.",
    target: "[data-tour='nav-invoices']",
  },
  {
    title: "Reports & accounting",
    body: "Profit & Loss, Balance Sheet, Trial Balance — all update in real time as you record invoices and payments.",
    target: "[data-tour='nav-reports']",
  },
  {
    title: "You're ready to go 🚀",
    body: "Start by adding your first client, then create an invoice. The whole flow takes under 2 minutes.",
    target: null,
  },
];

function getRect(selector) {
  if (!selector) return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

function Spotlight({ rect }) {
  if (!rect) return null;
  const PAD = 6;
  return (
    <div
      className="fixed z-[9998] rounded-xl pointer-events-none transition-all duration-300"
      style={{
        top:    rect.top    - PAD,
        left:   rect.left   - PAD,
        width:  rect.width  + PAD * 2,
        height: rect.height + PAD * 2,
        boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
      }}
    />
  );
}

function Tooltip({ step, rect, total, onNext, onPrev, onSkip }) {
  const isFirst = step === 0;
  const isLast  = step === total - 1;

  const vw = typeof window !== "undefined" ? window.innerWidth  : 400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const TW = Math.min(300, vw - 32);   // max 300px, min 16px margin each side
  const TH = 180;                       // approx tooltip height
  const GAP = 12;

  let style = {};
  if (rect) {
    const spaceBelow = vh - rect.top - rect.height;
    const top = spaceBelow > TH + GAP
      ? rect.top + rect.height + GAP
      : Math.max(8, rect.top - TH - GAP);
    const left = Math.max(16, Math.min(rect.left, vw - TW - 16));
    style = { top, left, width: TW };
  } else {
    // centred — always safe on any screen size
    style = {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: TW,
    };
  }

  return (
    <div
      className="fixed z-[9999] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4"
      style={style}
    >
      {/* progress dots + close */}
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === step ? "w-4 bg-blue-600" : "w-1.5 bg-slate-200 dark:bg-slate-600"
            }`}
          />
        ))}
        <button
          onClick={onSkip}
          className="ml-auto p-0.5 text-slate-300 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-300 transition rounded"
        >
          <X size={14} />
        </button>
      </div>

      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{STEPS[step].title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{STEPS[step].body}</p>

      <div className="flex items-center gap-2">
        {!isFirst && (
          <button
            onClick={onPrev}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition"
          >
            <ArrowLeft size={12} /> Back
          </button>
        )}
        <button
          onClick={isLast ? onSkip : onNext}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow shadow-blue-600/25 hover:scale-[1.02] transition-all"
        >
          {isLast ? "Get started" : "Next"}
          {!isLast && <ArrowRight size={12} />}
        </button>
      </div>

      {!isLast && (
        <button
          onClick={onSkip}
          className="block w-full text-center text-xs text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-400 mt-2.5 transition"
        >
          Skip tour
        </button>
      )}
    </div>
  );
}

export default function TourOverlay() {
  const [step, setStep]       = useState(0);
  const [rect, setRect]       = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("tourDone")) {
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    setRect(getRect(STEPS[step].target));
  }, [step, visible]);

  const dismiss = () => {
    localStorage.setItem("tourDone", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <Spotlight rect={rect} />
      <Tooltip
        step={step}
        rect={rect}
        total={STEPS.length}
        onNext={() => setStep(s => s + 1)}
        onPrev={() => setStep(s => s - 1)}
        onSkip={dismiss}
      />
    </>
  );
}
