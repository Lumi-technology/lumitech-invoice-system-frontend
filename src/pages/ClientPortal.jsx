// ClientPortal.jsx — public, no auth required
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  Wallet,
} from "lucide-react";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8081"
    : "https://ledgerapi.lumitechsystems.com");

function ClientPortal() {
  const { token } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/public/clients/${token}/invoices`)
      .then((res) => {
        const data = res.data;
        setSummary({
          clientName: data.clientName,
          totalInvoiced: data.totalInvoiced,
          totalPaid: data.totalPaid,
          totalOutstanding: data.totalOutstanding,
        });
        setInvoices(data.invoices);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  const downloadPdf = async (inv) => {
    try {
      setDownloadingId(inv.id);
      const res = await axios.get(
        `${baseURL}/api/public/clients/${token}/invoices/${inv.id}/pdf`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${inv.invoiceNumber}.pdf`;
      link.click();
    } catch {
      // silent — user can retry
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const getStatusBadge = (status) => {
    const config = {
      PAID: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
      PENDING: { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
      OVERDUE: { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
      PARTIALLY_PAID: { bg: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
    };
    const key = status?.toUpperCase() || "PENDING";
    const { bg, icon: Icon } = config[key] || config.PENDING;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bg}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4" />
          <p className="text-slate-500">Loading your invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <div className="p-4 bg-rose-50 rounded-full inline-block mb-4">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Invalid or expired link
          </h2>
          <p className="text-slate-500 text-sm">
            This portal link is no longer valid. Please contact your service provider for a new link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {summary?.clientName} —{" "}
                <span className="text-blue-600">Invoices</span>
              </h1>
              <p className="text-xs text-slate-500">
                View and pay your outstanding invoices
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Invoiced */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Invoiced</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(summary.totalInvoiced)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Total Paid */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Paid</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(summary.totalPaid)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Outstanding Balance */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Outstanding Balance</p>
                  <p className={`text-2xl font-bold mt-1 ${summary.totalOutstanding > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    {formatCurrency(summary.totalOutstanding)}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl shadow-sm ${summary.totalOutstanding > 0 ? "bg-gradient-to-br from-rose-500 to-pink-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"}`}>
                  <Wallet className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {invoices.length === 0 ? (
            <div className="p-16 text-center">
              <div className="p-4 bg-slate-100 rounded-full inline-block mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice #</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Issue Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance Due</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-medium text-slate-900">
                        #{inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">{formatDate(inv.issueDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">{formatDate(inv.dueDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(inv.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">{formatCurrency(inv.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-semibold ${inv.balanceDue > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                          {formatCurrency(inv.balanceDue)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inv.balanceDue > 0 && inv.paystackPaymentUrl && (
                            <a
                              href={inv.paystackPaymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Pay Now
                            </a>
                          )}
                          <button
                            onClick={() => downloadPdf(inv)}
                            disabled={downloadingId === inv.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {downloadingId === inv.id ? "..." : "PDF"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ClientPortal;
