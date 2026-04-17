import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Plus, Trash2, Receipt, Upload, X, ChevronDown, Calendar, Search
} from "lucide-react";
import Toast from "../components/Toast";

const CATEGORIES = [
  "OFFICE_SUPPLIES","UTILITIES","RENT","SALARIES","TRANSPORT",
  "MARKETING","SOFTWARE","EQUIPMENT","PROFESSIONAL_FEES",
  "BANK_CHARGES","TAXES","REPAIRS_MAINTENANCE","ENTERTAINMENT","INSURANCE","OTHER"
];

const CAT_LABEL = (c) => c.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

const fmt = (v) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(v || 0);

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]     = useState("");
  const [toast, setToast]       = useState({ visible: false, message: "", type: "info" });
  const [deleting, setDeleting] = useState(null);

  const [form, setForm] = useState({
    amount: "", category: "", vendorName: "", description: "",
    expenseDate: new Date().toISOString().slice(0, 10),
  });
  const [receipt, setReceipt] = useState(null);

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/expenses", { params: { page: 0, size: 100 } });
      setExpenses(res.data.content || []);
    } catch { setToast({ visible: true, message: "Failed to load expenses", type: "error" }); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("data", new Blob([JSON.stringify({
        amount: parseFloat(form.amount),
        category: form.category,
        vendorName: form.vendorName || null,
        description: form.description || null,
        expenseDate: form.expenseDate,
      })], { type: "application/json" }));
      if (receipt) fd.append("receipt", receipt);
      await api.post("/api/expenses", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setToast({ visible: true, message: "Expense recorded", type: "success" });
      setShowForm(false);
      setForm({ amount: "", category: "", vendorName: "", description: "", expenseDate: new Date().toISOString().slice(0, 10) });
      setReceipt(null);
      fetchExpenses();
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.message || "Failed to save expense", type: "error" });
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/api/expenses/${id}`);
      setExpenses(prev => prev.filter(e => e.id !== id));
      setToast({ visible: true, message: "Expense deleted", type: "success" });
    } catch { setToast({ visible: true, message: "Failed to delete", type: "error" }); }
    finally { setDeleting(null); }
  };

  const filtered = expenses.filter(e =>
    !search || e.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" /> Expenses
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Track business spending and receipts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:scale-[1.02] transition-all text-sm"
        >
          <Plus size={16} /> Record Expense
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Expenses", value: fmt(total), color: "text-slate-900" },
          { label: "This Month", value: fmt(expenses.filter(e => e.expenseDate?.startsWith(new Date().toISOString().slice(0,7))).reduce((s,e)=>s+Number(e.amount),0)), color: "text-rose-600" },
          { label: "Records", value: filtered.length, color: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text" placeholder="Search by vendor, category or description…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        />
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No expenses yet</p>
            <p className="text-sm mt-1">Record your first expense to start tracking spending</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.map(exp => (
              <div key={exp.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Receipt size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                      {exp.vendorName || CAT_LABEL(exp.category)}
                    </p>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-full">
                      {CAT_LABEL(exp.category)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-slate-400">{exp.expenseDate}</p>
                    {exp.description && <p className="text-xs text-slate-400 truncate max-w-xs">{exp.description}</p>}
                    {exp.receiptUrl && (
                      <a href={exp.receiptUrl} target="_blank" rel="noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-0.5">
                        <Upload size={11} /> Receipt
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-slate-900 dark:text-white">{fmt(exp.amount)}</p>
                </div>
                <button
                  onClick={() => handleDelete(exp.id)}
                  disabled={deleting === exp.id}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-all"
                >
                  {deleting === exp.id
                    ? <div className="w-4 h-4 border-2 border-slate-300 border-t-rose-500 rounded-full animate-spin" />
                    : <Trash2 size={15} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Expense Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white">Record Expense</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Amount (₦) *</label>
                  <input type="number" step="0.01" min="1" required
                    placeholder="0.00"
                    value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Date *</label>
                  <input type="date" required
                    value={form.expenseDate} onChange={e => setForm({...form, expenseDate: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Category *</label>
                <select required
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABEL(c)}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Vendor / Payee</label>
                <input type="text" placeholder="e.g., MTN, Access Bank, Shoprite"
                  value={form.vendorName} onChange={e => setForm({...form, vendorName: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Description</label>
                <textarea rows="2" placeholder="Brief note…"
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
                />
              </div>

              {/* Receipt upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Receipt (optional)</label>
                <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  receipt ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-600 hover:border-blue-400"
                }`}>
                  <Upload size={16} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-500 truncate">
                    {receipt ? receipt.name : "Upload JPEG, PNG or PDF (max 5 MB)"}
                  </span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden" onChange={e => setReceipt(e.target.files?.[0] || null)} />
                  {receipt && (
                    <button type="button" onClick={e => { e.preventDefault(); setReceipt(null); }}
                      className="ml-auto text-slate-400 hover:text-rose-500 transition">
                      <X size={14} />
                    </button>
                  )}
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow shadow-blue-600/25 hover:scale-[1.02] transition-all disabled:opacity-50">
                  {submitting ? "Saving…" : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}
