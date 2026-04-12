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
  Edit2,
  X,
  Save,
  FolderOpen,
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
  const [activeTab, setActiveTab] = useState("details");
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const user = getUserFromToken();
  const isAdmin =
    user &&
    (user.role === "ADMIN" ||
      user.role === "SUPER_ADMIN" ||
      user.role === "PLATFORM_ADMIN" ||
      (Array.isArray(user.roles) &&
        (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN") || user.roles.includes("PLATFORM_ADMIN"))));
  const isSuperAdmin =
    user &&
    (user.role === "SUPER_ADMIN" ||
      user.role === "PLATFORM_ADMIN" ||
      (Array.isArray(user.roles) && (user.roles.includes("SUPER_ADMIN") || user.roles.includes("PLATFORM_ADMIN"))));

  // Edit state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    api
      .get(`/api/clients/${id}`)
      .then((res) => setClient(res.data))
      .catch(() =>
        setToast({ visible: true, message: "Failed to load client", type: "error" })
      )
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (activeTab !== "projects") return;
    setProjectsLoading(true);
    api.get(`/api/projects/client/${id}`)
      .then(res => setProjects(res.data.content ?? res.data ?? []))
      .catch(() => setToast({ visible: true, message: "Failed to load projects", type: "error" }))
      .finally(() => setProjectsLoading(false));
  }, [activeTab, id]);

  const openEditModal = () => {
    setEditForm({ name: client.name || "", email: client.email || "", phone: client.phone || "", address: client.address || "" });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      setIsSavingEdit(true);
      const res = await api.put(`/api/clients/${id}`, editForm);
      setClient(res.data);
      setShowEditModal(false);
      setToast({ visible: true, message: "Client updated successfully", type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update client.";
      setToast({ visible: true, message: msg, type: "error" });
    } finally {
      setIsSavingEdit(false);
    }
  };

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
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm text-sm font-medium"
            >
              <Edit2 size={16} />
              Edit
            </button>
          )}
          {isSuperAdmin && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition shadow-sm text-sm font-medium"
            >
              <Trash2 size={16} />
              Delete Client
            </button>
          )}
        </div>
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

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {[
          { key: "details", label: "Details" },
          { key: "projects", label: "Projects", icon: FolderOpen },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.icon && <tab.icon size={15} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {projectsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FolderOpen className="mx-auto w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No projects for this client.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contract Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map(p => (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                      <td className="px-6 py-4 text-slate-500">{p.category ?? "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          { ACTIVE: "bg-emerald-100 text-emerald-700", ON_HOLD: "bg-amber-100 text-amber-700", SUSPENDED: "bg-orange-100 text-orange-700", CANCELLED: "bg-rose-100 text-rose-700", COMPLETED: "bg-blue-100 text-blue-700" }[p.status] ?? "bg-slate-100 text-slate-600"
                        }`}>
                          {p.status?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(p.revisedContractValue ?? p.contractValue ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Portal Link Section */}
      {activeTab === "details" && client.portalUrl && (
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

      {/* Edit Client Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                Edit Client
              </h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Name", field: "name", type: "text", icon: <Edit2 className="w-4 h-4 text-slate-400" /> },
                { label: "Email", field: "email", type: "email", icon: <Mail className="w-4 h-4 text-slate-400" /> },
                { label: "Phone", field: "phone", type: "text", icon: <Phone className="w-4 h-4 text-slate-400" /> },
                { label: "Address", field: "address", type: "text", icon: <MapPin className="w-4 h-4 text-slate-400" /> },
              ].map(({ label, field, type, icon }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
                    <input
                      type={type}
                      value={editForm[field]}
                      onChange={e => setEditForm({ ...editForm, [field]: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                      placeholder={label}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit || !editForm.name.trim()}
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
