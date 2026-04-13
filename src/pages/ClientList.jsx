// ClientList.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getUserFromToken } from "../services/api";
import {
  Users,
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Download,
} from "lucide-react";

const exportCsv = async (endpoint, filename) => {
  const res = await api.get(endpoint, { responseType: "blob" });
  const url = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 20;
  const navigate = useNavigate();
  const user = getUserFromToken();
  const isAdmin = user && (user.role === "ADMIN" || (Array.isArray(user.roles) && user.roles.includes("ADMIN")));

  useEffect(() => {
    fetchClients(page);
  }, [page]);

  const fetchClients = async (currentPage) => {
    try {
      setLoading(true);
      const res = await api.get("/api/clients", { params: { page: currentPage, size: PAGE_SIZE } });
      setClients(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch clients error:", err);
      setToast({ visible: true, message: "Failed to load clients", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;
    try {
      setIsDeleting(true);
      await api.delete(`/api/clients/${selectedClient.id}`);
      setToast({ visible: true, message: "Client deleted successfully", type: "success" });
      fetchClients(page);
    } catch (err) {
      console.error("Delete client error:", err);
      setToast({ visible: true, message: "Failed to delete client", type: "error" });
    }
    finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedClient(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Customers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your client list</p>
        </div>
        <Link
          to="/clients/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.02] transition-all duration-200 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Customer
        </Link>
      </div>

      {/* Clients Table */}
      <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">All Customers</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
              Showing {clients.length} of {totalElements} clients
            </span>
            <button
              onClick={async () => {
                setExporting(true);
                try { await exportCsv("/api/export/clients", "clients.csv"); }
                catch { /* silent */ }
                finally { setExporting(false); }
              }}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Loading clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full inline-block mb-3">
              <Users className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400">No customers yet</p>
            <Link
              to="/clients/create"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              Add your first customer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {clients.map((client) => (
                  <tr key={client.id} onClick={() => navigate(`/clients/${client.id}`)} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-900 dark:text-white font-medium">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        {client.email || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        {client.phone || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        <span className="truncate max-w-xs">{client.address || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteClick(client)}
                          className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
                          title="Delete client"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page + 1 >= totalPages}
                className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Customer"
        message={`Are you sure you want to delete "${selectedClient?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </div>
  );
}

export default ClientList;
