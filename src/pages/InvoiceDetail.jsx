// InvoiceDetail.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { getUserFromToken } from "../services/api";
import {
  ArrowLeft,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  FileText,
  DollarSign,
  CreditCard,
  Wallet,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Plus,
} from "lucide-react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("TRANSFER");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Send reminder state
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  // Paystack online payment state
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const pollRef = useRef(null);
  const pollCountRef = useRef(0);

  const user = getUserFromToken();
  const isAdmin =
    user &&
    (user.role === "ADMIN" ||
      user.role === "SUPER_ADMIN" ||
      user.role === "PLATFORM_ADMIN" ||
      (Array.isArray(user.roles) &&
        (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN") || user.roles.includes("PLATFORM_ADMIN"))));

  // Edit invoice state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItems, setEditItems] = useState([]);
  const [editTax, setEditTax] = useState(0);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Fetch invoice
  const fetchInvoice = useCallback(async () => {
    try {
      const res = await api.get(`api/invoices/${id}`);
      setInvoice(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  // Stop polling when invoice becomes PAID or on unmount
  useEffect(() => {
    if (invoice?.status === "PAID" && isPolling) {
      clearInterval(pollRef.current);
      setIsPolling(false);
    }
  }, [invoice?.status, isPolling]);

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);

  // Open edit modal pre-filled with current invoice data
  const openEditModal = () => {
    setEditItems(invoice.items?.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })) || []);
    setEditTax(invoice.tax || 0);
    setShowEditModal(true);
  };

  const handleEditItemChange = (index, field, value) => {
    const updated = [...editItems];
    updated[index][field] = value;
    setEditItems(updated);
  };

  const handleSaveEdit = async () => {
    try {
      setIsSavingEdit(true);
      await api.put(`/api/invoices/${id}/prices`, { tax: Number(editTax), items: editItems });
      await fetchInvoice();
      setShowEditModal(false);
      setToast({ visible: true, message: "Invoice updated successfully", type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update invoice.";
      setToast({ visible: true, message: msg, type: "error" });
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Send reminder handler
  const handleSendReminder = async () => {
    try {
      setIsSendingReminder(true);
      await api.post(`/api/invoices/${id}/remind`);
      setToast({ visible: true, message: "Reminder sent to client", type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send reminder.";
      setToast({ visible: true, message: msg, type: "error" });
    } finally {
      setIsSendingReminder(false);
    }
  };

  // Paystack Pay Now handler
  const handlePayNow = async () => {
    try {
      setIsPayingOnline(true);
      const res = await api.get(`/api/invoices/${id}/pay`);
      window.open(res.data.paymentUrl, "_blank");
      // Start polling every 5s for up to 30s
      pollCountRef.current = 0;
      setIsPolling(true);
      pollRef.current = setInterval(async () => {
        pollCountRef.current += 1;
        await fetchInvoice();
        if (pollCountRef.current >= 6) {
          clearInterval(pollRef.current);
          setIsPolling(false);
        }
      }, 5000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to initiate payment. Ensure the client has an email address.";
      setToast({ visible: true, message: msg, type: "error" });
    } finally {
      setIsPayingOnline(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);

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

  // Payment handler
  const handlePayment = async () => {
    try {
      setIsSubmittingPayment(true);
      await api.post("/api/finance/payments", {
        invoiceId: id,
        amount: Number(paymentAmount),
        paymentMethod,
      });
      await fetchInvoice();
      setToast({ visible: true, message: "Payment recorded successfully", type: "success" });
      setShowPaymentModal(false);
      setPaymentAmount("");
    } catch (err) {
      console.error(err);
      setToast({ visible: true, message: "Payment failed", type: "error" });
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // PDF download
  const downloadPdf = async () => {
    try {
      setIsDownloading(true);
      const res = await api.get(`api/invoices/${id}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.invoiceNumber}.pdf`;
      link.click();
      setToast({ visible: true, message: "PDF downloaded", type: "success" });
    } catch {
      setToast({ visible: true, message: "Download failed", type: "error" });
    } finally {
      setIsDownloading(false);
    }
  };

  const deleteInvoice = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`api/invoices/${id}`);
      navigate("/invoices");
    } catch {
      setToast({ visible: true, message: "Delete failed", type: "error" });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      PAID: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
      PENDING: { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
      OVERDUE: { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
    };
    const statusKey = status?.toUpperCase() || "PENDING";
    const { bg, icon: Icon } = config[statusKey] || config.PENDING;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${bg}`}>
        <Icon className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4" />
          <p className="text-slate-500">Loading invoice...</p>
        </div>
      </div>
    );
  }

  const totalPaid = invoice.amountPaid || 0;
  const balanceDue = invoice.total - totalPaid;

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchInvoice}
            title="Refresh status"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
          >
            <RefreshCw size={16} className={isPolling ? "animate-spin" : ""} />
            {isPolling ? "Checking..." : "Refresh"}
          </button>
          <button
            onClick={downloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm disabled:opacity-50"
          >
            <Download size={16} />
            {isDownloading ? "Downloading..." : "PDF"}
          </button>
          {invoice.status !== "PAID" && (
            <button
              onClick={handleSendReminder}
              disabled={isSendingReminder}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail size={16} />
              {isSendingReminder ? "Sending..." : "Send Reminder"}
            </button>
          )}
          {invoice.status !== "PAID" && (
            <button
              onClick={handlePayNow}
              disabled={isPayingOnline}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard size={16} />
              {isPayingOnline ? "Opening..." : "Pay Now"}
            </button>
          )}
          {isAdmin && (
            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
            >
              <Edit2 size={16} />
              Edit
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition shadow-sm disabled:opacity-50"
            >
              <Trash2 size={16} />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>

      {/* Main Invoice Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Invoice Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Invoice <span className="text-blue-600">#{invoice.invoiceNumber}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Issued: {formatDate(invoice.issueDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Due: {formatDate(invoice.dueDate)}
                  </span>
                  {invoice.projectName && (
                    <span className="flex items-center gap-1 text-indigo-600 font-medium">
                      <FileText className="w-3.5 h-3.5" />
                      {invoice.projectName}
                    </span>
                  )}
                  {invoice.paystackPaymentUrl && (
                    <a
                      href={invoice.paystackPaymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Pay Online
                    </a>
                  )}
                </div>
              </div>
            </div>
            {getStatusBadge(invoice.status)}
          </div>
        </div>

        {/* Client Info Card */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Client Details
          </h2>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                {invoice.client?.name?.charAt(0) || "C"}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{invoice.client?.name}</p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {invoice.client?.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{invoice.client.email}</span>
                    </div>
                  )}
                  {invoice.client?.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{invoice.client.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Invoice Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 text-left font-medium text-slate-500">Description</th>
                  <th className="py-3 text-left font-medium text-slate-500">Qty</th>
                  <th className="py-3 text-left font-medium text-slate-500">Unit Price</th>
                  <th className="py-3 text-right font-medium text-slate-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items?.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 text-slate-900">{item.description}</td>
                    <td className="py-3 text-slate-700">{item.quantity}</td>
                    <td className="py-3 text-slate-700">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right font-medium text-slate-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals and Payment Section */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
            {/* Payment Summary */}
            <div className="space-y-3 w-full sm:w-72">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900 font-medium">{formatCurrency(invoice.subtotal || invoice.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax</span>
                <span className="text-slate-900 font-medium">{formatCurrency(invoice.tax || 0)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-100 pt-3">
                <span className="text-slate-500">Total</span>
                <span className="text-slate-900 font-semibold">{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Paid</span>
                <span className="text-emerald-600 font-medium">{formatCurrency(totalPaid)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-100 pt-3">
                <span className="text-slate-700 font-medium">Balance Due</span>
                <span className="text-blue-600 font-bold text-lg">{formatCurrency(balanceDue)}</span>
              </div>
            </div>

            {/* Payment Button */}
            {balanceDue > 0 && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setPaymentAmount(balanceDue);
                    setShowPaymentModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:scale-[1.02] transition-all duration-200"
                >
                  <DollarSign size={18} />
                  Record Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Record Payment
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₦</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("TRANSFER")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition ${
                      paymentMethod === "TRANSFER"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <CreditCard size={16} />
                    Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("CASH")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition ${
                      paymentMethod === "CASH"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Wallet size={16} />
                    Cash
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isSubmittingPayment}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                {isSubmittingPayment ? "Processing..." : "Submit Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                Edit Invoice
              </h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-4">
              <div className="hidden sm:grid grid-cols-12 gap-2 px-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-3">Unit Price (₦)</div>
                <div className="col-span-2" />
              </div>
              {editItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={item.description}
                    onChange={e => handleEditItemChange(i, "description", e.target.value)}
                    placeholder="Description"
                    className="col-span-5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => handleEditItemChange(i, "quantity", Number(e.target.value))}
                    className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₦</span>
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={e => handleEditItemChange(i, "unitPrice", Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditItems(editItems.filter((_, idx) => idx !== i))}
                      disabled={editItems.length === 1}
                      className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setEditItems([...editItems, { description: "", quantity: 1, unitPrice: 0 }])}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
              >
                <Plus size={15} /> Add Item
              </button>
            </div>

            {/* Tax */}
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mb-6">
              <label className="text-sm font-medium text-slate-700 w-16">Tax (₦)</label>
              <div className="relative w-44">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₦</span>
                <input
                  type="number"
                  min="0"
                  value={editTax}
                  onChange={e => setEditTax(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                <Save size={15} />
                {isSavingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />

      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        onConfirm={deleteInvoice}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </div>
  );
}

export default InvoiceDetail;