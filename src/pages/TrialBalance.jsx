// TrialBalance.jsx — Accounting > Reports > Trial Balance
import { useEffect, useState } from "react";
import api from "../services/api";
import { Scale, CheckCircle, AlertTriangle, RefreshCw, Download, Info } from "lucide-react";

const ACCOUNT_TYPES = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];

const TYPE_STYLE = {
  ASSET:     "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  LIABILITY: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
  EQUITY:    "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  INCOME:    "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  EXPENSE:   "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
};

const fmt = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n ?? 0);

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
};

function TrialBalance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null);

  const exportReport = async (format) => {
    setDownloading(format);
    try {
      const res = await api.get(`/api/accounting/reports/trial-balance/export?format=${format}`, { responseType: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(res.data);
      link.download = `trial-balance.${format}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setDownloading(null);
    }
  };

  const fetchReport = () => {
    setLoading(true);
    setError("");
    api.get("/api/accounting/reports/trial-balance")
      .then(res => setData(res.data))
      .catch(() => setError("Failed to load trial balance. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReport(); }, []);

  const grouped = data
    ? ACCOUNT_TYPES.reduce((acc, t) => {
        acc[t] = (data.rows ?? []).filter(r => r.type === t);
        return acc;
      }, {})
    : {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-blue-600" />
            Trial Balance
          </h1>
          {data?.asOf && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              As of <span className="font-medium text-slate-700 dark:text-slate-300">{fmtDate(data.asOf)}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReport("pdf")}
            disabled={!data || downloading !== null}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm disabled:opacity-50"
          >
            {downloading === "pdf"
              ? <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              : <Download size={14} />}
            PDF
          </button>
          <button
            onClick={() => exportReport("csv")}
            disabled={!data || downloading !== null}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm disabled:opacity-50"
          >
            {downloading === "csv"
              ? <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              : <Download size={14} />}
            CSV
          </button>
          <button
            onClick={fetchReport}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/60 rounded-xl">
        <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          The trial balance lists all account balances. Total debits must equal total credits — if they don't, there is an error in your journal entries.
        </p>
      </div>

      {/* Balance status banner */}
      {data && (
        data.balanced
          ? (
            <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Balanced — debits equal credits.</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-5 py-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-rose-700 dark:text-rose-300">Warning: Trial balance is out of balance.</span>
            </div>
          )
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span className="text-sm text-rose-700 dark:text-rose-300">{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600" />
          </div>
        ) : !data ? null : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70">
                  <th className="text-left px-3 sm:px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Code</th>
                  <th className="text-left px-3 sm:px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Name</th>
                  <th className="text-left px-3 sm:px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="text-right px-3 sm:px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Debit</th>
                  <th className="text-right px-3 sm:px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Credit</th>
                  <th className="text-right px-3 sm:px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody>
                {ACCOUNT_TYPES.map(type => {
                  const rows = grouped[type] ?? [];
                  if (rows.length === 0) return null;
                  const groupDebit  = rows.reduce((s, r) => s + (r.totalDebits  ?? 0), 0);
                  const groupCredit = rows.reduce((s, r) => s + (r.totalCredits ?? 0), 0);
                  const groupBal    = rows.reduce((s, r) => s + (r.balance ?? 0), 0);

                  return [
                    /* Section header */
                    <tr key={`hdr-${type}`} className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-700/30">
                      <td colSpan={6} className="px-6 py-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${TYPE_STYLE[type]}`}>
                          {type}
                        </span>
                      </td>
                    </tr>,

                    /* Data rows */
                    ...rows.map(row => (
                      <tr key={row.accountId} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                        <td className="px-3 sm:px-6 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell">{row.code}</td>
                        <td className="px-3 sm:px-6 py-3 font-medium text-slate-800 dark:text-slate-100">{row.name}</td>
                        <td className="px-3 sm:px-6 py-3 hidden sm:table-cell">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${TYPE_STYLE[row.type]}`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 text-right text-slate-700 dark:text-slate-200 whitespace-nowrap">{row.totalDebits > 0 ? fmt(row.totalDebits) : "—"}</td>
                        <td className="px-3 sm:px-6 py-3 text-right text-slate-700 dark:text-slate-200 whitespace-nowrap hidden sm:table-cell">{row.totalCredits > 0 ? fmt(row.totalCredits) : "—"}</td>
                        <td className={`px-3 sm:px-6 py-3 text-right font-semibold whitespace-nowrap ${row.balance >= 0 ? "text-slate-900 dark:text-white" : "text-rose-600 dark:text-rose-400"}`}>
                          {fmt(row.balance)}
                        </td>
                      </tr>
                    )),

                    /* Group subtotal */
                    <tr key={`sub-${type}`} className="border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/20">
                      <td colSpan={3} className="px-6 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        {type} Subtotal
                      </td>
                      <td className="px-6 py-2.5 text-right text-xs font-semibold text-slate-700 dark:text-slate-200">{fmt(groupDebit)}</td>
                      <td className="px-6 py-2.5 text-right text-xs font-semibold text-slate-700 dark:text-slate-200">{fmt(groupCredit)}</td>
                      <td className="px-6 py-2.5 text-right text-xs font-semibold text-slate-700 dark:text-slate-200">{fmt(groupBal)}</td>
                    </tr>,
                  ];
                })}
              </tbody>

              {/* Grand Total Footer */}
              <tfoot>
                <tr className="border-t-2 border-slate-300 dark:border-slate-500 bg-slate-100/80 dark:bg-slate-700/50">
                  <td colSpan={3} className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    Grand Total
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">
                    {fmt(data.grandTotalDebits)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">
                    {fmt(data.grandTotalCredits)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {data.balanced ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle size={11} />Balanced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                        <AlertTriangle size={11} />Off
                      </span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrialBalance;
