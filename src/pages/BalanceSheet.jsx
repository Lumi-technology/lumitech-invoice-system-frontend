// BalanceSheet.jsx — Accounting > Reports > Balance Sheet
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { LayoutList, CheckCircle, AlertTriangle, RefreshCw, Download } from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n ?? 0);

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
};

const today = () => new Date().toISOString().slice(0, 10);

function SectionTable({ rows, extraRows, total, totalLabel, headerColor, totalColor }) {
  const allEmpty = (!rows || rows.length === 0) && (!extraRows || extraRows.length === 0);
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className={`border-b border-slate-100 dark:border-slate-700 ${headerColor}`}>
          <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Code</th>
          <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Name</th>
          <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
        {allEmpty ? (
          <tr>
            <td colSpan={3} className="px-6 py-6 text-center text-sm text-slate-400">No accounts for this period.</td>
          </tr>
        ) : (
          <>
            {(rows ?? []).map((row) => (
              <tr key={row.accountId} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                <td className="px-6 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{row.code}</td>
                <td className="px-6 py-3 text-slate-800 dark:text-slate-100 font-medium">{row.name}</td>
                <td className="px-6 py-3 text-right font-medium text-slate-700 dark:text-slate-200">{fmt(row.amount)}</td>
              </tr>
            ))}
            {(extraRows ?? []).map((row, i) => (
              <tr key={`extra-${i}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                <td className="px-6 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{row.code ?? "—"}</td>
                <td className="px-6 py-3 text-slate-800 dark:text-slate-100 font-medium italic">{row.name}</td>
                <td className="px-6 py-3 text-right font-medium text-slate-700 dark:text-slate-200">{fmt(row.amount)}</td>
              </tr>
            ))}
          </>
        )}
      </tbody>
      <tfoot>
        <tr className={`border-t border-slate-200 dark:border-slate-600 ${totalColor}`}>
          <td colSpan={2} className="px-6 py-3 text-xs font-bold uppercase tracking-wide">{totalLabel}</td>
          <td className="px-6 py-3 text-right text-sm font-bold">{fmt(total)}</td>
        </tr>
      </tfoot>
    </table>
  );
}

function BalanceSheet() {
  const [asOf, setAsOf] = useState(today());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(null);

  const exportReport = async (format) => {
    setDownloading(format);
    try {
      const res = await api.get(`/api/accounting/reports/balance-sheet/export?format=${format}&asOf=${asOf}`, { responseType: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(res.data);
      link.download = `balance-sheet.${format}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setDownloading(null);
    }
  };

  const fetchReport = useCallback((date) => {
    setLoading(true);
    setError("");
    api.get(`/api/accounting/reports/balance-sheet?asOf=${date}`)
      .then(res => setData(res.data))
      .catch(() => setError("Failed to load report. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchReport(asOf); }, []);

  const handleDateChange = (e) => {
    setAsOf(e.target.value);
    fetchReport(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutList className="w-6 h-6 text-blue-600" />
            Balance Sheet
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
            onClick={() => fetchReport(asOf)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* As-of date picker */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="sm:w-64">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">As of Date</label>
            <input
              type="date"
              value={asOf}
              onChange={handleDateChange}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 pb-2.5">Report updates automatically when you change the date.</p>
        </div>
      </div>

      {/* Balance status */}
      {data && (
        data.balanced ? (
          <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Balanced — Total Assets equals Total Liabilities + Equity.</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-5 py-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-rose-700 dark:text-rose-300">Out of Balance — Assets do not equal Liabilities + Equity.</span>
          </div>
        )
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span className="text-sm text-rose-700 dark:text-rose-300">{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600" />
        </div>
      )}

      {/* Report sections */}
      {!loading && data && (
        <>
          {/* Assets */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-emerald-50/60 dark:bg-emerald-900/10">
              <h2 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Assets</h2>
            </div>
            <SectionTable
              rows={data.assetRows}
              total={data.totalAssets}
              totalLabel="Total Assets"
              headerColor="bg-slate-50/60 dark:bg-slate-800/60"
              totalColor="bg-emerald-50/60 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300"
            />
          </div>

          {/* Liabilities */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-rose-50/60 dark:bg-rose-900/10">
              <h2 className="text-sm font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide">Liabilities</h2>
            </div>
            <SectionTable
              rows={data.liabilityRows}
              total={data.totalLiabilities}
              totalLabel="Total Liabilities"
              headerColor="bg-slate-50/60 dark:bg-slate-800/60"
              totalColor="bg-rose-50/60 dark:bg-rose-900/10 text-rose-700 dark:text-rose-300"
            />
          </div>

          {/* Equity */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-purple-50/60 dark:bg-purple-900/10">
              <h2 className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Equity</h2>
            </div>
            <SectionTable
              rows={data.equityRows}
              extraRows={data.retainedEarnings != null ? [{ name: "Retained Earnings", amount: data.retainedEarnings }] : []}
              total={data.totalEquity}
              totalLabel="Total Equity"
              headerColor="bg-slate-50/60 dark:bg-slate-800/60"
              totalColor="bg-purple-50/60 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300"
            />
          </div>

          {/* Summary */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Summary</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-slate-600 dark:text-slate-300">Total Assets</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmt(data.totalAssets)}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-slate-600 dark:text-slate-300">Total Liabilities + Equity</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{fmt(data.totalLiabilitiesAndEquity)}</span>
              </div>
              <div className={`flex items-center justify-between px-6 py-5 ${data.balanced ? "bg-emerald-50/60 dark:bg-emerald-900/10" : "bg-rose-50/60 dark:bg-rose-900/10"}`}>
                <div className="flex items-center gap-2">
                  {data.balanced
                    ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    : <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                  <span className={`text-sm font-bold ${data.balanced ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
                    {data.balanced ? "Balanced" : "Out of Balance"}
                  </span>
                </div>
                {!data.balanced && (
                  <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                    Difference: {fmt(Math.abs(data.totalAssets - data.totalLiabilitiesAndEquity))}
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BalanceSheet;
