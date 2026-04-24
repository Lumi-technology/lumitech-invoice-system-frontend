// ProjectDetail.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { getUserFromToken } from "../services/api";
import {
  ArrowLeft,
  FolderOpen,
  Edit2,
  Trash2,
  Save,
  X,
  Plus,
  FileText,
} from "lucide-react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import NumericInput from "../components/NumericInput";

const STATUSES = ["ACTIVE", "ON_HOLD", "SUSPENDED", "CANCELLED", "COMPLETED"];
const CATEGORIES = [
  "CONSTRUCTION", "SOFTWARE", "CONSULTING", "CREATIVE",
  "RETAIL", "LEGAL", "MEDICAL", "EVENTS", "OTHER",
];

const STATUS_STYLE = {
  ACTIVE:    "bg-emerald-100 text-emerald-700",
  ON_HOLD:   "bg-amber-100 text-amber-700",
  SUSPENDED: "bg-orange-100 text-orange-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

const fmt = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 });
const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
};

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = getUserFromToken();
  const isAdmin = user && (
    user.role === "ADMIN" || user.role === "SUPER_ADMIN" || user.role === "PLATFORM_ADMIN" ||
    (Array.isArray(user.roles) && (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN") || user.roles.includes("PLATFORM_ADMIN")))
  );
  const isSuperAdmin = user && (
    user.role === "SUPER_ADMIN" || user.role === "PLATFORM_ADMIN" ||
    (Array.isArray(user.roles) && (user.roles.includes("SUPER_ADMIN") || user.roles.includes("PLATFORM_ADMIN")))
  );

  const [project, setProject] = useState(null);
  const [changeOrders, setChangeOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit project modal
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Change order form
  const [showCO, setShowCO] = useState(false);
  const [coForm, setCoForm] = useState({ description: "", amount: "" });
  const [isAddingCO, setIsAddingCO] = useState(false);

  const fetchProject = useCallback(() => {
    return api.get(`/api/projects/${id}`).then(res => setProject(res.data));
  }, [id]);

  const fetchChangeOrders = useCallback(() => {
    return api.get(`/api/projects/${id}/change-orders`).then(res => {
      setChangeOrders(res.data.content ?? res.data ?? []);
    }).catch(() => {});
  }, [id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProject(), fetchChangeOrders()])
      .catch(() => setToast({ visible: true, message: "Failed to load project", type: "error" }))
      .finally(() => setLoading(false));
  }, [fetchProject, fetchChangeOrders]);

  const openEdit = () => {
    setEditForm({
      name: project.name || "",
      category: project.category || "",
      status: project.status || "ACTIVE",
      contractValue: project.contractValue ?? "",
      description: project.description || "",
    });
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);
      const res = await api.put(`/api/projects/${id}`, {
        ...editForm,
        contractValue: Number(editForm.contractValue),
      });
      setProject(res.data);
      setShowEdit(false);
      setToast({ visible: true, message: "Project updated", type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update project.";
      setToast({ visible: true, message: msg, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/projects/${id}`);
      navigate("/projects");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete project.";
      setToast({ visible: true, message: msg, type: "error" });
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddChangeOrder = async (e) => {
    e.preventDefault();
    try {
      setIsAddingCO(true);
      await api.post(`/api/projects/${id}/change-orders`, {
        description: coForm.description,
        amount: Number(coForm.amount),
      });
      setCoForm({ description: "", amount: "" });
      setShowCO(false);
      await Promise.all([fetchProject(), fetchChangeOrders()]);
      setToast({ visible: true, message: "Change order added", type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add change order.";
      setToast({ visible: true, message: msg, type: "error" });
    } finally {
      setIsAddingCO(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const paidPct = Math.min(100, Math.max(0, project.percentagePaid ?? 0));
  const invoicedPct = Math.min(100, Math.max(0, project.percentageInvoiced ?? 0));
  const outstandingPct = Math.max(0, invoicedPct - paidPct);
  const remainingPct = Math.max(0, 100 - invoicedPct);

  const financialCards = [
    { label: "Contract Value",         value: project.contractValue,         color: "text-slate-900 dark:text-white" },
    { label: "Revised Contract Value", value: project.revisedContractValue,  color: "text-slate-900 dark:text-white" },
    { label: "Total Invoiced",         value: project.totalInvoiced,         color: "text-blue-600"  },
    { label: "Total Paid",             value: project.totalPaid,             color: "text-emerald-600" },
    { label: "Total Outstanding",      value: project.totalOutstanding,      color: "text-amber-600"  },
    { label: "Remaining to Invoice",   value: project.remainingToInvoice,    color: "text-slate-600 dark:text-slate-300"  },
  ];

  return (
    <div className="space-y-6">
      {/* Back + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={openEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition shadow-sm text-sm font-medium"
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
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{project.name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{project.clientName ?? project.client?.name ?? ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {project.category && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">
                  {project.category}
                </span>
              )}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[project.status] ?? "bg-slate-100 text-slate-600"}`}>
                {project.status?.replace("_", " ")}
              </span>
            </div>
          </div>
          {project.description && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Payment Progress</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{Math.round(paidPct)}% paid</p>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${paidPct}%` }} title={`Paid: ${Math.round(paidPct)}%`} />
            <div className="bg-amber-400 h-full transition-all" style={{ width: `${outstandingPct}%` }} title={`Outstanding: ${Math.round(outstandingPct)}%`} />
            <div className="bg-slate-200 dark:bg-slate-600 h-full transition-all" style={{ width: `${remainingPct}%` }} title={`Remaining to invoice: ${Math.round(remainingPct)}%`} />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Paid</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Outstanding</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200 inline-block" />Remaining</span>
          </div>
        </div>

        {/* Financial Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-slate-100 dark:bg-slate-700">
          {financialCards.map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-slate-800 px-6 py-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
              <p className={`text-base font-semibold ${color}`}>{fmt.format(value ?? 0)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Change Orders */}
      <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Change Orders</h2>
          {isAdmin && (
            <button
              onClick={() => { setCoForm({ description: "", amount: "" }); setShowCO(true); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Plus size={13} />
              Add
            </button>
          )}
        </div>
        {changeOrders.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">No change orders yet.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {changeOrders.map((co, i) => (
              <div key={co.id ?? i} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{co.description}</p>
                  {co.createdAt && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{fmtDate(co.createdAt)}</p>}
                </div>
                <span className={`text-sm font-semibold whitespace-nowrap ${co.amount >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {co.amount >= 0 ? "+" : ""}{fmt.format(co.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoices linked to this project */}
      {Array.isArray(project.invoices) && project.invoices.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Linked Invoices
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Issue Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {project.invoices.map(inv => (
                  <tr
                    key={inv.id}
                    onClick={() => navigate(`/invoices/${inv.id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-blue-600">#{inv.invoiceNumber ?? inv.id}</td>
                    <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{fmtDate(inv.issueDate)}</td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-slate-900 dark:text-white">{fmt.format(inv.total ?? inv.totalAmount ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl dark:bg-slate-800/80 dark:border-slate-700 rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                Edit Project
              </h3>
              <button onClick={() => setShowEdit(false)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Project Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    <option value="">Select</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Contract Value (₦)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">₦</span>
                  <NumericInput
                    value={editForm.contractValue}
                    onChange={e => setEditForm({ ...editForm, contractValue: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition">
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving || !editForm.name?.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                <Save size={15} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Change Order Modal */}
      {showCO && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl dark:bg-slate-800/80 dark:border-slate-700 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add Change Order</h3>
              <button onClick={() => setShowCO(false)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddChangeOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Description *</label>
                <input
                  required
                  type="text"
                  value={coForm.description}
                  onChange={e => setCoForm({ ...coForm, description: e.target.value })}
                  placeholder="e.g. Additional scope for basement"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 dark:text-white dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Amount (₦) *</label>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Use negative value for deductions.</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">₦</span>
                  <NumericInput
                    required
                    value={coForm.amount}
                    onChange={e => setCoForm({ ...coForm, amount: e.target.value })}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 dark:text-white dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCO(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingCO}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
                >
                  <Plus size={15} />
                  {isAddingCO ? "Adding..." : "Add Change Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />

      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </div>
  );
}

export default ProjectDetail;
