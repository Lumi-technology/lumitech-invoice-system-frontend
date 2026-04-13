// OrgSettings.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { Building2, Mail, Phone, MapPin, Globe, Save, FileText, Sun, Moon, Monitor } from "lucide-react";
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
  { value: "light", label: "Light",    icon: Sun,     desc: "Always use light mode" },
  { value: "dark",  label: "Dark",     icon: Moon,    desc: "Always use dark mode" },
  { value: "auto",  label: "System",   icon: Monitor, desc: "Follow your device setting" },
];

function OrgSettings() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", website: "", taxId: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    api.get("/api/org")
      .then(res => setForm({ ...form, ...res.data }))
      .catch(() => setToast({ visible: true, message: "Failed to load organisation settings", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 dark:border-slate-600 border-t-blue-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading settings...</p>
        </div>
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

      {/* Org Details Card */}
      <form onSubmit={handleSubmit}>
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
                    type={type}
                    value={form[key] || ""}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
            <button
              type="submit"
              disabled={saving}
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
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Choose how LumiCash looks for you.</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEMES.map(({ value, label, icon: Icon, desc }) => {
              const selected = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
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
                    <p className={`text-sm font-semibold ${selected ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-200"}`}>
                      {label}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>
                  </div>
                  {selected && (
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600" />
                  )}
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
