// Team.jsx — Team Management (SUPER_ADMIN / ADMIN only)
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api, { getUserFromToken } from "../services/api";
import {
  Users,
  UserPlus,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
} from "lucide-react";
import Toast from "../components/Toast";

const ROLE_STYLE = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
  ADMIN:       "bg-blue-100 text-blue-700",
  STAFF:       "bg-slate-100 text-slate-600",
};

const ROLE_ICON = {
  SUPER_ADMIN: ShieldCheck,
  ADMIN:       ShieldCheck,
  STAFF:       User,
};

// ── Add Member Modal ──────────────────────────────────────────────────────────
function AddMemberModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ username: "", password: "", role: "ADMIN" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const endpoint = form.role === "ADMIN" ? "/api/auth/admin" : "/api/auth/staff";
    try {
      await api.post(endpoint, { username: form.username, password: form.password });
      onSuccess(`${form.role} "${form.username}" created successfully`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Add Team Member</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {["ADMIN", "STAFF"].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, role: r }))}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition ${
                    form.role === r
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {form.role === "ADMIN"
                ? "Can create invoices, clients, and projects. Cannot delete clients or manage other admins."
                : "Read and create access only. No delete permissions."}
            </p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              placeholder="e.g. john_doe"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                placeholder="Min. 6 characters"
                className="w-full px-4 py-2.5 pr-11 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating…" : `Add ${form.role}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function Team() {
  const user = getUserFromToken();
  const role = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : null);
  const isSuperAdmin = role === "SUPER_ADMIN" || role === "PLATFORM_ADMIN";
  const canAccess = role === "SUPER_ADMIN" || role === "ADMIN" || role === "PLATFORM_ADMIN";

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);  // { id, username }
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const showToast = (message, type = "success") =>
    setToast({ visible: true, message, type });

  const fetchMembers = () => {
    setLoading(true);
    api.get("/api/auth/users")
      .then(res => setMembers(res.data.content ?? res.data ?? []))
      .catch(() => showToast("Failed to load team members", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!canAccess) return;
    fetchMembers();
  }, []);

  if (!canAccess) return <Navigate to="/dashboard" replace />;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/auth/users/${deleteTarget.id}`);
      setMembers(prev => prev.filter(m => m.id !== deleteTarget.id));
      showToast(`${deleteTarget.username} removed from team`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete user.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Team
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage who has access to your organisation.</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02] transition-all self-start sm:self-auto"
          >
            <UserPlus size={16} />
            Add Member
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Team Members</h2>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{members.length} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">No team members yet.</p>
            {isSuperAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              >
                <UserPlus size={15} />
                Add your first member
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified</th>
                  {isSuperAdmin && (
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map(member => {
                  const RoleIcon = ROLE_ICON[member.role] ?? User;
                  const isSelf = member.username === user?.username;
                  const isProtected = member.role === "SUPER_ADMIN";
                  return (
                    <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                      {/* Username */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {member.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {member.username}
                              {isSelf && (
                                <span className="ml-2 text-xs text-slate-400 font-normal">(you)</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_STYLE[member.role] ?? ROLE_STYLE.STAFF}`}>
                          <RoleIcon size={11} />
                          {member.role?.replace("_", " ")}
                        </span>
                      </td>

                      {/* Verified */}
                      <td className="px-6 py-4 text-center">
                        {member.verified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                            <CheckCircle size={14} />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-medium">
                            <XCircle size={14} />
                            No
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      {isSuperAdmin && (
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setDeleteTarget(member)}
                            disabled={isProtected || isSelf}
                            title={isProtected ? "Cannot remove SUPER_ADMIN" : isSelf ? "Cannot remove yourself" : `Remove ${member.username}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onSuccess={(msg) => { showToast(msg); fetchMembers(); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Remove Member</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Remove <span className="font-semibold text-slate-900">{deleteTarget.username}</span> from your organisation? They will lose access immediately.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition disabled:opacity-60"
              >
                {deleting ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}

export default Team;
