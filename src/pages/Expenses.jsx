import { useEffect, useState } from "react";
import api, { getUserFromToken } from "../services/api";
import {
  Plus, Trash2, Receipt, Upload, X, Search,
  RefreshCw, BarChart2, List, Download, CalendarRange,
  Check, XCircle, AlertTriangle, Edit2, RotateCcw,
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
const PAYMENT_TYPES = ["CASH","BANK_TRANSFER","CARD","MOBILE_MONEY","OTHER"];

const CAT_LABEL = (c) => (c || "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
const PAY_LABEL = (p) => (p || "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
const fmt       = (v) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(v || 0);
const today      = () => new Date().toISOString().slice(0, 10);
const monthStart = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

const CAT_COLORS = [
  "#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6",
  "#06b6d4","#f97316","#84cc16","#ec4899","#6366f1",
  "#14b8a6","#e11d48","#a855f7","#0ea5e9","#64748b",
];
const RECURRENCE_LABELS = { WEEKLY: "Weekly", MONTHLY: "Monthly", YEARLY: "Yearly" };
const STATUS_CFG = {
  PENDING:  { label: "Pending",  cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
  APPROVED: { label: "Approved", cls: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
  REJECTED: { label: "Rejected", cls: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" },
};

const emptyForm = () => ({
  amount: "", category: "", vendorName: "", description: "",
  expenseDate: today(), paymentType: "", recurring: false, recurrenceInterval: "MONTHLY",
});

export default function Expenses() {
  const userInfo     = getUserFromToken();
  const isStaff      = userInfo?.role === "STAFF";
  const isAccountant = ["ADMIN", "SUPER_ADMIN"].includes(userInfo?.role);

  const [tab, setTab]         = useState("list");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [catFilter, setCatFilter]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast]     = useState({ visible: false, message: "", type: "info" });
  const [deleting, setDeleting] = useState(null);
  const [duplicateIds, setDuplicateIds] = useState(new Set());

  // Create form
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm());
  const [receipt, setReceipt]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit form
  const [showEditModal, setShowEditModal]   = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm]             = useState(emptyForm());
  const [editReceipt, setEditReceipt]       = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Workflow
  const [approving, setApproving]   = useState(null);
  const [resubmitting, setResubmitting] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null); // expense id, or null = bulk
  const [rejectReason, setRejectReason] = useState("");
  const [rejectComment, setRejectComment] = useState("");
  const [rejecting, setRejecting]   = useState(false);

  // Bulk
  const [selected, setSelected]         = useState(new Set());
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  // Report
  const [reportFrom, setReportFrom]       = useState(monthStart());
  const [reportTo, setReportTo]           = useState(today());
  const [reportCat, setReportCat]         = useState("");
  const [reportData, setReportData]       = useState([]);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
    if (isAccountant) fetchDuplicates();
  }, []);

  const showToast = (message, type = "success") => setToast({ visible: true, message, type });

  async function fetchExpenses() {
    try {
      setLoading(true);
      const res = await api.get("/api/expenses", { params: { page: 0, size: 200 } });
      setExpenses(res.data.content || []);
    } catch { showToast("Failed to load expenses", "error"); }
    finally { setLoading(false); }
  }

  async function fetchDuplicates() {
    try {
      const res = await api.get("/api/expenses/duplicates");
      setDuplicateIds(new Set((res.data || []).map(e => e.id)));
    } catch { /* silent */ }
  }

  async function fetchReport() {
    try {
      setReportLoading(true);
      const params = { from: reportFrom, to: reportTo };
      if (reportCat) params.category = reportCat;
      const res = await api.get("/api/expenses/report", { params });
      setReportData(res.data || []);
    } catch { showToast("Failed to load report", "error"); }
    finally { setReportLoading(false); }
  }

  useEffect(() => { if (tab === "report") fetchReport(); }, [tab]);

  // ── Create ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = buildFormData(form, receipt);
      await api.post("/api/expenses", fd, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Expense submitted for review");
      setShowForm(false); setForm(emptyForm()); setReceipt(null);
      fetchExpenses();
    } catch (err) { showToast(err.response?.data?.message || "Failed to save expense", "error"); }
    finally { setSubmitting(false); }
  }

  // ── Edit ───────────────────────────────────────────────────────────────────
  function openEditModal(exp) {
    setEditingExpense(exp);
    setEditForm({
      amount: exp.amount, category: exp.category, vendorName: exp.vendorName || "",
      description: exp.description || "", expenseDate: exp.expenseDate,
      paymentType: exp.paymentType || "", recurring: exp.recurring,
      recurrenceInterval: exp.recurrenceInterval || "MONTHLY",
    });
    setEditReceipt(null);
    setShowEditModal(true);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      const fd = buildFormData(editForm, editReceipt);
      const res = await api.put(`/api/expenses/${editingExpense.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setExpenses(prev => prev.map(e => e.id === editingExpense.id ? res.data : e));
      setShowEditModal(false);
      showToast("Expense updated");
    } catch (err) { showToast(err.response?.data?.message || "Failed to update", "error"); }
    finally { setEditSubmitting(false); }
  }

  // ── Approve ────────────────────────────────────────────────────────────────
  async function handleApprove(id) {
    setApproving(id);
    try {
      await api.post(`/api/expenses/${id}/approve`);
      setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: "APPROVED" } : e));
      showToast("Expense approved");
    } catch (err) { showToast(err.response?.data?.message || "Failed to approve", "error"); }
    finally { setApproving(null); }
  }

  // ── Reject ─────────────────────────────────────────────────────────────────
  function openRejectModal(id) {
    setRejectTarget(id); setRejectReason(""); setRejectComment(""); setShowRejectModal(true);
  }

  async function handleReject() {
    if (!rejectReason.trim()) { showToast("Rejection reason is required", "error"); return; }
    setRejecting(true);
    try {
      const body = { rejectionReason: rejectReason, accountantComment: rejectComment };
      if (rejectTarget) {
        await api.post(`/api/expenses/${rejectTarget}/reject`, body);
        setExpenses(prev => prev.map(e =>
          e.id === rejectTarget ? { ...e, status: "REJECTED", rejectionReason: rejectReason, accountantComment: rejectComment } : e
        ));
        showToast("Expense rejected — staff notified by email");
      } else {
        await api.post("/api/expenses/bulk-action", { ids: [...selected], action: "REJECT", ...body });
        await fetchExpenses(); setSelected(new Set());
        showToast(`${selected.size} expense(s) rejected`);
      }
      setShowRejectModal(false);
    } catch (err) { showToast(err.response?.data?.message || "Failed to reject", "error"); }
    finally { setRejecting(false); }
  }

  // ── Resubmit ───────────────────────────────────────────────────────────────
  async function handleResubmit(id) {
    setResubmitting(id);
    try {
      await api.post(`/api/expenses/${id}/resubmit`);
      setExpenses(prev => prev.map(e =>
        e.id === id ? { ...e, status: "PENDING", rejectionReason: null, accountantComment: null } : e
      ));
      showToast("Expense resubmitted for review");
    } catch (err) { showToast(err.response?.data?.message || "Failed to resubmit", "error"); }
    finally { setResubmitting(null); }
  }

  // ── Bulk ───────────────────────────────────────────────────────────────────
  async function handleBulkApprove() {
    setBulkSubmitting(true);
    try {
      await api.post("/api/expenses/bulk-action", { ids: [...selected], action: "APPROVE" });
      await fetchExpenses(); setSelected(new Set());
      showToast(`${selected.size} expense(s) approved`);
    } catch (err) { showToast(err.response?.data?.message || "Bulk approve failed", "error"); }
    finally { setBulkSubmitting(false); }
  }

  async function handleBulkDelete() {
    setBulkSubmitting(true);
    try {
      await api.post("/api/expenses/bulk-action", { ids: [...selected], action: "DELETE" });
      await fetchExpenses(); setSelected(new Set());
      showToast(`${selected.size} expense(s) deleted`);
    } catch (err) { showToast(err.response?.data?.message || "Bulk delete failed", "error"); }
    finally { setBulkSubmitting(false); }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    setDeleting(id);
    try {
      await api.delete(`/api/expenses/${id}`);
      setExpenses(prev => prev.filter(e => e.id !== id));
      showToast("Expense deleted");
    } catch (err) { showToast(err.response?.data?.message || "Failed to delete", "error"); }
    finally { setDeleting(null); }
  }

  // ── Export CSV ─────────────────────────────────────────────────────────────
  function handleExportCsv() {
    const params = new URLSearchParams({ from: reportFrom, to: reportTo });
    if (reportCat) params.set("category", reportCat);
    const token = localStorage.getItem("token");
    fetch(`/api/expenses/export/csv?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "expenses.csv"; a.click(); })
      .catch(() => showToast("CSV export failed", "error"));
  }

  // ── Selection helpers ──────────────────────────────────────────────────────
  const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSelectAll = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(e => e.id)));

  // ── Helpers ────────────────────────────────────────────────────────────────
  function buildFormData(f, file) {
    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify({
      amount: parseFloat(f.amount), category: f.category,
      vendorName: f.vendorName || null, description: f.description || null,
      expenseDate: f.expenseDate, paymentType: f.paymentType || null,
      recurring: f.recurring, recurrenceInterval: f.recurring ? f.recurrenceInterval : null,
    })], { type: "application/json" }));
    if (file) fd.append("receipt", file);
    return fd;
  }

  // ── Derived state ──────────────────────────────────────────────────────────
  const filtered = expenses.filter(e => {
    const s = search.toLowerCase();
    const matchSearch = !search || e.vendorName?.toLowerCase().includes(s) || e.category?.toLowerCase().includes(s) || e.description?.toLowerCase().includes(s);
    return matchSearch && (!catFilter || e.category === catFilter) && (!statusFilter || e.status === statusFilter);
  });

  const total     = filtered.reduce((s, e) => s + Number(e.amount), 0);
  const thisMonth = expenses.filter(e => e.expenseDate?.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, e) => s + Number(e.amount), 0);
  const recurring = expenses.filter(e => e.recurring).length;
  const pending   = expenses.filter(e => e.status === "PENDING").length;

  const chartData = (() => {
    const map = {};
    reportData.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return Object.entries(map).map(([cat, t]) => ({ name: CAT_LABEL(cat), total: t, cat })).sort((a, b) => b.total - a.total);
  })();
  const reportTotal = reportData.reduce((s, e) => s + Number(e.amount), 0);

  const inputCls = "w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";

  // ── Shared expense form fields ─────────────────────────────────────────────
  function FormFields({ f, setF }) {
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Amount (₦) *</label>
            <input type="number" step="0.01" min="1" required placeholder="0.00"
              value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Date *</label>
            <input type="date" required value={f.expenseDate}
              onChange={e => setF({ ...f, expenseDate: e.target.value })} className={inputCls} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Category *</label>
          <select required value={f.category} onChange={e => setF({ ...f, category: e.target.value })} className={inputCls}>
            <option value="">Select category…</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABEL(c)}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Vendor / Payee</label>
            <input type="text" placeholder="e.g., MTN, Shoprite"
              value={f.vendorName} onChange={e => setF({ ...f, vendorName: e.target.value })} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Payment Type</label>
            <select value={f.paymentType} onChange={e => setF({ ...f, paymentType: e.target.value })} className={inputCls}>
              <option value="">Select…</option>
              {PAYMENT_TYPES.map(p => <option key={p} value={p}>{PAY_LABEL(p)}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Description</label>
          <textarea rows={2} placeholder="Brief note…"
            value={f.description} onChange={e => setF({ ...f, description: e.target.value })}
            className={`${inputCls} resize-none`} />
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setF({ ...f, recurring: !f.recurring })}
              className={`relative w-10 h-5 rounded-full transition-colors ${f.recurring ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}>
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${f.recurring ? "translate-x-5" : ""}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Recurring expense</p>
              <p className="text-xs text-slate-400">Auto-creates a copy on each cycle</p>
            </div>
          </label>
          {f.recurring && (
            <select value={f.recurrenceInterval} onChange={e => setF({ ...f, recurrenceInterval: e.target.value })} className={inputCls}>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          )}
        </div>
      </>
    );
  }

  function ReceiptUpload({ file, setFile, existingUrl }) {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Receipt {existingUrl && !file ? "(replace existing)" : "(optional)"}
        </label>
        {existingUrl && !file && (
          <a href={existingUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mb-1">
            <Upload size={11} /> View current receipt
          </a>
        )}
        <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${file ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-600 hover:border-blue-400"}`}>
          <Upload size={16} className="text-slate-400 shrink-0" />
          <span className="text-sm text-slate-500 truncate">{file ? file.name : "Upload JPEG, PNG or PDF"}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden"
            onChange={e => setFile(e.target.files?.[0] || null)} />
          {file && <button type="button" onClick={e => { e.preventDefault(); setFile(null); }} className="ml-auto text-slate-400 hover:text-rose-500"><X size={14} /></button>}
        </label>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" /> Expenses
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isStaff ? "Submit and track your expenses" : "Review and manage team expenses"}
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:scale-[1.02] transition-all text-sm">
          <Plus size={16} /> Record Expense
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total (filtered)", value: fmt(total),     color: "text-slate-900 dark:text-white" },
          { label: "This Month",       value: fmt(thisMonth), color: "text-rose-600" },
          isAccountant
            ? { label: "Pending Review", value: pending,         color: "text-amber-600" }
            : { label: "Records",        value: filtered.length, color: "text-blue-600" },
          { label: "Recurring", value: recurring, color: "text-emerald-600" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs — Report hidden from staff */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {[
          { key: "list",   label: "Expenses", icon: List },
          ...(!isStaff ? [{ key: "report", label: "Report", icon: BarChart2 }] : []),
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${tab === key ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* ── LIST TAB ── */}
      {tab === "list" && (
        <>
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search vendor, category…" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
            </div>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABEL(c)}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition">
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Bulk toolbar */}
          {isAccountant && selected.size > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{selected.size} selected</span>
              <div className="flex gap-2 ml-auto flex-wrap">
                <button onClick={handleBulkApprove} disabled={bulkSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
                  <Check size={12} /> Approve All
                </button>
                <button onClick={() => { setRejectTarget(null); setRejectReason(""); setRejectComment(""); setShowRejectModal(true); }} disabled={bulkSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition disabled:opacity-50">
                  <XCircle size={12} /> Reject All
                </button>
                <button onClick={handleBulkDelete} disabled={bulkSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
                  <Trash2 size={12} /> Delete All
                </button>
                <button onClick={() => setSelected(new Set())} className="text-xs text-slate-400 hover:text-slate-600 transition">Clear</button>
              </div>
            </div>
          )}

          {/* Expense table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {isAccountant && filtered.length > 0 && (
              <div className="flex items-center gap-3 px-5 py-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
                <input type="checkbox" checked={selected.size > 0 && selected.size === filtered.length}
                  onChange={toggleSelectAll} className="rounded border-slate-300 text-blue-600" />
                <span className="text-xs text-slate-400">Select all</span>
              </div>
            )}

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
                {filtered.map(exp => {
                  const statusCfg  = STATUS_CFG[exp.status] || STATUS_CFG.PENDING;
                  const isDuplicate = duplicateIds.has(exp.id);

                  return (
                    <div key={exp.id}
                      className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition group ${selected.has(exp.id) ? "bg-blue-50/60 dark:bg-blue-900/10" : ""}`}>

                      {isAccountant && (
                        <input type="checkbox" checked={selected.has(exp.id)} onChange={() => toggleSelect(exp.id)}
                          className="mt-1 rounded border-slate-300 text-blue-600 shrink-0" />
                      )}

                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                        {exp.recurring ? <RefreshCw size={15} className="text-emerald-600" /> : <Receipt size={15} className="text-blue-600" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                            {exp.vendorName || CAT_LABEL(exp.category)}
                          </p>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-full">
                            {CAT_LABEL(exp.category)}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusCfg.cls}`}>
                            {statusCfg.label}
                          </span>
                          {isDuplicate && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full">
                              <AlertTriangle size={10} /> Possible duplicate
                            </span>
                          )}
                          {exp.recurring && (
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full flex items-center gap-1">
                              <RefreshCw size={10} />{RECURRENCE_LABELS[exp.recurrenceInterval] ?? "Recurring"}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <p className="text-xs text-slate-400">{exp.expenseDate}</p>
                          {exp.paymentType && <span className="text-xs text-slate-400">{PAY_LABEL(exp.paymentType)}</span>}
                          {exp.description && <p className="text-xs text-slate-400 truncate max-w-[200px]">{exp.description}</p>}
                          {exp.receiptUrl && (
                            <a href={exp.receiptUrl} target="_blank" rel="noreferrer"
                              className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-0.5">
                              <Upload size={11} /> Receipt
                            </a>
                          )}
                          {isAccountant && exp.createdBy && <span className="text-xs text-slate-400">by {exp.createdBy}</span>}
                        </div>

                        {/* Rejection reason banner */}
                        {exp.status === "REJECTED" && exp.rejectionReason && (
                          <div className="mt-2 p-2.5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg">
                            <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-0.5">Rejection reason</p>
                            <p className="text-xs text-rose-600 dark:text-rose-300">{exp.rejectionReason}</p>
                            {exp.accountantComment && (
                              <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 italic">{exp.accountantComment}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="font-bold text-slate-900 dark:text-white shrink-0">{fmt(exp.amount)}</p>

                      {/* Row actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isAccountant && exp.status === "PENDING" && (
                          <>
                            <button onClick={() => handleApprove(exp.id)} disabled={approving === exp.id} title="Approve"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition">
                              {approving === exp.id
                                ? <div className="w-4 h-4 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                                : <Check size={15} />}
                            </button>
                            <button onClick={() => openRejectModal(exp.id)} title="Reject"
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition">
                              <XCircle size={15} />
                            </button>
                          </>
                        )}

                        {isStaff && exp.status === "REJECTED" && (
                          <>
                            <button onClick={() => openEditModal(exp)}
                              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                              <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={() => handleResubmit(exp.id)} disabled={resubmitting === exp.id}
                              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                              {resubmitting === exp.id
                                ? <div className="w-3 h-3 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                                : <RotateCcw size={12} />}
                              Resubmit
                            </button>
                          </>
                        )}

                        {(isAccountant || (isStaff && exp.status !== "APPROVED")) && (
                          <button onClick={() => handleDelete(exp.id)} disabled={deleting === exp.id}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-all">
                            {deleting === exp.id
                              ? <div className="w-4 h-4 border-2 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
                              : <Trash2 size={15} />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── REPORT TAB ── */}
      {tab === "report" && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex flex-wrap gap-3 items-end">
              {[["From", reportFrom, setReportFrom], ["To", reportTo, setReportTo]].map(([lbl, val, set]) => (
                <div key={lbl} className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{lbl}</label>
                  <input type="date" value={val} onChange={e => set(e.target.value)}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                </div>
              ))}
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
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
                <p className="text-sm font-medium opacity-80">Total Spending</p>
                <p className="text-4xl font-bold mt-1">{fmt(reportTotal)}</p>
                <p className="text-xs opacity-70 mt-1">{reportData.length} transactions · {reportFrom} to {reportTo}</p>
              </div>

              {chartData.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Spending by Category</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" interval={0} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v)} width={80} />
                      <Tooltip formatter={(v) => [fmt(v), "Amount"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                      <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

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

      {/* ── Create Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white">Record Expense</h2>
              <button onClick={() => { setShowForm(false); setForm(emptyForm()); setReceipt(null); }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FormFields f={form} setF={setForm} />
              <ReceiptUpload file={receipt} setFile={setReceipt} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm()); setReceipt(null); }}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow shadow-blue-600/25 hover:scale-[1.02] transition-all disabled:opacity-50">
                  {submitting ? "Saving…" : "Submit Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {showEditModal && editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white">Edit Expense</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"><X size={18} /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <FormFields f={editForm} setF={setEditForm} />
              <ReceiptUpload file={editReceipt} setFile={setEditReceipt} existingUrl={editingExpense.receiptUrl} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
                <button type="submit" disabled={editSubmitting}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow shadow-blue-600/25 hover:scale-[1.02] transition-all disabled:opacity-50">
                  {editSubmitting ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reject Modal ── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white">Reject Expense</h2>
              <button onClick={() => setShowRejectModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {rejectTarget === null && (
                <div className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-700 dark:text-amber-400">
                  Rejecting {selected.size} expense(s). Each submitter will be notified by email.
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea rows={3} placeholder="e.g. Receipt is missing, duplicate submission…"
                  value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  className={`${inputCls} resize-none`} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Additional Note (optional)</label>
                <textarea rows={2} placeholder="Extra guidance for the staff member…"
                  value={rejectComment} onChange={e => setRejectComment(e.target.value)}
                  className={`${inputCls} resize-none`} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
                <button onClick={handleReject} disabled={rejecting}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition disabled:opacity-50">
                  {rejecting ? "Rejecting…" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}
