import { useState, useEffect } from "react";
import api from "../services/api";
import { Calculator, Download, RefreshCw, TrendingUp, TrendingDown, FileText, AlertCircle } from "lucide-react";

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 }).format(val || 0);

const formatDate = (str) =>
  str ? new Date(str).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const WHT_LABELS = {
  CONSULTING: "Consulting / Professional",
  RENT: "Rent",
  DIVIDEND: "Dividend",
  INTEREST: "Interest",
  ROYALTY: "Royalty",
  CONTRACT: "Contract / Supply",
  OTHER: "Other",
  UNSPECIFIED: "Unspecified",
};

function currentQuarter() {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3);
  const year = now.getFullYear();
  const starts = ["01-01", "04-01", "07-01", "10-01"];
  const ends   = ["03-31", "06-30", "09-30", "12-31"];
  return {
    from: `${year}-${starts[q]}`,
    to:   `${year}-${ends[q]}`,
  };
}

export default function TaxReport() {
  const { from: defaultFrom, to: defaultTo } = currentQuarter();
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    if (!from || !to) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/invoices/reports/tax", { params: { from, to } });
      setReport(res.data);
    } catch (e) {
      setError("Failed to load tax report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  const handleExport = () => {
    if (!report) return;
    const escape = (v) => {
      const s = v == null ? "" : String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = [
      ["Invoice No", "Client", "Issue Date", "Subtotal (NGN)", "VAT (NGN)", "WHT (NGN)", "WHT Type", "Total (NGN)"],
      ...report.invoices.map(inv => [
        inv.invoiceNumber,
        inv.clientName,
        inv.issueDate,
        inv.subtotal ?? 0,
        inv.vatAmount ?? 0,
        inv.whtAmount ?? 0,
        inv.whtType ?? "",
        inv.total ?? 0,
      ]),
      [],
      ["", "", "TOTALS", "", report.totalVatPayable ?? 0, report.totalWhtWithheld ?? 0, "", ""],
    ];
    const csv = rows.map(r => r.map(escape).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `tax-report-${from}-to-${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            Tax Report
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">VAT payable and WHT receivable — FIRS compliance</p>
        </div>
        <button
          onClick={handleExport}
          disabled={!report}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export for FIRS (CSV)
        </button>
      </div>

      {/* Date range filter */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">From</label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">To</label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
          <button
            onClick={fetchReport}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading…" : "Run Report"}
          </button>

          {/* Quick periods */}
          <div className="flex flex-wrap gap-2 ml-auto">
            {[
              { label: "Q1", from: `${new Date().getFullYear()}-01-01`, to: `${new Date().getFullYear()}-03-31` },
              { label: "Q2", from: `${new Date().getFullYear()}-04-01`, to: `${new Date().getFullYear()}-06-30` },
              { label: "Q3", from: `${new Date().getFullYear()}-07-01`, to: `${new Date().getFullYear()}-09-30` },
              { label: "Q4", from: `${new Date().getFullYear()}-10-01`, to: `${new Date().getFullYear()}-12-31` },
            ].map(p => (
              <button
                key={p.label}
                onClick={() => { setFrom(p.from); setTo(p.to); }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {report && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(report.totalSubtotal)}</p>
              <p className="text-xs text-slate-400 mt-1">{report.invoiceCount} invoice{report.invoiceCount !== 1 ? "s" : ""}</p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700/40 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">VAT Payable</p>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(report.totalVatPayable)}</p>
              <p className="text-xs text-emerald-600/70 mt-1">Remit to FIRS</p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-700/40 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">WHT Withheld</p>
                <TrendingDown className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{formatCurrency(report.totalWhtWithheld)}</p>
              <p className="text-xs text-amber-600/70 mt-1">Receivable credit</p>
            </div>
          </div>

          {/* WHT breakdown by type */}
          {report.whtByType && Object.keys(report.whtByType).length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">WHT by Transaction Type</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {Object.entries(report.whtByType).map(([type, amount]) => (
                  <div key={type} className="flex items-center justify-between px-6 py-3">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{WHT_LABELS[type] || type}</span>
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoice table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Invoice Breakdown</h2>
              <span className="ml-auto text-xs text-slate-400">{report.invoiceCount} records</span>
            </div>

            {report.invoices.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No invoices found for this period.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left">Invoice #</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                      <th className="px-4 py-3 text-right">VAT</th>
                      <th className="px-4 py-3 text-right">WHT</th>
                      <th className="px-4 py-3 text-left">WHT Type</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {report.invoices.map((inv) => (
                      <tr key={inv.invoiceNumber} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                        <td className="px-6 py-3 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">
                          {inv.invoiceNumber}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{inv.clientName}</td>
                        <td className="px-4 py-3 text-slate-500">{formatDate(inv.issueDate)}</td>
                        <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">{formatCurrency(inv.subtotal)}</td>
                        <td className="px-4 py-3 text-right">
                          {inv.vatAmount > 0
                            ? <span className="text-emerald-700 dark:text-emerald-400 font-medium">{formatCurrency(inv.vatAmount)}</span>
                            : <span className="text-slate-300 dark:text-slate-600">—</span>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {inv.whtAmount > 0
                            ? <span className="text-amber-700 dark:text-amber-400 font-medium">{formatCurrency(inv.whtAmount)}</span>
                            : <span className="text-slate-300 dark:text-slate-600">—</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {inv.whtType ? (WHT_LABELS[inv.whtType] || inv.whtType) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(inv.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 dark:bg-slate-700/40 font-semibold text-sm border-t-2 border-slate-200 dark:border-slate-600">
                      <td colSpan={3} className="px-6 py-3 text-slate-500">Totals</td>
                      <td className="px-4 py-3 text-right text-slate-900 dark:text-white">{formatCurrency(report.totalSubtotal)}</td>
                      <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400">{formatCurrency(report.totalVatPayable)}</td>
                      <td className="px-4 py-3 text-right text-amber-700 dark:text-amber-400">{formatCurrency(report.totalWhtWithheld)}</td>
                      <td />
                      <td className="px-4 py-3 text-right text-slate-900 dark:text-white">
                        {formatCurrency((report.totalSubtotal || 0) + (report.totalVatPayable || 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
