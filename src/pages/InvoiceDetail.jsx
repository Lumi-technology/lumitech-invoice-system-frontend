import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Download } from "lucide-react";

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
    } catch (err) {
      console.error("MARK AS PAID ERROR:", err);
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

    } catch (error) {
      console.error("PDF DOWNLOAD ERROR:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading invoice...</p>
      </div>
    );
  }

  const totalItems = invoice.items?.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  ) || 0;

  const grandTotal = totalItems + (invoice.tax || 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto py-10 px-6">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">
                Invoice #{invoice.invoiceNumber}
              </h2>
              <p className="text-sm text-slate-500">
                Issue Date: {invoice.issueDate}
              </p>
              <p className="text-sm text-slate-500">
                Due Date: {invoice.dueDate}
              </p>
            </div>

            <button
              onClick={downloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow disabled:opacity-50"
            >
              <Download size={16} />
              {isDownloading ? "Downloading..." : "Download PDF"}
            </button>
          </div>

          {/* Client Info */}
          <div className="border rounded-xl p-4 bg-slate-50">
            <h3 className="font-semibold mb-2">Client</h3>
            <p className="font-medium">{invoice.client?.name}</p>
            {invoice.client?.email && (
              <p className="text-sm text-slate-500">{invoice.client.email}</p>
            )}
            {invoice.client?.phone && (
              <p className="text-sm text-slate-500">{invoice.client.phone}</p>
            )}
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-4">Items</h3>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-slate-600">
                  <th className="py-2">Description</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Unit Price</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.description}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-2">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="text-right space-y-2 pt-4">
            <p>Subtotal: {formatCurrency(totalItems)}</p>
            <p>Tax: {formatCurrency(invoice.tax)}</p>
            <p className="text-xl font-bold">
              Total: {formatCurrency(grandTotal)}
            </p>
          </div>

          {/* Status Section */}
          <div className="flex items-center gap-4 pt-4">

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium
                ${invoice.status === "PAID"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"}`}
            >
              {invoice.status}
            </span>

            {invoice.status !== "PAID" && (
              <button
                onClick={markAsPaid}
                disabled={isPaying}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {isPaying ? "Updating..." : "Mark as Paid"}
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default InvoiceDetail;