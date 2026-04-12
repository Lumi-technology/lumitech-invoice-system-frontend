// Finance.jsx
import { useState } from "react";
import api from "../services/api";
import { Download, Wallet } from "lucide-react";
import Toast from "../components/Toast";

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
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportCsv("/api/export/payments", "payments.csv");
      setToast({ visible: true, message: "Payments exported successfully", type: "success" });
    } catch {
      setToast({ visible: true, message: "Export failed. Please try again.", type: "error" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            Finance & Payments
          </h1>
          <p className="text-sm text-slate-500 mt-1">Export your payment records for reporting and accounting.</p>
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

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
          <Wallet className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-900 mb-2">Export your payment data</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          Download a full CSV of all payment records for use in spreadsheets or accounting software.
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white rounded-xl text-slate-700 hover:bg-slate-50 transition text-sm font-medium shadow-sm disabled:opacity-50"
        >
          <Download size={16} />
          {exporting ? "Exporting..." : "Download Payments CSV"}
        </button>
      </div>

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}

export default Finance;
