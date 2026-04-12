// OrgSettings.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  FileText,
} from "lucide-react";
import Toast from "../components/Toast";

const FIELDS = [
  { key: "name",    label: "Organisation Name", type: "text",  icon: Building2, placeholder: "Lumitech Systems" },
  { key: "email",   label: "Email",              type: "email", icon: Mail,      placeholder: "hello@company.com" },
  { key: "phone",   label: "Phone",              type: "text",  icon: Phone,     placeholder: "+234 800 000 0000" },
  { key: "address", label: "Address",            type: "text",  icon: MapPin,    placeholder: "123 Victoria Island, Lagos" },
  { key: "website", label: "Website",            type: "url",   icon: Globe,     placeholder: "https://yourcompany.com" },
  { key: "taxId",   label: "Tax / RC Number",    type: "text",  icon: FileText,  placeholder: "RC-0000000" },
];

function OrgSettings() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", website: "", taxId: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

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
      const msg = err.response?.data?.message || "Failed to save settings.";
      setToast({ visible: true, message: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4" />
          <p className="text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          Organisation Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          This information appears on your invoices and client communications.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Organisation Details
            </h2>
          </div>

          <div className="p-6 space-y-5">
            {FIELDS.map(({ key, label, type, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={type}
                    value={form[key] || ""}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
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

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}

export default OrgSettings;
