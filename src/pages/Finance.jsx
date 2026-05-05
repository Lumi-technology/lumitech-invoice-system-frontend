// Finance.jsx — Collections (business owner) / Payments (accountant)
import { useState, useEffect } from "react";
import api from "../services/api";
import { Download, Banknote, CheckCircle, Clock, AlertCircle, ArrowUpRight } from "lucide-react";
import Toast from "../components/Toast";
import { getUserType, USER_TYPES, paymentLabel } from "../utils/userType";
import { useOrg } from "../context/OrgContext";

const fmtDate = (s) => {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
};

const METHOD_LABELS = { TRANSFER: "Transfer", CASH: "Cash", POS: "POS" };

const exportCsv = async (endpoint, filename) => {
  const res = await api.get(endpoint, { responseType: "blob" });
  const url = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

function Finance() {
  const { fmt } = useOrg();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [userType, setUserTypeState] = useState(getUserType());

  const isBusinessOwner = userType === USER_TYPES.BUSINESS_OWNER;

  useEffect(() => {
    const handler = () => setUserTypeState(getUserType());
    window.addEventListener("userTypeChange", handler);
    return () => window.removeEventListener("userTypeChange", handler);
  }, []);

  useEffect(() => {
    api.get("/api/finance/payments/list")
      .then(res => setPayments(res.data || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportCsv("/api/export/payments", isBusinessOwner ? "collections.csv" : "payments.csv");
      setToast({ visible: true, message: "Exported successfully", type: "success" });
    } catch {
      setToast({ visible: true, message: "Export failed. Please try again.", type: "error" });
    } finally {
      setExporting(false);
    }
  };

  const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Banknote className="w-6 h-6 text-emerald-600" />
            {paymentLabel("module")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isBusinessOwner
              ? "Money collected from your customers — linked to invoices."
              : "All payments received from clients, linked to invoices."}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <ArrowUpRight className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs text-emerald-600 font-medium mb-0.5">
            {isBusinessOwner ? "Total Collected" : "Total Received"}
          </p>
          <p className="text-2xl font-bold text-emerald-700">{fmt(totalReceived)}</p>
        </div>
        <p className="ml-auto text-xs text-emerald-600">{payments.length} record{payments.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Payments table */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-7 w-7 border-3 border-slate-200 border-t-blue-600" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
              <Banknote className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              No {isBusinessOwner ? "collections" : "payments"} yet
            </p>
            <p className="text-xs text-slate-400">
              {isBusinessOwner
                ? "Record a collection from an invoice to see it here."
                : "Payments recorded against invoices will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-700/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Method</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {payments.map((p, i) => (
                  <tr key={p.id ?? i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition">
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{fmtDate(p.paymentDate)}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {p.invoiceNumber || p.invoiceId || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{p.clientName || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {METHOD_LABELS[p.paymentMethod] || p.paymentMethod || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">{fmt(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}

export default Finance;
