import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import {
  Landmark, Upload, Zap, CheckCircle2, AlertCircle, RefreshCw,
  X, Link2, Link2Off, ChevronDown, ChevronUp, ShieldCheck,
} from "lucide-react";

const fmt = (v) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 }).format(v || 0);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_COLOR = {
  UNMATCHED:  "border-rose-300 bg-rose-50",
  MATCHED:    "border-amber-300 bg-amber-50",
  RECONCILED: "border-emerald-300 bg-emerald-50",
};
const STATUS_DOT = {
  UNMATCHED:  "bg-rose-400",
  MATCHED:    "bg-amber-400",
  RECONCILED: "bg-emerald-400",
};

const SAMPLE_CSV = `date,description,amount,type,reference
2026-04-10,Client payment received,50000.00,CREDIT,REF-001
2026-04-11,Office rent,120000.00,DEBIT,RENT-APR
2026-04-15,Service fee payment,35000.00,CREDIT,REF-002`;

export default function BankReconciliation() {
  const [bankTxns, setBankTxns] = useState([]);
  const [systemTxns, setSystemTxns] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selected, setSelected] = useState(null); // selected bank txn id
  const [loading, setLoading] = useState(false);
  const [autoMatching, setAutoMatching] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const fileRef = useRef();

  const loadAll = async () => {
    setLoading(true);
    try {
      const [txns, sys, sum] = await Promise.all([
        api.get("/api/reconciliation/transactions"),
        api.get("/api/reconciliation/system-transactions"),
        api.get("/api/reconciliation/summary"),
      ]);
      setBankTxns(txns.data);
      setSystemTxns(sys.data);
      setSummary(sum.data);
    } catch {
      setError("Failed to load reconciliation data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const flash = (msg, isError = false) => {
    if (isError) setError(msg); else setSuccess(msg);
    setTimeout(() => { setError(""); setSuccess(""); }, 3500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvText(ev.target.result);
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvText.trim()) return;
    setImporting(true);
    try {
      const res = await api.post("/api/reconciliation/import", csvText, {
        headers: { "Content-Type": "text/plain" },
      });
      flash(`Imported ${res.data.imported} transactions`);
      setImportOpen(false);
      setCsvText("");
      loadAll();
    } catch {
      flash("Import failed. Check your CSV format.", true);
    } finally {
      setImporting(false);
    }
  };

  const handleAutoMatch = async () => {
    setAutoMatching(true);
    try {
      const res = await api.post("/api/reconciliation/auto-match");
      flash(`Auto-matched ${res.data.matched} transaction${res.data.matched !== 1 ? "s" : ""}`);
      loadAll();
    } catch {
      flash("Auto-match failed.", true);
    } finally {
      setAutoMatching(false);
    }
  };

  const handleMatch = async (bankTxnId, systemTxnId, systemTxnType) => {
    try {
      await api.post("/api/reconciliation/match", { bankTransactionId: bankTxnId, systemTransactionId: systemTxnId, systemTransactionType: systemTxnType });
      flash("Matched successfully");
      setSelected(null);
      loadAll();
    } catch {
      flash("Match failed.", true);
    }
  };

  const handleUnmatch = async (bankTxnId) => {
    try {
      await api.delete(`/api/reconciliation/match/${bankTxnId}`);
      flash("Unmatched");
      loadAll();
    } catch {
      flash("Unmatch failed.", true);
    }
  };

  const handleConfirm = async (bankTxnId) => {
    try {
      await api.post(`/api/reconciliation/confirm/${bankTxnId}`);
      flash("Match confirmed");
      loadAll();
    } catch {
      flash("Confirm failed.", true);
    }
  };

  const handleReconcileAll = async () => {
    setReconciling(true);
    try {
      const res = await api.post("/api/reconciliation/reconcile-all");
      flash(`Reconciled ${res.data.reconciled} transaction${res.data.reconciled !== 1 ? "s" : ""}`);
      loadAll();
    } catch {
      flash("Reconcile failed.", true);
    } finally {
      setReconciling(false);
    }
  };

  const filteredBankTxns = bankTxns.filter(t =>
    filter === "ALL" || t.status === filter
  );

  const selectedTxn = bankTxns.find(t => t.id === selected);

  // For the right pane: if a bank txn is selected, show compatible system txns
  const rightPaneTxns = selectedTxn
    ? systemTxns.filter(s =>
        !s.matched &&
        s.direction === selectedTxn.type  // CREDIT↔CREDIT, DEBIT↔DEBIT
      )
    : systemTxns.filter(s => !s.matched);

  const confirmedCount = bankTxns.filter(t => t.status === "MATCHED" && t.matchStatus === "CONFIRMED").length;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-blue-600" />
            Bank Reconciliation
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Match bank transactions against your system records</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={handleAutoMatch}
            disabled={autoMatching}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${autoMatching ? "animate-pulse" : ""}`} />
            {autoMatching ? "Matching…" : "Auto-Match"}
          </button>
          <button
            onClick={handleReconcileAll}
            disabled={reconciling || confirmedCount === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            {reconciling ? "Reconciling…" : `Reconcile All${confirmedCount > 0 ? ` (${confirmedCount})` : ""}`}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{success}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Bank Credits",  value: fmt(summary.bankCredits),    color: "text-emerald-700" },
            { label: "Bank Debits",   value: fmt(summary.bankDebits),     color: "text-rose-700" },
            { label: "Sys Credits",   value: fmt(summary.systemCredits),  color: "text-emerald-600" },
            { label: "Sys Debits",    value: fmt(summary.systemDebits),   color: "text-rose-600" },
            { label: "Difference",    value: fmt(summary.difference),     color: summary.difference == 0 ? "text-emerald-700 font-bold" : "text-amber-700 font-bold" },
            { label: "Unmatched",     value: summary.unmatchedCount,      color: "text-rose-600" },
            { label: "Reconciled",    value: summary.reconciledCount,     color: "text-emerald-600" },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-400 mb-1">{s.label}</p>
              <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Two-pane */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* LEFT — Bank Transactions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Bank Transactions
              <span className="ml-2 text-xs font-normal text-slate-400">({filteredBankTxns.length})</span>
            </h2>
            <div className="flex gap-1">
              {["ALL", "UNMATCHED", "MATCHED", "RECONCILED"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                    filter === f ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[520px] divide-y divide-slate-100 dark:divide-slate-700">
            {loading && (
              <div className="py-12 text-center text-slate-400 text-sm">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /> Loading…
              </div>
            )}
            {!loading && filteredBankTxns.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">
                No transactions. Import a CSV to get started.
              </div>
            )}
            {filteredBankTxns.map(txn => {
              const isSelected = selected === txn.id;
              return (
                <div
                  key={txn.id}
                  onClick={() => txn.status !== "RECONCILED" && setSelected(isSelected ? null : txn.id)}
                  className={`px-4 py-3 cursor-pointer transition border-l-4 ${STATUS_COLOR[txn.status]} ${
                    isSelected ? "ring-2 ring-inset ring-blue-400" : "hover:brightness-95"
                  } ${txn.status === "RECONCILED" ? "cursor-default opacity-75" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${STATUS_DOT[txn.status]}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                          {txn.description || "—"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{fmtDate(txn.date)} · {txn.reference || "No ref"}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${txn.type === "CREDIT" ? "text-emerald-700" : "text-rose-700"}`}>
                        {txn.type === "CREDIT" ? "+" : "-"}{fmt(txn.amount)}
                      </p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        txn.status === "RECONCILED" ? "bg-emerald-100 text-emerald-700" :
                        txn.status === "MATCHED"    ? "bg-amber-100 text-amber-700" :
                                                      "bg-rose-100 text-rose-700"
                      }`}>
                        {txn.status === "MATCHED" && txn.matchStatus === "SUGGESTED" ? "Suggested" : txn.status.charAt(0) + txn.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>

                  {/* Actions for matched transactions */}
                  {txn.status === "MATCHED" && isSelected && (
                    <div className="flex gap-2 mt-3">
                      {txn.matchStatus === "SUGGESTED" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleConfirm(txn.id); }}
                          className="flex-1 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                        >
                          Confirm Match
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUnmatch(txn.id); }}
                        className="flex-1 py-1.5 text-xs font-semibold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <Link2Off className="w-3 h-3" /> Unmatch
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — System Transactions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {selectedTxn
                ? `Matching: ${selectedTxn.description || fmtDate(selectedTxn.date)}`
                : "System Transactions"}
              <span className="ml-2 text-xs font-normal text-slate-400">
                ({rightPaneTxns.length} unmatched)
              </span>
            </h2>
            {selectedTxn && (
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {selectedTxn.type === "CREDIT" ? "credits" : "debits"} — click to match
              </p>
            )}
          </div>

          <div className="overflow-y-auto max-h-[520px] divide-y divide-slate-100 dark:divide-slate-700">
            {rightPaneTxns.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">
                {selectedTxn ? "No compatible unmatched system transactions." : "All system transactions are matched."}
              </div>
            )}
            {rightPaneTxns.map(sys => {
              const isExactMatch = selectedTxn &&
                sys.amount != null &&
                selectedTxn.amount != null &&
                Math.abs(Number(sys.amount) - Number(selectedTxn.amount)) < 0.01;
              return (
                <div
                  key={sys.id}
                  className={`px-4 py-3 transition ${
                    selectedTxn
                      ? `cursor-pointer ${isExactMatch ? "bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 hover:bg-emerald-100" : "hover:bg-slate-50 dark:hover:bg-slate-700/30"}`
                      : "opacity-75"
                  }`}
                  onClick={() => selectedTxn && handleMatch(selectedTxn.id, sys.id, sys.type)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${sys.direction === "CREDIT" ? "bg-emerald-400" : "bg-rose-400"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                          {sys.description}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {fmtDate(sys.date)} · {sys.type}
                          {isExactMatch && <span className="ml-2 text-emerald-600 font-semibold">✓ Exact match</span>}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${sys.direction === "CREDIT" ? "text-emerald-700" : "text-rose-700"}`}>
                        {sys.direction === "CREDIT" ? "+" : "-"}{fmt(sys.amount)}
                      </p>
                      {selectedTxn && (
                        <span className="text-xs text-blue-600 font-medium flex items-center justify-end gap-1 mt-0.5">
                          <Link2 className="w-3 h-3" /> Match
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        {[
          { dot: "bg-rose-400",    label: "Unmatched — needs review" },
          { dot: "bg-amber-400",   label: "Matched — pending confirmation" },
          { dot: "bg-emerald-400", label: "Reconciled — locked" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Import Modal */}
      {importOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Import Bank Transactions</h3>
              <button onClick={() => setImportOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 text-xs text-slate-500 font-mono border border-slate-200 dark:border-slate-600">
                <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">Expected CSV format:</p>
                <p>date,description,amount,type,reference</p>
                <p>2026-04-10,Client payment,50000.00,CREDIT,REF-001</p>
                <p>2026-04-11,Office rent,120000.00,DEBIT,RENT-APR</p>
              </div>
              <div>
                <input type="file" accept=".csv" ref={fileRef} onChange={handleFileUpload} className="hidden" />
                <button
                  onClick={() => fileRef.current.click()}
                  className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition"
                >
                  <Upload className="w-4 h-4 inline mr-2" /> Choose CSV file
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Or paste CSV content:</label>
                <textarea
                  rows={6}
                  value={csvText}
                  onChange={e => setCsvText(e.target.value)}
                  placeholder={SAMPLE_CSV}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setImportOpen(false)} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!csvText.trim() || importing}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition disabled:opacity-50"
                >
                  {importing ? "Importing…" : "Import"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
