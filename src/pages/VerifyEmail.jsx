// VerifyEmail.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8081" : "https://ledgerapi.lumitechsystems.com");

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [resending, setResending] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    axios.get(`${BASE_URL}/api/auth/verify-email`, { params: { token } })
      .then(() => setStatus("success"))
      .catch((err) => {
        // Don't show generic "expired" for network errors
        setStatus("error");
      });
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) { setResendError("Please enter your email address."); return; }
    setResendError("");
    setResending(true);
    try {
      await axios.post(`${BASE_URL}/api/auth/resend-verification`, { email: resendEmail.trim() });
      setResendDone(true);
    } catch {
      setResendDone(true); // avoid email enumeration
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Branding */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          Lumi<span className="text-blue-600">Ledger</span>
        </h1>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          {status === "loading" && (
            <>
              <div className="inline-flex p-4 bg-blue-50 rounded-full mb-5">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Verifying your email...</h2>
              <p className="text-sm text-slate-500">Please wait a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="inline-flex p-4 bg-emerald-50 rounded-full mb-5">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Email verified!</h2>
              <p className="text-sm text-slate-500 mb-6">Your account is active. You can now log in.</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Go to Login
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="inline-flex p-4 bg-rose-50 rounded-full mb-5">
                <XCircle className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Verification link not valid</h2>
              <p className="text-sm text-slate-500 mb-6">
                This link may have already been used or is no longer valid.<br />
                Enter your email below to get a fresh link.
              </p>

              {resendDone ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                  If that email is registered, a new verification link is on its way.
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3 text-left">
                  <div>
                    <input
                      type="email"
                      placeholder="Your registered email"
                      value={resendEmail}
                      onChange={e => setResendEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                    {resendError && <p className="text-xs text-rose-500 mt-1">{resendError}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={resending}
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    <Mail size={18} />
                    {resending ? "Sending..." : "Send New Verification Link"}
                  </button>
                </form>
              )}

              <Link to="/login" className="block mt-4 text-sm text-blue-600 hover:text-blue-700 transition">
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
