// SuperAdmin.jsx — Platform Admin Dashboard (PLATFORM_ADMIN only)
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api, { getUserFromToken } from "../services/api";
import {
  ShieldCheck, Building2, Users, FileText, CheckCircle, XCircle,
  ChevronDown, FolderOpen, AlertTriangle, X,
  Trash2, UserCircle, Clock,
} from "lucide-react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from "recharts";

const PLANS = ["FREE", "STARTER", "GROWTH", "PRO", "ACCOUNTANT_PRO"];

const PLAN_LABEL = {
  FREE:           "Free",
  STARTER:        "Essential",
  GROWTH:         "Business",
  PRO:            "Pro",
  ACCOUNTANT_PRO: "Accountant Pro",
};

const PLAN_STYLE = {
  FREE:           "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  STARTER:        "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  GROWTH:         "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
  PRO:            "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300",
  ACCOUNTANT_PRO: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
};

const PLAN_COLORS = {
  FREE:           "#94a3b8",
  STARTER:        "#3b82f6",
  GROWTH:         "#10b981",
  PRO:            "#6366f1",
  ACCOUNTANT_PRO: "#a855f7",
};

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

// ── Suspend modal ────────────────────────────────────────────────────────────
function SuspendModal({ org, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState("");
  if (!org) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Suspend Organisation</h3>
          </div>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Suspending <span className="font-semibold text-slate-900 dark:text-white">{org.name}</span> will immediately revoke access for all their users.
        </p>
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
            Reason <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="e.g., Payment overdue, Terms violation…"
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700/50 dark:text-white dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 resize-none transition"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition">Cancel</button>
          <button onClick={() => onConfirm(reason)} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition disabled:opacity-60">
            {loading ? "Suspending…" : "Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Org row ──────────────────────────────────────────────────────────────────
function OrgRow({ org, isOwnOrg, onSuspend, onUnsuspend, onDelete, onPlanChange }) {
  const [expanded, setExpanded] = useState(false);
  const [users, setUsers] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const toggleUsers = async () => {
    if (!expanded && users === null) {
      setLoadingUsers(true);
      try {
        const res = await api.get(`/api/superadmin/organisations/${org.id}/users`);
        setUsers(res.data);
      } finally {
        setLoadingUsers(false);
      }
    }
    setExpanded(e => !e);
  };

  const isSuspended = org.suspended === true;

  return (
    <>
      <tr className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isSuspended ? "opacity-60" : ""}`}>
        {/* Name + email */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {org.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{org.name}</p>
              {org.email && <p className="text-xs text-slate-400 dark:text-slate-500">{org.email}</p>}
            </div>
          </div>
        </td>

        {/* Joined */}
        <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:table-cell">
          {fmtDate(org.createdAt)}
        </td>

        {/* Status */}
        <td className="px-4 py-4">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isSuspended
              ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
              : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
          }`}>
            {isSuspended ? <XCircle size={11} /> : <CheckCircle size={11} />}
            {isSuspended ? "Suspended" : "Active"}
          </span>
        </td>

        {/* Plan */}
        <td className="px-4 py-4">
          <div className="relative inline-block">
            <select
              value={org.plan ?? "FREE"}
              onChange={e => onPlanChange(org.id, e.target.value)}
              className={`appearance-none pl-2.5 pr-6 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer ${PLAN_STYLE[org.plan] ?? PLAN_STYLE.FREE}`}
            >
              {PLANS.map(p => <option key={p} value={p}>{PLAN_LABEL[p]}</option>)}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
          </div>
        </td>

        {/* Counts */}
        <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300 hidden md:table-cell">{org.userCount ?? "—"}</td>
        <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300 hidden lg:table-cell">{org.clientCount ?? "—"}</td>
        <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300 hidden lg:table-cell">{org.invoiceCount ?? "—"}</td>
        <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300 hidden xl:table-cell">{org.projectCount ?? "—"}</td>

        {/* Actions */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-1.5 justify-end flex-wrap">
            <button
              onClick={toggleUsers}
              title="View users"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition"
            >
              <Users size={12} />
              {expanded ? "Hide" : "Users"}
            </button>

            {isOwnOrg ? (
              <span className="text-xs text-slate-400 italic px-2">Your org</span>
            ) : isSuspended ? (
              <>
                <button
                  onClick={() => onUnsuspend(org)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                >
                  <CheckCircle size={12} />Restore
                </button>
                <button
                  onClick={() => onDelete(org)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 rounded-lg hover:bg-rose-100 transition"
                >
                  <Trash2 size={12} />Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSuspend(org)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg hover:bg-amber-100 transition"
                >
                  <XCircle size={12} />Suspend
                </button>
                <button
                  onClick={() => onDelete(org)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 rounded-lg hover:bg-rose-100 transition"
                >
                  <Trash2 size={12} />Delete
                </button>
              </>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded users */}
      {expanded && (
        <tr className="bg-slate-50/70 dark:bg-slate-700/30">
          <td colSpan={9} className="px-6 py-3">
            {loadingUsers ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                Loading users…
              </div>
            ) : users?.length === 0 ? (
              <p className="text-xs text-slate-400 py-1">No users in this organisation.</p>
            ) : (
              <div className="flex flex-wrap gap-2 py-1">
                {users?.map(u => (
                  <div key={u.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs">
                    <UserCircle size={13} className="text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">{u.username}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                      u.role === "SUPER_ADMIN" || u.role === "ADMIN"
                        ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }`}>{u.role}</span>
                  </div>
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
function SuperAdmin() {
  const user = getUserFromToken();
  const isPlatformAdmin =
    user?.role === "PLATFORM_ADMIN" ||
    (Array.isArray(user?.roles) && user.roles.includes("PLATFORM_ADMIN"));

  const [stats, setStats] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspending, setSuspending] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const showToast = (message, type = "success") => setToast({ visible: true, message, type });

  const fetchAll = () => {
    setLoading(true);
    api.get("/api/org").then(res => setCurrentOrgId(res.data.id ?? null)).catch(() => {});
    Promise.all([
      api.get("/api/superadmin/stats"),
      api.get("/api/superadmin/organisations"),
      api.get("/api/superadmin/recent-registrations?limit=8"),
    ])
      .then(([statsRes, orgsRes, recentRes]) => {
        setStats(statsRes.data);
        setOrgs(orgsRes.data.content ?? orgsRes.data ?? []);
        setRecent(recentRes.data ?? []);
      })
      .catch(() => showToast("Failed to load platform data", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  if (!isPlatformAdmin) return <Navigate to="/dashboard" replace />;

  const changePlan = async (orgId, plan) => {
    try {
      await api.put(`/api/superadmin/organisations/${orgId}/plan`, { plan });
      setOrgs(prev => prev.map(o => o.id === orgId ? { ...o, plan } : o));
      showToast(`Plan updated to ${PLAN_LABEL[plan] ?? plan}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update plan.", "error");
    }
  };

  const doSuspend = async (reason) => {
    setSuspending(true);
    try {
      await api.post(`/api/superadmin/organisations/${suspendTarget.id}/suspend`, { reason });
      setOrgs(prev => prev.map(o => o.id === suspendTarget.id ? { ...o, suspended: true } : o));
      if (stats) setStats(s => ({ ...s, activeOrganisations: s.activeOrganisations - 1, suspendedOrganisations: s.suspendedOrganisations + 1 }));
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
      if (stats) setStats(s => ({ ...s, activeOrganisations: s.activeOrganisations + 1, suspendedOrganisations: s.suspendedOrganisations - 1 }));
      showToast(`${org.name} restored`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to restore.", "error");
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/superadmin/organisations/${deleteTarget.id}`);
      setOrgs(prev => prev.filter(o => o.id !== deleteTarget.id));
      if (stats) setStats(s => ({
        ...s,
        totalOrganisations: s.totalOrganisations - 1,
        ...(deleteTarget.suspended
          ? { suspendedOrganisations: s.suspendedOrganisations - 1 }
          : { activeOrganisations: s.activeOrganisations - 1 }),
      }));
      showToast(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Build plan distribution data for bar chart
  const planChartData = stats ? PLANS.map(p => ({
    name: PLAN_LABEL[p],
    value: { FREE: stats.freeOrgs, STARTER: stats.starterOrgs, GROWTH: stats.growthOrgs, PRO: stats.proOrgs, ACCOUNTANT_PRO: stats.accountantProOrgs }[p] ?? 0,
    fill: PLAN_COLORS[p],
  })) : [];

  // Active vs suspended donut
  const donutData = stats ? [
    { name: "Active",    value: stats.activeOrganisations,    fill: "#10b981" },
    { name: "Suspended", value: stats.suspendedOrganisations, fill: "#f43f5e" },
  ] : [];

  const StatCard = ({ label, value, icon: Icon, color, sub }) => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value ?? "—"}</p>
          {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
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
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all organisations on LumiLedger.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Orgs"  value={stats?.totalOrganisations}     icon={Building2}   color="bg-gradient-to-br from-blue-600 to-indigo-600" />
        <StatCard label="Active"      value={stats?.activeOrganisations}    icon={CheckCircle} color="bg-gradient-to-br from-emerald-500 to-teal-500" />
        <StatCard label="Suspended"   value={stats?.suspendedOrganisations} icon={XCircle}     color="bg-gradient-to-br from-rose-500 to-pink-500" />
        <StatCard label="Total Users" value={stats?.totalUsers}             icon={Users}       color="bg-gradient-to-br from-violet-500 to-purple-600" />
        <StatCard label="Invoices"    value={stats?.totalInvoices}          icon={FileText}    color="bg-gradient-to-br from-amber-500 to-orange-500" />
        <StatCard label="Projects"    value={stats?.totalProjects}          icon={FolderOpen}  color="bg-gradient-to-br from-cyan-500 to-sky-600" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Signups trend */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">New Signups — Last 6 Months</p>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats?.signupsByMonth ?? []} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="count" name="Signups" stroke="#3b82f6" strokeWidth={2} fill="url(#signupGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Active vs Suspended donut */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Org Status</p>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="45%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value">
                  {donutData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Plan distribution bar chart */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Plan Distribution</p>
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-slate-200 border-t-blue-600" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={planChartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="value" name="Orgs" radius={[6, 6, 0, 0]}>
                {planChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Registrations */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Recent Registrations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Organisation</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Users</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center"><div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-slate-200 border-t-blue-600" /></td></tr>
              ) : recent.map(org => (
                <tr key={org.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {org.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-xs">{org.name}</p>
                        {org.email && <p className="text-xs text-slate-400">{org.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{fmtDate(org.createdAt)}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${PLAN_STYLE[org.plan] ?? PLAN_STYLE.FREE}`}>
                      {PLAN_LABEL[org.plan] ?? "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-600 dark:text-slate-300">{org.userCount}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-600 dark:text-slate-300">{org.invoiceCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Organisations */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">All Organisations</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{orgs.length} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600" />
          </div>
        ) : orgs.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500 text-sm">No organisations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Organisation</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Users</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Clients</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Invoices</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden xl:table-cell">Projects</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {orgs.map(org => (
                  <OrgRow
                    key={org.id}
                    org={org}
                    isOwnOrg={currentOrgId && org.id === currentOrgId}
                    onSuspend={setSuspendTarget}
                    onUnsuspend={doUnsuspend}
                    onDelete={setDeleteTarget}
                    onPlanChange={changePlan}
                  />
                ))}
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

      <ConfirmModal
        visible={!!deleteTarget}
        title="Delete Organisation"
        message={`Permanently delete "${deleteTarget?.name}"? This will remove all users, invoices, clients, and data. This cannot be undone.`}
        onConfirm={doDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default SuperAdmin;
