// Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { UserPlus, Building2, Mail, User, Lock, Eye, EyeOff, CheckCircle, Briefcase, Calculator } from "lucide-react";
import { setUserType, setRegisteredAs } from "../utils/userType";

function Register() {
  const [form, setForm] = useState({ orgName: "", email: "", username: "", password: "" });
  const [selectedUserType, setSelectedUserType] = useState("business_owner");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/api/auth/register", { ...form, userType: selectedUserType.toUpperCase() });
      setUserType(selectedUserType);
      setRegisteredAs(selectedUserType);
      setRegistered(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { key: "orgName",  label: "Organisation Name", type: "text",  icon: Building2, placeholder: "Phoenix Plus Ltd" },
    { key: "email",    label: "Email",              type: "email", icon: Mail,      placeholder: "admin@company.com" },
    { key: "username", label: "Username",           type: "text",  icon: User,      placeholder: "yourname" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-600/20 mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Lumi<span className="text-blue-600">Ledger</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create your account — free for 30 days</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">

          {/* Success state */}
          {registered ? (
            <div className="text-center py-4">
              <div className="inline-flex p-4 bg-emerald-50 rounded-full mb-5">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Account created!</h2>
              <p className="text-sm text-slate-500 mb-6">
                Check your email to verify your account before logging in.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {fields.map(({ key, label, type, icon: Icon, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                      <Icon className="w-4 h-4 text-slate-400" />
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>
                ))}

                {/* Password */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 pr-11 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className={`w-full px-4 py-2.5 pr-11 border rounded-xl bg-white/50 focus:outline-none focus:ring-2 transition ${
                        confirmPassword && form.password !== confirmPassword
                          ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                          : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && form.password !== confirmPassword && (
                    <p className="text-xs text-rose-500">Passwords do not match</p>
                  )}
                </div>

                {/* User type selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">I am a…</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "business_owner", label: "Business Owner", sub: "I run my own business", Icon: Briefcase },
                      { value: "accountant",     label: "Accountant",     sub: "I manage client books",  Icon: Calculator },
                    ].map(({ value, label, sub, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedUserType(value)}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition text-center ${
                          selectedUserType === value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <Icon size={20} className={selectedUserType === value ? "text-blue-600" : "text-slate-400"} />
                        <span className={`text-sm font-semibold ${selectedUserType === value ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-200"}`}>{label}</span>
                        <span className="text-xs text-slate-400">{sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              <p className="text-sm text-center text-slate-500 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 transition">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
