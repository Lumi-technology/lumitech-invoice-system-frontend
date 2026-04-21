// OrgSettings.jsx
import { useEffect, useState, useRef } from "react";
import api, { getUserFromToken } from "../services/api";
import {
  Building2, Mail, Phone, MapPin, Globe, Save, FileText, Sun, Moon, Monitor,
  Upload, Trash2, CreditCard, Landmark, Eye, EyeOff, SlidersHorizontal,
} from "lucide-react";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";

const FIELDS = [
  { key: "name",    label: "Organisation Name", type: "text",  icon: Building2, placeholder: "e.g. Phoenix Plus Ltd" },
  { key: "email",   label: "Email",              type: "email", icon: Mail,      placeholder: "hello@company.com" },
  { key: "phone",   label: "Phone",              type: "text",  icon: Phone,     placeholder: "+234 800 000 0000" },
  { key: "address", label: "Address",            type: "text",  icon: MapPin,    placeholder: "123 Victoria Island, Lagos" },
  { key: "website", label: "Website",            type: "url",   icon: Globe,     placeholder: "https://yourcompany.com" },
  { key: "taxId",   label: "Tax / RC Number",    type: "text",  icon: FileText,  placeholder: "RC-0000000" },
];

const THEMES = [
  { value: "light", label: "Light",  icon: Sun,     desc: "Always use light mode" },
  { value: "dark",  label: "Dark",   icon: Moon,    desc: "Always use dark mode" },
  { value: "auto",  label: "System", icon: Monitor, desc: "Follow your device setting" },
];

const EMPTY_FORM = {
  name: "", email: "", phone: "", address: "", website: "", taxId: "",
  bankName: "", bankAccountNumber: "", bankAccountName: "",
  paystackPublicKey: "", paystackSecretKey: "",
  acceptPaystack: false, acceptBankTransfer: true, acceptCash: false,
};

function OrgSettings() {
  const user = getUserFromToken();
  const role = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : null);
  const isStaff = role === "STAFF" || role === "STAFF_EXPENSE";

  const [form, setForm] = useState(EMPTY_FORM);
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get("/api/org")
      .then(res => {
        setForm({ ...EMPTY_FORM, ...res.data });
        setLogoUrl(res.data.logoUrl || null);
      })
      .catch(() => setToast({ visible: true, message: "Failed to load organisation settings", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploadingLogo(true);
      const res = await api.post("/api/org/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLogoUrl(res.data.logoUrl);
      setToast({ visible: true, message: "Logo uploaded successfully", type: "success" });
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.message || "Failed to upload logo", type: "error" });
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleLogoDelete = async () => {
    try {
      setUploadingLogo(true);
      await api.delete("/api/org/logo");
      setLogoUrl(null);
      setToast({ visible: true, message: "Logo removed", type: "success" });
    } catch {
      setToast({ visible: true, message: "Failed to remove logo", type: "error" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/api/org", form);
      setToast({ visible: true, message: "Organisation settings saved", type: "success" });
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.message || "Failed to save settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  if (loading && !isStaff) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 dark:border-slate-600 border-t-blue-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  /* ── Staff sees only the theme / appearance card ── */
  if (isStaff) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-blue-600" />
            Preferences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalise how LumiLedger looks for you.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Sun className="w-4 h-4 text-blue-500" />
              Colour Theme
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Choose how LumiLedger looks on your device.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {THEMES.map(({ value, label, icon: Icon, desc }) => {
                const selected = theme === value;
                return (
                  <button
                    key={value} type="button" onClick={() => setTheme(value)}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      selected
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-700/30"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${selected ? "bg-blue-600" : "bg-slate-100 dark:bg-slate-700"}`}>
                      <Icon className={`w-5 h-5 ${selected ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${selected ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-200"}`}>{label}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    {selected && <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your organisation details and app preferences.
        </p>
      </div>

      {/* Logo Card */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-500" />
            Organisation Logo
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Appears on invoices and PDFs. If not set, your organisation initials are used.
          </p>
        </div>
        <div className="p-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-700/40 overflow-hidden shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Org logo" className="w-full h-full object-contain p-1" />
            ) : (
              <span className="text-2xl font-bold text-slate-400 dark:text-slate-500 select-none">
                {form.name ? form.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "LL"}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleLogoUpload} />
            <button
              type="button" disabled={uploadingLogo} onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition disabled:opacity-50"
            >
              <Upload size={14} /> {uploadingLogo ? "Uploading..." : "Upload Logo"}
            </button>
            {logoUrl && (
              <button
                type="button" disabled={uploadingLogo} onClick={handleLogoDelete}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition disabled:opacity-50"
              >
                <Trash2 size={14} /> Remove Logo
              </button>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG or WebP · Max 5 MB</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Org Details Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              Organisation Details
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Appears on your invoices and client communications.</p>
          </div>
          <div className="p-6 space-y-5">
            {FIELDS.map(({ key, label, type, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type={type} value={form[key] || ""}
                    onChange={e => set(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Settings Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              Payment Settings
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Configure how clients can pay their invoices.</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Payment method toggles */}
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Accepted Payment Methods</p>
              <div className="space-y-3">
                {[
                  { key: "acceptBankTransfer", label: "Bank Transfer", desc: "Display your bank account details on invoices" },
                  { key: "acceptPaystack",     label: "Paystack (Online)",  desc: "Generate a payment link for online card/bank payments" },
                  { key: "acceptCash",         label: "Cash",         desc: "Allow clients to record cash payments" },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={!!form[key]}
                        onChange={e => set(key, e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${form[key] ? "bg-blue-600 border-blue-600" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"}`}>
                        {form[key] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Bank Account Details</p>
              </div>
              {[
                { key: "bankName",          label: "Bank Name",           placeholder: "e.g. Zenith Bank" },
                { key: "bankAccountNumber", label: "Account Number",      placeholder: "0123456789" },
                { key: "bankAccountName",   label: "Account Name",        placeholder: "Phoenix Plus Ltd" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">{label}</label>
                  <input
                    type="text" value={form[key] || ""}
                    onChange={e => set(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              ))}
            </div>

            {/* Paystack Keys */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Paystack API Keys</p>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2">
                Your Paystack keys are used only for invoice payments from your clients. Get them from your Paystack dashboard.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Public Key</label>
                <input
                  type="text" value={form.paystackPublicKey || ""}
                  onChange={e => set("paystackPublicKey", e.target.value)}
                  placeholder="pk_live_..."
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Secret Key</label>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"} value={form.paystackSecretKey || ""}
                    onChange={e => set("paystackSecretKey", e.target.value)}
                    placeholder="sk_live_..."
                    className="w-full px-4 pr-10 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                  <button type="button" onClick={() => setShowSecret(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                    {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Keep your secret key private. It is never shown to clients.</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
            <button
              type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      {/* Appearance Card */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Sun className="w-4 h-4 text-blue-500" />
            Appearance
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Choose how LumiLedger looks for you.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEMES.map(({ value, label, icon: Icon, desc }) => {
              const selected = theme === value;
              return (
                <button
                  key={value} type="button" onClick={() => setTheme(value)}
                  className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selected
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-700/30"
                  }`}
                >
                  <div className={`p-3 rounded-xl ${selected ? "bg-blue-600" : "bg-slate-100 dark:bg-slate-700"}`}>
                    <Icon className={`w-5 h-5 ${selected ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${selected ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-200"}`}>{label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>
                  </div>
                  {selected && <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}

export default OrgSettings;
