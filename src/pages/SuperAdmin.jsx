// SuperAdmin.jsx — Platform Admin Dashboard (PLATFORM_ADMIN only)
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api, { getUserFromToken } from "../services/api";
import {
  ShieldCheck,
  Building2,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  ChevronDown,
  FolderOpen,
  AlertTriangle,
  X,
} from "lucide-react";
import Toast from "../components/Toast";

const PLANS = ["FREE", "STARTER", "PRO"];

const PLAN_STYLE = {
  FREE:    "bg-slate-100 text-slate-600",
  STARTER: "bg-blue-100 text-blue-700",
  PRO:     "bg-indigo-100 text-indigo-700",
};

// ── Suspend-with-reason modal ────────────────────────────────────────────────
function SuspendModal({ org, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState("");
  if (!org) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Suspend Organisation</h3>
          </div>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Suspending <span className="font-semibold text-slate-900">{org.name}</span> will immediately revoke access for all their users.
        </p>
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Reason <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="e.g., Payment overdue, Terms violation…"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 resize-none transition"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Suspending…" : "Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function SuperAdmin() {
  const user = getUserFromToken();
  const isPlatformAdmin =
    user?.role === "PLATFORM_ADMIN" ||
    (Array.isArray(user?.roles) && user.roles.includes("PLATFORM_ADMIN"));

  const [stats, setStats] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suspendTarget, setSuspendTarget] = useState(null);  // org being suspended
  const [suspending, setSuspending] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const showToast = (message, type = "success") =>
    setToast({ visible: true, message, type });

  const fetchAll = () => {
    setLoading(true);
    // Fetch current user's org ID so we can block self-suspension
    api.get("/api/org").then(res => setCurrentOrgId(res.data.id ?? null)).catch(() => {});

    Promise.all([
      api.get("/api/superadmin/stats"),
      api.get("/api/superadmin/organisations"),
    ])
      .then(([statsRes, orgsRes]) => {
        setStats(statsRes.data);
        setOrgs(orgsRes.data.content ?? orgsRes.data ?? []);
      })
      .catch(() => showToast("Failed to load platform data", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  // Guard — non-admin users get redirected
  if (!isPlatformAdmin) return <Navigate to="/dashboard" replace />;

  // ── Actions ────────────────────────────────────────────────────────────────
  const changePlan = async (orgId, plan) => {
    try {
      await api.put(`/api/superadmin/organisations/${orgId}/plan`, { plan });
      setOrgs(prev => prev.map(o => o.id === orgId ? { ...o, plan } : o));
      showToast(`Plan updated to ${plan}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update plan.", "error");
    }
  };

  const doSuspend = async (reason) => {
    setSuspending(true);
    try {
      await api.post(`/api/superadmin/organisations/${suspendTarget.id}/suspend`, { reason });
      setOrgs(prev => prev.map(o => o.id === suspendTarget.id ? { ...o, suspended: true } : o));
      if (stats) setStats(s => ({ ...s, activeOrgs: s.activeOrgs - 1, suspendedOrgs: s.suspendedOrgs + 1 }));
      showToast(`${suspendTarget.name} suspended`);
      setSuspendTarget(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to suspend.", "error");
    } finally {
      setSuspending(false);
    }
  };

  const doUnsuspend = async (org) => {
    try {
      await api.post(`/api/superadmin/organisations/${org.id}/unsuspend`);
      setOrgs(prev => prev.map(o => o.id === org.id ? { ...o, suspended: false } : o));
      if (stats) setStats(s => ({ ...s, activeOrgs: s.activeOrgs + 1, suspendedOrgs: s.suspendedOrgs - 1 }));
      showToast(`${org.name} restored`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to unsuspend.", "error");
    }
  };

  // ── Sub-components ─────────────────────────────────────────────────────────
  const StatCard = ({ label, value, icon: Icon, color, sub }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value ?? "—"}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          Platform Admin
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all organisations on LumiCash.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Orgs"   value={stats?.totalOrgs}      icon={Building2} color="bg-gradient-to-br from-blue-600 to-indigo-600" />
        <StatCard label="Active"       value={stats?.activeOrgs}     icon={CheckCircle} color="bg-gradient-to-br from-emerald-500 to-teal-500" />
        <StatCard label="Suspended"    value={stats?.suspendedOrgs}  icon={XCircle}  color="bg-gradient-to-br from-rose-500 to-pink-500" />
        <StatCard label="Total Users"  value={stats?.totalUsers}     icon={Users}    color="bg-gradient-to-br from-violet-500 to-purple-600" />
        <StatCard label="Invoices"     value={stats?.totalInvoices}  icon={FileText} color="bg-gradient-to-br from-amber-500 to-orange-500" />
        <StatCard label="Projects"     value={stats?.totalProjects}  icon={FolderOpen} color="bg-gradient-to-br from-cyan-500 to-sky-600" />
      </div>

      {/* Plan breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {PLANS.map(p => (
          <div key={p} className={`rounded-2xl border px-5 py-4 flex items-center justify-between ${PLAN_STYLE[p]} border-current/10`}>
            <span className="text-sm font-semibold">{p}</span>
            <span className="text-2xl font-bold">
              {stats
                ? (p === "FREE" ? stats.freeOrgs : p === "STARTER" ? stats.starterOrgs : stats.proOrgs) ?? 0
                : "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Orgs table */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">All Organisations</h2>
          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{orgs.length} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600" />
          </div>
        ) : orgs.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">No organisations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Organisation</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Users</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clients</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoices</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Projects</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {orgs.map(org => {
                  const isSuspended = org.suspended === true;
                  const isOwnOrg = currentOrgId && org.id === currentOrgId;
                  return (
                    <tr key={org.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isSuspended ? "opacity-60" : ""}`}>
                      {/* Name + email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {org.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{org.name}</p>
                            {org.email && <p className="text-xs text-slate-400">{org.email}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isSuspended ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {isSuspended ? <XCircle size={11} /> : <CheckCircle size={11} />}
                          {isSuspended ? "Suspended" : "Active"}
                        </span>
                      </td>

                      {/* Plan dropdown */}
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={org.plan ?? "FREE"}
                            onChange={e => changePlan(org.id, e.target.value)}
                            className={`appearance-none pl-2.5 pr-7 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer ${PLAN_STYLE[org.plan] ?? PLAN_STYLE.FREE}`}
                          >
                            {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                        </div>
                      </td>

                      {/* Counts */}
                      <td className="px-4 py-4 text-center text-slate-600">{org.userCount ?? "—"}</td>
                      <td className="px-4 py-4 text-center text-slate-600">{org.clientCount ?? "—"}</td>
                      <td className="px-4 py-4 text-center text-slate-600">{org.invoiceCount ?? "—"}</td>
                      <td className="px-4 py-4 text-center text-slate-600">{org.projectCount ?? "—"}</td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        {isSuspended ? (
                          <button
                            onClick={() => doUnsuspend(org)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
                          >
                            <CheckCircle size={13} />
                            Unsuspend
                          </button>
                        ) : isOwnOrg ? (
                          <span className="text-xs text-slate-400 italic px-2">Your org</span>
                        ) : (
                          <button
                            onClick={() => setSuspendTarget(org)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition"
                          >
                            <XCircle size={13} />
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Toast {...toast} onClose={() => setToast({ ...toast, visible: false })} />

      <SuspendModal
        org={suspendTarget}
        onConfirm={doSuspend}
        onCancel={() => setSuspendTarget(null)}
        loading={suspending}
      />
    </div>
  );
}

export default SuperAdmin;
