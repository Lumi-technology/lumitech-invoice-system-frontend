// Suppliers.jsx — Supplier summary dashboard
import { useEffect, useState } from "react";
import api from "../services/api";
import { Truck, Building2 } from "lucide-react";
import { useOrg } from "../context/OrgContext";
import Toast from "../components/Toast";

function Suppliers() {
  const { fmt } = useOrg();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  useEffect(() => {
    api.get("/api/bills/suppliers/summary")
      .then(res => setSuppliers(res.data ?? []))
      .catch(() => setToast({ visible: true, message: "Failed to load supplier data", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const totalOutstanding = suppliers.reduce((s, r) => s + (r.totalOutstanding ?? 0), 0);
  const totalBilled = suppliers.reduce((s, r) => s + (r.totalBilled ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Suppliers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All suppliers derived from your bills</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Suppliers</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{suppliers.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Billed</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{fmt(totalBilled)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-sm px-5 py-4">
          <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{fmt(totalOutstanding)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">All Suppliers</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Loading suppliers…</p>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full inline-block mb-3">
              <Building2 className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No suppliers yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Create a bill to see suppliers here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Supplier</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bills</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Billed</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Paid</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {suppliers.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.supplierName?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{s.supplierName}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-slate-500 dark:text-slate-400">{s.supplierEmail || "—"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold">{s.billCount}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700 dark:text-slate-200">{fmt(s.totalBilled)}</td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600 dark:text-emerald-400">{fmt(s.totalPaid)}</td>
                    <td className="px-6 py-4 text-right">
                      {s.totalOutstanding > 0 ? (
                        <span className="font-semibold text-amber-600 dark:text-amber-400">{fmt(s.totalOutstanding)}</span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">—</span>
                      )}
                    </td>
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

export default Suppliers;
