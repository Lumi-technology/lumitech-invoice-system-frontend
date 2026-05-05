import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { Plus, X, FileText, Check, Ban, Undo2, ChevronDown, ChevronUp, Search, RefreshCw } from "lucide-react";
import Toast from "../components/Toast";
import { useOrg } from "../context/OrgContext";
const today = () => new Date().toISOString().slice(0, 10);

const STATUS_CFG = {
  DRAFT:   { label: "Draft",   cls: "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400" },
  ISSUED:  { label: "Issued",  cls: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
  APPLIED: { label: "Applied", cls: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
  VOIDED:  { label: "Voided",  cls: "bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400" },
};

const inputCls = "w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";
const emptyForm = () => ({ billId: "", amount: "", reason: "", issueDate: today() });

export default function DebitNotes() {
  const { fmt, currencySymbol } = useOrg();
  const [notes, setNotes] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const notify = (message, type = "success") => setToast({ visible: true, message, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dnRes, bRes] = await Promise.all([
        api.get("/api/debit-notes?size=100&sort=createdAt,desc"),
        api.get("/api/bills?size=200"),
      ]);
      setNotes(dnRes.data.content ?? []);
      setBills(bRes.data.content ?? []);
    } catch { notify("Failed to load debit notes", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/debit-notes", { ...form, amount: parseFloat(form.amount) });
      notify("Debit note created");
      setShowForm(false);
      setForm(emptyForm());
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to create debit note", "error");
    } finally { setSaving(false); }
  };

  const action = async (id, path) => {
    try {
      await api.put(`/api/debit-notes/${id}/${path}`);
      notify(`Debit note ${path}`);
      load();
    } catch (err) { notify(err.response?.data?.message || `Failed to ${path}`, "error"); }
  };

  const filtered = notes.filter(n =>
    !search ||
    n.debitNoteNumber?.toLowerCase().includes(search.toLowerCase()) ||
    n.supplierName?.toLowerCase().includes(search.toLowerCase()) ||
    n.billNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Debit Notes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Issue debit notes to suppliers to reduce bill balances</p>
        </div>
        <button onClick={() => { setShowForm(true); setForm(emptyForm()); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:scale-[1.02] transition-all">
          <Plus size={16} /> New Debit Note
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by debit note, supplier or bill…"
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-slate-400"><RefreshCw size={18} className="animate-spin" /> Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <FileText size={40} className="opacity-30" />
            <p className="text-sm">{search ? "No debit notes match your search" : "No debit notes yet"}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.map(dn => {
              const isExpanded = expandedId === dn.id;
              const sc = STATUS_CFG[dn.status] ?? STATUS_CFG.DRAFT;
              return (
                <div key={dn.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition"
                    onClick={() => setExpandedId(isExpanded ? null : dn.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{dn.debitNoteNumber}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.cls}`}>{sc.label}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{dn.supplierName} — Bill {dn.billNumber}</p>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{fmt(dn.amount)}</p>
                        <p className="text-xs text-slate-400">Issued {dn.issueDate}</p>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-5 pb-4 bg-slate-50 dark:bg-slate-700/20 border-t border-slate-100 dark:border-slate-700">
                      {dn.reason && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400"><span className="font-medium text-slate-700 dark:text-slate-300">Reason: </span>{dn.reason}</p>}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {dn.status === "DRAFT" && (
                          <button onClick={() => action(dn.id, "issue")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            <Check size={13} /> Issue
                          </button>
                        )}
                        {dn.status === "ISSUED" && (
                          <button onClick={() => action(dn.id, "apply")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                            <Undo2 size={13} /> Apply to Bill
                          </button>
                        )}
                        {(dn.status === "DRAFT" || dn.status === "ISSUED") && (
                          <button onClick={() => action(dn.id, "void")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition">
                            <Ban size={13} /> Void
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white">New Debit Note</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"><X size={18} className="text-slate-500 dark:text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Bill *</label>
                <select value={form.billId} onChange={e => setForm(f => ({ ...f, billId: e.target.value }))} required className={inputCls}>
                  <option value="">Select bill…</option>
                  {bills.filter(b => b.status !== "PAID" && b.status !== "CANCELLED").map(b => (
                    <option key={b.id} value={b.id}>{b.billNumber} — {b.supplierName} ({fmt(b.balanceDue)} due)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Debit Amount ({currencySymbol}) *</label>
                <input type="number" min="0.01" step="0.01" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Issue Date</label>
                <input type="date" value={form.issueDate} onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Reason</label>
                <textarea rows={3} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Reason for debit note…" className={inputCls} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow hover:shadow-md hover:scale-[1.02] transition-all disabled:opacity-50">
                  {saving ? "Creating…" : "Create Debit Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast visible={toast.visible} message={toast.message} type={toast.type} onClose={() => setToast(t => ({ ...t, visible: false }))} />
    </div>
  );
}
