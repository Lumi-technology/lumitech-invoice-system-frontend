// ClientDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Link2,
  Copy,
  CheckCircle,
  Trash2,
} from "lucide-react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import { getUserFromToken } from "../services/api";

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const user = getUserFromToken();
  const isAdmin =
    user &&
    (user.role === "ADMIN" ||
      user.role === "SUPER_ADMIN" ||
      (Array.isArray(user.roles) &&
        (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN"))));

  useEffect(() => {
    api
      .get(`/api/clients/${id}`)
      .then((res) => setClient(res.data))
      .catch(() =>
        setToast({ visible: true, message: "Failed to load client", type: "error" })
      )
      .finally(() => setLoading(false));
  }, [id]);

  const deleteClient = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/clients/${id}`);
      navigate("/clients");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete client.";
      setToast({ visible: true, message: msg, type: "error" });
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const copyPortalLink = () => {
    navigator.clipboard.writeText(client.portalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4" />
          <p className="text-slate-500">Loading client...</p>
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="space-y-6">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        {isAdmin && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition shadow-sm text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete Client
          </button>
        )}
      </div>

      {/* Client Info Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{client.name}</h1>
              <p className="text-sm text-slate-500">Client details</p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-wrap gap-6">
          {client.email && (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              {client.email}
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Phone className="w-4 h-4 text-slate-400" />
              {client.phone}
            </div>
          )}
          {client.address && (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <MapPin className="w-4 h-4 text-slate-400" />
              {client.address}
            </div>
          )}
        </div>
      </div>

      {/* Portal Link Section */}
      {client.portalUrl && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <Link2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">Client Portal Link</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Share this link with the client to let them view and pay their invoices online.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={client.portalUrl}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 text-sm focus:outline-none truncate"
            />
            <button
              onClick={copyPortalLink}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                copied
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />

      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Client"
        message={`Are you sure you want to delete "${client.name}"? This cannot be undone. Clients with existing invoices cannot be deleted.`}
        onConfirm={deleteClient}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </div>
  );
}

export default ClientDetail;
