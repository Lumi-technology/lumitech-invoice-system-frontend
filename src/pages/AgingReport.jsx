// AgingReport.jsx — Invoices > Reports > Aging Report
import { useEffect, useState } from "react";
import api from "../services/api";
import { ClipboardList, ChevronDown, ChevronRight, AlertTriangle, RefreshCw } from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n ?? 0);

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
};

const BUCKETS = [
  {
    key: "current",
    label: "Current",
    sub: "Not yet due",
    header: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
    badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  {
    key: "1_30",
    label: "1 – 30 Days",
    sub: "Slightly overdue",
    header: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
    badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  {
    key: "31_60",
    label: "31 – 60 Days",
    sub: "Overdue",
    header: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300",
    badge: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  {
    key: "61_90",
    label: "61 – 90 Days",
    sub: "Seriously overdue",
    header: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300",
    badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  {
    key: "over_90",
    label: "90+ Days",
    sub: "Critical",
    header: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300",
    badge: "bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300",
    dot: "bg-red-700",
  },
];

function BucketSection({ bucket, rows }) {
  const [open, setOpen] = useState(true);
  const total = rows.reduce((s, r) => s + (r.balanceDue ?? 0), 0);
  const hasRows = rows.length > 0;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Bucket header */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-6 py-4 border-b transition ${bucket.header}`}
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <div className={`w-2.5 h-2.5 rounded-full ${bucket.dot}`} />
          <div className="text-left">
            <span className="font-bold text-sm">{bucket.label}</span>
            <span className="ml-2 text-xs opacity-70">{bucket.sub}</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bucket.badge}`}>
            {rows.length} invoice{rows.length !== 1 ? "s" : ""}
          </span>
        </div>
        <span className="text-sm font-bold">{fmt(total)}</span>
      </button>

      {open && (
        !hasRows ? (
          <div className="px-6 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
            No invoices in this bracket.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoice #</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due Date</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Days Overdue</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {rows.map((row) => (
                  <tr key={row.invoiceId ?? row.invoiceNumber} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      {row.invoiceNumber}
                    </td>
                    <td className="px-6 py-3 text-slate-800 dark:text-slate-100 font-medium">{row.clientName ?? "—"}</td>
                    <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{fmtDate(row.dueDate)}</td>
                    <td className="px-6 py-3 text-center">
                      {row.daysOverdue > 0 ? (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${bucket.badge}`}>
                          {row.daysOverdue}d
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Current</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-slate-800 dark:text-slate-100">
                      {fmt(row.balanceDue)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30">
                  <td colSpan={4} className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {bucket.label} Subtotal
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-bold text-slate-800 dark:text-slate-100">
                    {fmt(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )
      )}
    </div>
  );
}

function AgingReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = () => {
    setLoading(true);
    setError("");
    api.get("/api/invoices/reports/aging")
      .then(res => setData(res.data))
      .catch(() => setError("Failed to load aging report. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReport(); }, []);

  const grandTotal = data
    ? BUCKETS.reduce((sum, b) => sum + (data[b.key] ?? []).reduce((s, r) => s + (r.balanceDue ?? 0), 0), 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            Aging Report
          </h1>
          {data?.asOf && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              As of{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {fmtDate(data.asOf)}
              </span>
            </p>
          )}
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary strip */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {BUCKETS.map(b => {
            const rows = data[b.key] ?? [];
            const total = rows.reduce((s, r) => s + (r.balanceDue ?? 0), 0);
            return (
              <div key={b.key} className={`rounded-xl px-4 py-3 border ${b.header}`}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">{b.label}</p>
                <p className="text-base font-bold">{fmt(total)}</p>
                <p className="text-xs opacity-60 mt-0.5">{rows.length} invoice{rows.length !== 1 ? "s" : ""}</p>
              </div>
            );
          })}
        </div>
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

      {/* Bucket sections */}
      {!loading && data && (
        <div className="space-y-4">
          {BUCKETS.map(b => (
            <BucketSection
              key={b.key}
              bucket={b}
              rows={data[b.key] ?? []}
            />
          ))}

          {/* Grand Total */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-700 overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between">
              <span className="text-sm font-bold text-white uppercase tracking-wide">Grand Total — All Outstanding</span>
              <span className="text-2xl font-extrabold text-white">{fmt(grandTotal)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgingReport;
