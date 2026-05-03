import { useState, useCallback } from "react";
import api from "../services/api";
import {
  FileText, TrendingUp, TrendingDown, RefreshCw, Calendar,
} from "lucide-react";
import Toast from "../components/Toast";

const fmtCurrency = (v, currency) =>
  (v || 0).toLocaleString("en-KE", { style: "currency", currency: currency || "KES" });

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (d) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

const TYPE_CFG = {
  INVOICE:   { label: "Invoice",   cls: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
  BILL:      { label: "Bill",      cls: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" },
  RECURRING: { label: "Recurring", cls: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400" },
};

const dateCls =
  "px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";

export default function CashFlowForecast() {
  const [fromDate, setFromDate] = useState(today());
  const [toDate, setToDate] = useState(inDays(30));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const notify = (message, type = "success") =>
    setToast({ visible: true, message, type });

  const loadForecast = useCallback(async () => {
    if (!fromDate || !toDate) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/api/accounting/reports/cash-flow-forecast?from=${fromDate}&to=${toDate}`
      );
      setReport(res.data);
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load cash flow forecast", "error");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  const sortedItems = report
    ? [...(report.items || [])].sort((a, b) =>
        (a.expectedDate || "").localeCompare(b.expectedDate || "")
      )
    : [];

  const netPositive = report ? (report.expectedNet || 0) >= 0 : true;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Cash Flow Forecast
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            View expected inflows and outflows over a selected date range
          </p>
        </div>

        {/* Date controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-slate-400 flex-shrink-0" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={dateCls}
            />
          </div>
          <span className="text-slate-400 text-sm">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={dateCls}
          />
          <button
            onClick={loadForecast}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Forecast
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Expected Inflow */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">Expected Inflow</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 truncate">
                  {fmtCurrency(report.expectedInflow, "KES")}
                </p>
              </div>
            </div>
          </div>

          {/* Expected Outflow */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
                <TrendingDown size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">Expected Outflow</p>
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400 truncate">
                  {fmtCurrency(report.expectedOutflow, "KES")}
                </p>
              </div>
            </div>
          </div>

          {/* Net Cash Position */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  netPositive
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                }`}
              >
                {netPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">Net Cash Position</p>
                <p
                  className={`text-lg font-bold truncate ${
                    netPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {fmtCurrency(report.expectedNet, "KES")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Table header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Forecast Items
          </h2>
          {report && (
            <span className="text-xs text-slate-400">
              {sortedItems.length} item{sortedItems.length !== 1 ? "s" : ""}
              {" · "}
              {report.forecastFrom} to {report.forecastTo}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-slate-400">
            <RefreshCw size={18} className="animate-spin" /> Loading forecast…
          </div>
        ) : !report ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Calendar size={40} className="opacity-30" />
            <p className="text-sm">
              Select a date range and click Forecast to view cash flow projections
            </p>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <FileText size={40} className="opacity-30" />
            <p className="text-sm">No forecast items for the selected period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-left text-xs text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Currency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {sortedItems.map((item, i) => {
                  const tc = TYPE_CFG[item.type] ?? {
                    label: item.type,
                    cls: "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
                  };
                  return (
                    <tr
                      key={i}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition"
                    >
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {item.expectedDate}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.cls}`}
                        >
                          {tc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        {item.reference || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {item.description || "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {(item.amount || 0).toLocaleString("en-KE", {
                          style: "currency",
                          currency: item.currency || "KES",
                        })}
                      </td>
                      <td className="px-5 py-3 text-right text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {item.currency || "KES"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
}
