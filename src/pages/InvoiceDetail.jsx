// InvoiceDetail.jsx
import { useEffect, useState, useCallback } from "react";
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
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  DollarSign
} from "lucide-react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [editingItems, setEditingItems] = useState([]);
  const [isSavingPrices, setIsSavingPrices] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const user = getUserFromToken();
  const isAdmin = user && (user.role === "ADMIN" || (Array.isArray(user.roles) && user.roles.includes("ADMIN")));

  // ✅ Fetch Invoice
  const fetchInvoice = useCallback(async () => {
    try {
      const res = await api.get(`api/invoices/${id}`);
      setInvoice(res.data);
    } catch (err) {
      console.error("FETCH INVOICE ERROR:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  // ✅ Currency Formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // ✅ Mark Invoice as Paid
  const markAsPaid = async () => {
    try {
      setIsPaying(true);
      await api.put(`api/invoices/${id}/mark-paid`);
      await fetchInvoice();
      setToast({ visible: true, message: 'Invoice marked as paid', type: 'success' });
    } catch (err) {
      console.error("MARK AS PAID ERROR:", err);
      setToast({ visible: true, message: 'Failed to mark as paid', type: 'error' });
    } finally {
      setIsPaying(false);
    }
  };

  // ✅ Secure PDF Download (JWT Included)
  const downloadPdf = async () => {
    try {
      setIsDownloading(true);

      const response = await api.get(`api/invoices/${id}/pdf`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `invoice-${invoice.invoiceNumber}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      setToast({ visible: true, message: 'PDF downloaded', type: 'success' });
    } catch (error) {
      console.error("PDF DOWNLOAD ERROR:", error);
      setToast({ visible: true, message: 'Failed to download PDF', type: 'error' });
    } finally {
      setIsDownloading(false);
    }
  };

  // ✅ Delete Invoice (admin only)
  const deleteInvoice = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`api/invoices/${id}`);
      setToast({ visible: true, message: 'Invoice deleted', type: 'success' });
      navigate(`/`);
    } catch (err) {
      console.error("DELETE INVOICE ERROR:", err);
      setToast({ visible: true, message: 'Failed to delete invoice', type: 'error' });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // ✅ Edit Prices (admin only)
  const startEditPrices = () => {
    if (!isAdmin) {
      setToast({ visible: true, message: 'You do not have permission to edit prices', type: 'error' });
      return;
    }
    setEditingItems(invoice.items?.map(item => ({ ...item })) || []);
    setIsEditingPrices(true);
  };

  const cancelEditPrices = () => {
    setEditingItems([]);
    setIsEditingPrices(false);
  };

  const handlePriceChange = (index, field, value) => {
    setEditingItems(prev => {
      const copy = prev.map(it => ({ ...it }));
      if (!copy[index]) return prev;
      if (field === 'unitPrice' || field === 'quantity') {
        copy[index][field] = value === '' ? '' : Number(value);
      } else {
        copy[index][field] = value;
      }
      return copy;
    });
  };

  const savePrices = async () => {
    if (!isAdmin) return alert('Unauthorized');
    if (!Array.isArray(editingItems) || editingItems.length === 0) {
      setToast({ visible: true, message: 'No items to save', type: 'error' });
      return;
    }

    // Basic validation
    for (let i = 0; i < editingItems.length; i++) {
      const it = editingItems[i];
      if (typeof it.unitPrice !== 'number' || isNaN(it.unitPrice) || it.unitPrice < 0) {
        setToast({ visible: true, message: `Invalid unit price for item ${i + 1}`, type: 'error' });
        return;
      }
      if (typeof it.quantity !== 'number' || isNaN(it.quantity) || it.quantity < 0) {
        setToast({ visible: true, message: `Invalid quantity for item ${i + 1}`, type: 'error' });
        return;
      }
    }

    try {
      setIsSavingPrices(true);

      await api.put(`api/invoices/${id}/prices`, { items: editingItems });

      await fetchInvoice();
      setIsEditingPrices(false);
      setEditingItems([]);
      setToast({ visible: true, message: 'Prices updated', type: 'success' });
    } catch (err) {
      console.error('SAVE PRICES ERROR:', err);
      setToast({ visible: true, message: 'Failed to save prices', type: 'error' });
    } finally {
      setIsSavingPrices(false);
    }
  };

  // Status badge with icon
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4" />
          <p className="text-slate-500">Loading invoice...</p>
        </div>
      </div>
    );
  }

  const totalItems = invoice.items?.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  ) || 0;

  const grandTotal = totalItems + (invoice.tax || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header with back button and actions */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Invoices</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadPdf}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm disabled:opacity-50"
              >
                <Download size={16} />
                {isDownloading ? "Downloading..." : "PDF"}
              </button>
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
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Issued: {invoice.issueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {invoice.dueDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(invoice.status)}
                {invoice.status !== "PAID" && (
                  <button
                    onClick={markAsPaid}
                    disabled={isPaying}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm disabled:opacity-50 text-sm"
                  >
                    <CheckCircle size={16} />
                    {isPaying ? "Updating..." : "Mark Paid"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Client Info Card */}
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Client Details</h2>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                  {invoice.client?.name?.charAt(0) || 'C'}
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
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Invoice Items</h2>
              {isAdmin && !isEditingPrices && (
                <button
                  onClick={startEditPrices}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition shadow-sm"
                >
                  <Edit2 size={14} />
                  Edit Prices
                </button>
              )}
              {isAdmin && isEditingPrices && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={savePrices}
                    disabled={isSavingPrices}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    <Save size={14} />
                    {isSavingPrices ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEditPrices}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

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
                  {(isEditingPrices ? editingItems : invoice.items)?.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 text-slate-900">{item.description}</td>
                      <td className="py-3">
                        {isEditingPrices ? (
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.quantity}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handlePriceChange(index, 'quantity', e.target.value)}
                            className="w-20 px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        ) : (
                          <span className="text-slate-700">{item.quantity}</span>
                        )}
                      </td>
                      <td className="py-3">
                        {isEditingPrices ? (
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₦</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handlePriceChange(index, 'unitPrice', e.target.value)}
                              className="w-32 pl-8 pr-3 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                          </div>
                        ) : (
                          <span className="text-slate-700">{formatCurrency(item.unitPrice)}</span>
                        )}
                      </td>
                      <td className="py-3 text-right font-medium text-slate-900">
                        {formatCurrency((item.quantity || 0) * (item.unitPrice || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex justify-end">
                <div className="w-full sm:w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-900">{formatCurrency(totalItems)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="text-slate-900">{formatCurrency(invoice.tax || 0)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold border-t border-slate-200 pt-2">
                    <span className="text-slate-900">Total</span>
                    <span className="text-blue-600">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast and Modal */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
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