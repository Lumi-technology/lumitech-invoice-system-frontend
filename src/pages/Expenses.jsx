import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Plus, Trash2, Receipt, Upload, X, Search,
  RefreshCw, BarChart2, List, Download, CalendarRange,
} from "lucide-react";
import Toast from "../components/Toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

const CATEGORIES = [
  "OFFICE_SUPPLIES","UTILITIES","RENT","SALARIES","TRANSPORT",
  "MARKETING","SOFTWARE","EQUIPMENT","PROFESSIONAL_FEES",
  "BANK_CHARGES","TAXES","REPAIRS_MAINTENANCE","ENTERTAINMENT","INSURANCE","OTHER",
];

const CAT_LABEL  = (c) => (c || "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
const fmt        = (v) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(v || 0);
const today      = () => new Date().toISOString().slice(0, 10);
const monthStart = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

const CAT_COLORS = [
  "#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6",
  "#06b6d4","#f97316","#84cc16","#ec4899","#6366f1",
  "#14b8a6","#e11d48","#a855f7","#0ea5e9","#64748b",
];

const RECURRENCE_LABELS = { WEEKLY: "Weekly", MONTHLY: "Monthly", YEARLY: "Yearly" };

// ── empty form state ──────────────────────────────────────────────────────────
const emptyForm = () => ({
  amount: "", category: "", vendorName: "", description: "",
  expenseDate: today(), recurring: false, recurrenceInterval: "MONTHLY",
});

export default function Expenses() {
  const [tab, setTab]           = useState("list"); // "list" | "report"
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [toast, setToast]       = useState({ visible: false, message: "", type: "info" });
  const [deleting, setDeleting] = useState(null);
  const [form, setForm]         = useState(emptyForm());
  const [receipt, setReceipt]   = useState(null);

  // Report state
  const [reportFrom, setReportFrom]     = useState(monthStart());
  const [reportTo, setReportTo]         = useState(today());
  const [reportCat, setReportCat]       = useState("");
  const [reportData, setReportData]     = useState([]);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => { fetchExpenses(); }, []);

  const showToast = (message, type = "success") => setToast({ visible: true, message, type });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/expenses", { params: { page: 0, size: 200 } });
      setExpenses(res.data.content || []);
    } catch { showToast("Failed to load expenses", "error"); }
    finally { setLoading(false); }
  };

  const fetchReport = async () => {
    try {
      setReportLoading(true);
      const params = { from: reportFrom, to: reportTo };
      if (reportCat) params.category = reportCat;
      const res = await api.get("/api/expenses/report", { params });
      setReportData(res.data || []);
    } catch { showToast("Failed to load report", "error"); }
    finally { setReportLoading(false); }
  };

  useEffect(() => { if (tab === "report") fetchReport(); }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.recurring && !form.recurrenceInterval) {
      showToast("Please select a recurrence frequency", "error");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("data", new Blob([JSON.stringify({
        amount:              parseFloat(form.amount),
        category:            form.category,
        vendorName:          form.vendorName   || null,
        description:         form.description  || null,
        expenseDate:         form.expenseDate,
        recurring:           form.recurring,
        recurrenceInterval:  form.recurring ? form.recurrenceInterval : null,
      })], { type: "application/json" }));
      if (receipt) fd.append("receipt", receipt);
      await api.post("/api/expenses", fd, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Expense recorded");
      setShowForm(false);
      setForm(emptyForm());
      setReceipt(null);
      fetchExpenses();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save expense", "error");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/api/expenses/${id}`);
      setExpenses(prev => prev.filter(e => e.id !== id));
      showToast("Expense deleted");
    } catch { showToast("Failed to delete", "error"); }
    finally { setDeleting(null); }
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams({ from: reportFrom, to: reportTo });
    if (reportCat) params.set("category", reportCat);
    const token = localStorage.getItem("token");
    const url = `/api/expenses/export/csv?${params}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "expenses.csv";
        a.click();
      })
      .catch(() => showToast("CSV export failed", "error"));
  };

  // Filtered list
  const filtered = expenses.filter(e => {
    const matchSearch = !search ||
      e.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
      e.category?.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || e.category === catFilter;
    return matchSearch && matchCat;
  });

  const total      = filtered.reduce((s, e) => s + Number(e.amount), 0);
  const thisMonth  = expenses.filter(e => e.expenseDate?.startsWith(new Date().toISOString().slice(0, 7)))
                             .reduce((s, e) => s + Number(e.amount), 0);
  const recurring  = expenses.filter(e => e.recurring).length;

  // Chart data from report
  const chartData = (() => {
    const map = {};
    reportData.forEach(e => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(map)
      .map(([cat, total]) => ({ name: CAT_LABEL(cat), total, cat }))
      .sort((a, b) => b.total - a.total);
  })();

  const reportTotal = reportData.reduce((s, e) => s + Number(e.amount), 0);

  // ── Input class ──────────────────────────────────────────────────────────────
  const inputCls = "w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";

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

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total (filtered)", value: fmt(total),     color: "text-slate-900 dark:text-white" },
          { label: "This Month",       value: fmt(thisMonth), color: "text-rose-600" },
          { label: "Records",          value: filtered.length, color: "text-blue-600" },
          { label: "Recurring",        value: recurring,       color: "text-emerald-600" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {[
          { key: "list",   label: "Expenses",  icon: List },
          { key: "report", label: "Report",    icon: BarChart2 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === key
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* ── LIST TAB ───────────────────────────────────────────────────────────── */}
      {tab === "list" && (
        <>
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text" placeholder="Search vendor, category…"
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <select
              value={catFilter} onChange={e => setCatFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABEL(c)}</option>)}
            </select>
          </div>

          {/* Expense list */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No expenses found</p>
                <p className="text-sm mt-1">Adjust your filters or record a new expense</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map(exp => (
                  <div key={exp.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition group">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      {exp.recurring
                        ? <RefreshCw size={15} className="text-emerald-600" />
                        : <Receipt size={15} className="text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                          {exp.vendorName || CAT_LABEL(exp.category)}
                        </p>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-full">
                          {CAT_LABEL(exp.category)}
                        </span>
                        {exp.recurring && (
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full flex items-center gap-1">
                            <RefreshCw size={10} />{RECURRENCE_LABELS[exp.recurrenceInterval] ?? "Recurring"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
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
        </>
      )}

      {/* ── REPORT TAB ─────────────────────────────────────────────────────────── */}
      {tab === "report" && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">From</label>
                <input type="date" value={reportFrom} onChange={e => setReportFrom(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">To</label>
                <input type="date" value={reportTo} onChange={e => setReportTo(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Category</label>
                <select value={reportCat} onChange={e => setReportCat(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition">
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABEL(c)}</option>)}
                </select>
              </div>
              <button onClick={fetchReport}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
                <CalendarRange size={14} /> Run Report
              </button>
              <button onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition ml-auto">
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          {reportLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Total */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
                <p className="text-sm font-medium opacity-80">Total Spending</p>
                <p className="text-4xl font-bold mt-1">{fmt(reportTotal)}</p>
                <p className="text-xs opacity-70 mt-1">{reportData.length} transactions · {reportFrom} to {reportTo}</p>
              </div>

              {/* Spending by category chart */}
              {chartData.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Spending by Category</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" interval={0} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v).replace("₦", "₦")} width={80} />
                      <Tooltip
                        formatter={(v) => [fmt(v), "Amount"]}
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }}
                      />
                      <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Category breakdown table */}
              {chartData.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Category Breakdown</p>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {chartData.map((row, i) => (
                      <div key={row.cat} className="flex items-center gap-3 px-5 py-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                        <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{row.name}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{fmt(row.total)}</span>
                        <span className="text-xs text-slate-400 w-12 text-right">
                          {reportTotal > 0 ? Math.round((row.total / reportTotal) * 100) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportData.length === 0 && (
                <div className="text-center py-16 text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No expenses in this period</p>
                  <p className="text-sm mt-1">Adjust the date range and run the report again</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Record Expense Modal ──────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white">Record Expense</h2>
              <button onClick={() => { setShowForm(false); setForm(emptyForm()); setReceipt(null); }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Amount (₦) *</label>
                  <input type="number" step="0.01" min="1" required
                    placeholder="0.00" value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Date *</label>
                  <input type="date" required value={form.expenseDate}
                    onChange={e => setForm({ ...form, expenseDate: e.target.value })}
                    className={inputCls} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Category *</label>
                <select required value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className={inputCls}>
                  <option value="">Select category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABEL(c)}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Vendor / Payee</label>
                <input type="text" placeholder="e.g., MTN, Access Bank, Shoprite"
                  value={form.vendorName} onChange={e => setForm({ ...form, vendorName: e.target.value })}
                  className={inputCls} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Description</label>
                <textarea rows={2} placeholder="Brief note…"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className={`${inputCls} resize-none`} />
              </div>

              {/* Recurring toggle */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm({ ...form, recurring: !form.recurring })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.recurring ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.recurring ? "translate-x-5" : ""}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Recurring expense</p>
                    <p className="text-xs text-slate-400">Auto-creates a copy on each cycle</p>
                  </div>
                </label>
                {form.recurring && (
                  <select value={form.recurrenceInterval}
                    onChange={e => setForm({ ...form, recurrenceInterval: e.target.value })}
                    className={inputCls}>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                )}
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
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm()); setReceipt(null); }}
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
