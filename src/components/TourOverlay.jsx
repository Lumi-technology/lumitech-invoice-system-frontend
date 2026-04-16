import { useEffect, useState, useRef } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

const STEPS = [
  {
    title: "Welcome to LumiLedger 👋",
    body: "This is your dashboard — a real-time snapshot of your business finances. Revenue, outstanding invoices, and recent activity all in one place.",
    target: null, // centred modal, no spotlight
  },
  {
    title: "Create invoices in seconds",
    body: "Hit New Invoice to bill a client. You can send it by email, share a payment link, or let them pay directly via Paystack.",
    target: "[data-tour='new-invoice']",
  },
  {
    title: "Your customers live here",
    body: "Add clients once, then select them when creating invoices. Their full payment history is tracked automatically.",
    target: "[data-tour='nav-clients']",
  },
  {
    title: "Get paid faster",
    body: "Every invoice has a unique client portal link. Clients can view and pay online without logging in.",
    target: "[data-tour='nav-invoices']",
  },
  {
    title: "Reports & accounting",
    body: "Profit & Loss, Balance Sheet, Trial Balance — all update in real time as you record invoices and payments. No manual entry needed.",
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
  const PAD = 8;
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

  // Position tooltip near the spotlight or centred
  let style = {};
  if (rect) {
    const GAP = 16;
    const TH  = 200; // approx tooltip height
    const TW  = 320;
    // prefer below, fallback above
    const spaceBelow = window.innerHeight - rect.top - rect.height;
    if (spaceBelow > TH + GAP) {
      style = { top: rect.top + rect.height + GAP, left: Math.min(rect.left, window.innerWidth - TW - 16) };
    } else {
      style = { top: Math.max(8, rect.top - TH - GAP), left: Math.min(rect.left, window.innerWidth - TW - 16) };
    }
    style.width = TW;
  } else {
    // centred
    style = {
      top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      width: 360,
    };
  }

  return (
    <div
      className="fixed z-[9999] bg-white rounded-2xl shadow-2xl p-6 border border-slate-100"
      style={style}
    >
      {/* progress dots */}
      <div className="flex items-center gap-1.5 mb-4">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-5 bg-blue-600" : "w-1.5 bg-slate-200"}`} />
        ))}
        <button onClick={onSkip} className="ml-auto text-slate-300 hover:text-slate-500 transition">
          <X size={16} />
        </button>
      </div>

      <h3 className="font-bold text-slate-900 text-base mb-1.5">{STEPS[step].title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-5">{STEPS[step].body}</p>

      <div className="flex items-center gap-2">
        {!isFirst && (
          <button
            onClick={onPrev}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
        <button
          onClick={isLast ? onSkip : onNext}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow shadow-blue-600/25 hover:scale-[1.02] transition-all"
        >
          {isLast ? "Get started" : "Next"}
          {!isLast && <ArrowRight size={14} />}
        </button>
      </div>

      {!isLast && (
        <button onClick={onSkip} className="block w-full text-center text-xs text-slate-300 hover:text-slate-500 mt-3 transition">
          Skip tour
        </button>
      )}
    </div>
  );
}

export default function TourOverlay() {
  const [step, setStep]     = useState(0);
  const [rect, setRect]     = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("tourDone");
    if (!done) {
      // Small delay so DOM is painted
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const target = STEPS[step].target;
    setRect(getRect(target));
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
