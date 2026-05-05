import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { Plus, X, Save, RefreshCw, Scale, Trash2 } from "lucide-react";
import Toast from "../components/Toast";
import { useOrg } from "../context/OrgContext";

const today = () => new Date().toISOString().slice(0, 10);

const inputCls = "w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";

export default function OpeningBalances() {
  const { fmt, currencySymbol } = useOrg();
  const [accounts, setAccounts] = useState([]);
  const [existing, setExisting] = useState(null); // null = not loaded, [] = none
  const [asOfDate, setAsOfDate] = useState(today());
  const [lines, setLines] = useState([{ accountId: "", debit: "", credit: "" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const notify = (message, type = "success") => setToast({ visible: true, message, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [accRes, obRes] = await Promise.all([
        api.get("/api/accounting/accounts"),
        api.get("/api/accounting/opening-balances").catch(err => {
          if (err.response?.status === 404) return { data: null };
          throw err;
        }),
      ]);
      setAccounts(accRes.data ?? []);
      const ob = obRes.data;
      if (ob && ob.lines && ob.lines.length > 0) {
        setExisting(ob);
        setAsOfDate(ob.asOfDate ?? today());
        setLines(ob.lines.map(l => ({
          accountId: l.accountId,
          debit: l.debit > 0 ? String(l.debit) : "",
          credit: l.credit > 0 ? String(l.credit) : "",
        })));
      } else {
        setExisting([]);
      }
    } catch {
      notify("Failed to load data", "error");
      setExisting([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateLine = (idx, field, value) => {
    setLines(ls => {
      const updated = [...ls];
      updated[idx] = { ...updated[idx], [field]: value };
      // Clear the other side when one is entered
      if (field === "debit" && value) updated[idx].credit = "";
      if (field === "credit" && value) updated[idx].debit = "";
      return updated;
    });
  };

  const addLine = () => setLines(ls => [...ls, { accountId: "", debit: "", credit: "" }]);
  const removeLine = (idx) => setLines(ls => ls.filter((_, i) => i !== idx));

  const totalDebits = lines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0);
  const totalCredits = lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isBalanced) {
      notify("Debits and credits must balance before saving", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        asOfDate,
        lines: lines
          .filter(l => l.accountId && (parseFloat(l.debit) > 0 || parseFloat(l.credit) > 0))
          .map(l => ({
            accountId: l.accountId,
            debit: parseFloat(l.debit) || 0,
            credit: parseFloat(l.credit) || 0,
          })),
      };

      const hasExisting = Array.isArray(existing) ? existing.length > 0 : !!existing;
      if (hasExisting && editMode) {
        await api.put("/api/accounting/opening-balances", payload);
        notify("Opening balances updated");
      } else {
        await api.post("/api/accounting/opening-balances", payload);
        notify("Opening balances set");
      }
      setEditMode(false);
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to save opening balances", "error");
    } finally {
      setSaving(false);
    }
  };

  const hasExistingData = existing && (Array.isArray(existing) ? existing.length > 0 : existing.lines?.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-2 text-slate-400">
        <RefreshCw size={18} className="animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Opening Balances</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Set the starting balances for your accounts when you begin using LumiLedger
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
        <strong>How it works:</strong> Enter the balance of each account as at your chosen date. Debits and credits must balance. This creates a single journal entry that initialises your books.
      </div>

      {/* View existing (read-only) */}
      {hasExistingData && !editMode && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Current Opening Balances</h2>
              <p className="text-xs text-slate-400 mt-0.5">As at {existing?.asOfDate ?? asOfDate}</p>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-700/50">
                  <th className="px-5 py-3">Account</th>
                  <th className="px-5 py-3 text-right">Debit</th>
                  <th className="px-5 py-3 text-right">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {(existing?.lines ?? lines).map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                      {l.accountCode ? `${l.accountCode} — ${l.accountName}` : (accounts.find(a => a.id === l.accountId)?.name ?? l.accountId)}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-300">{l.debit > 0 ? fmt(l.debit) : "—"}</td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-300">{l.credit > 0 ? fmt(l.credit) : "—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-slate-200 dark:border-slate-600">
                <tr className="font-bold">
                  <td className="px-5 py-3 text-slate-900 dark:text-white">Total</td>
                  <td className="px-5 py-3 text-right text-slate-900 dark:text-white">
                    {fmt((existing?.lines ?? lines).reduce((s, l) => s + (l.debit || 0), 0))}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-900 dark:text-white">
                    {fmt((existing?.lines ?? lines).reduce((s, l) => s + (l.credit || 0), 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Form (show when no existing data OR when in edit mode) */}
      {(!hasExistingData || editMode) && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">
              {editMode ? "Edit Opening Balances" : "Set Opening Balances"}
            </h2>
            {editMode && (
              <button type="button" onClick={() => setEditMode(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>

          <div className="p-5 space-y-4">
            {/* As-of date */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">As of Date *</label>
              <input
                type="date"
                value={asOfDate}
                onChange={e => setAsOfDate(e.target.value)}
                required
                className="px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            {/* Lines */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Account Lines *</label>
                <button type="button" onClick={addLine} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  <Plus size={12} /> Add line
                </button>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-12 gap-2 mb-1 px-1">
                <div className="col-span-6 text-xs text-slate-400 font-medium">Account</div>
                <div className="col-span-3 text-xs text-slate-400 font-medium text-right">Debit ({currencySymbol})</div>
                <div className="col-span-3 text-xs text-slate-400 font-medium text-right">Credit ({currencySymbol})</div>
              </div>

              <div className="space-y-2">
                {lines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-6">
                      <select
                        value={line.accountId}
                        onChange={e => updateLine(idx, "accountId", e.target.value)}
                        required
                        className={inputCls}
                      >
                        <option value="">Select account…</option>
                        {accounts.map(a => (
                          <option key={a.id} value={a.id}>{a.code} — {a.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number" min="0" step="0.01" placeholder="0.00"
                        value={line.debit}
                        onChange={e => updateLine(idx, "debit", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number" min="0" step="0.01" placeholder="0.00"
                        value={line.credit}
                        onChange={e => updateLine(idx, "credit", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center pt-2">
                      {lines.length > 1 && (
                        <button type="button" onClick={() => removeLine(idx)} className="text-slate-400 hover:text-rose-500 transition">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Balance summary */}
              <div className={`mt-4 p-3 rounded-xl border text-sm ${isBalanced ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale size={14} />
                    <span className="font-medium">{isBalanced ? "Balanced" : "Unbalanced"}</span>
                  </div>
                  <div className="flex gap-6 text-xs">
                    <span>Debits: {fmt(totalDebits)}</span>
                    <span>Credits: {fmt(totalCredits)}</span>
                    {!isBalanced && <span className="font-semibold">Diff: {fmt(Math.abs(totalDebits - totalCredits))}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2">
              {editMode && (
                <button type="button" onClick={() => setEditMode(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition">
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving || !isBalanced}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow hover:shadow-md hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={14} />
                {saving ? "Saving…" : editMode ? "Update Balances" : "Save Opening Balances"}
              </button>
            </div>
          </div>
        </form>
      )}

      <Toast visible={toast.visible} message={toast.message} type={toast.type} onClose={() => setToast(t => ({ ...t, visible: false }))} />
    </div>
  );
}
