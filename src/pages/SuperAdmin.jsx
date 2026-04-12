// SuperAdmin.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  ShieldCheck,
  Building2,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

const PLANS = ["FREE", "STARTER", "GROWTH", "ENTERPRISE"];

const PLAN_STYLE = {
  FREE:       "bg-slate-100 text-slate-600",
  STARTER:    "bg-blue-100 text-blue-700",
  GROWTH:     "bg-indigo-100 text-indigo-700",
  ENTERPRISE: "bg-purple-100 text-purple-700",
};

const STATUS_STYLE = {
  ACTIVE:    "bg-emerald-100 text-emerald-700",
  SUSPENDED: "bg-rose-100 text-rose-700",
};

function SuperAdmin() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [confirm, setConfirm] = useState({ visible: false, title: "", message: "", onConfirm: null, loading: false });

  const fetchOrgs = () => {
    setLoading(true);
    api.get("/api/superadmin/organisations")
      .then(res => setOrgs(res.data.content ?? res.data ?? []))
      .catch(() => setToast({ visible: true, message: "Failed to load organisations", type: "error" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrgs(); }, []);

  const changePlan = async (orgId, plan) => {
    try {
      await api.put(`/api/superadmin/organisations/${orgId}/plan`, { plan });
      setOrgs(prev => prev.map(o => o.id === orgId ? { ...o, plan } : o));
      setToast({ visible: true, message: `Plan updated to ${plan}`, type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update plan.";
      setToast({ visible: true, message: msg, type: "error" });
    }
  };

  const doSuspend = async (orgId) => {
    setConfirm(c => ({ ...c, loading: true }));
    try {
      await api.post(`/api/superadmin/organisations/${orgId}/suspend`);
      setOrgs(prev => prev.map(o => o.id === orgId ? { ...o, status: "SUSPENDED" } : o));
      setToast({ visible: true, message: "Organisation suspended", type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to suspend.";
      setToast({ visible: true, message: msg, type: "error" });
    } finally {
      setConfirm({ visible: false, title: "", message: "", onConfirm: null, loading: false });
    }
  };

  const doUnsuspend = async (orgId) => {
    try {
      await api.post(`/api/superadmin/organisations/${orgId}/unsuspend`);
      setOrgs(prev => prev.map(o => o.id === orgId ? { ...o, status: "ACTIVE" } : o));
      setToast({ visible: true, message: "Organisation restored", type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to unsuspend.";
      setToast({ visible: true, message: msg, type: "error" });
    }
  };

  const confirmSuspend = (org) => {
    setConfirm({
      visible: true,
      title: "Suspend Organisation",
      message: `Suspend "${org.name}"? Their users will lose access immediately.`,
      onConfirm: () => doSuspend(org.id),
      loading: false,
    });
  };

  // Stats derived from org list
  const total = orgs.length;
  const active = orgs.filter(o => o.status !== "SUSPENDED").length;
  const suspended = orgs.filter(o => o.status === "SUSPENDED").length;
  const byPlan = PLANS.reduce((acc, p) => {
    acc[p] = orgs.filter(o => o.plan === p).length;
    return acc;
  }, {});

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          Platform Admin
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage all organisations on LumiCash.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orgs" value={total} icon={Building2} color="bg-gradient-to-br from-blue-600 to-indigo-600" />
        <StatCard label="Active" value={active} icon={CheckCircle} color="bg-gradient-to-br from-emerald-500 to-teal-500" />
        <StatCard label="Suspended" value={suspended} icon={XCircle} color="bg-gradient-to-br from-rose-500 to-pink-500" />
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-6 col-span-2 lg:col-span-1">
          <p className="text-sm font-medium text-slate-500 mb-3">By Plan</p>
          <div className="space-y-1.5">
            {PLANS.map(p => (
              <div key={p} className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PLAN_STYLE[p]}`}>{p}</span>
                <span className="text-sm font-bold text-slate-900">{byPlan[p]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orgs Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">All Organisations</h2>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{total} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600" />
          </div>
        ) : orgs.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">No organisations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Organisation</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Users</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoices</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orgs.map(org => (
                  <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                          {org.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{org.name}</p>
                          {org.email && <p className="text-xs text-slate-400">{org.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[org.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {org.status ?? "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {/* Plan change dropdown */}
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
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {org.userCount ?? org.users ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {org.clientCount ?? org.clients ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {org.invoiceCount ?? org.invoices ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {org.status === "SUSPENDED" ? (
                        <button
                          onClick={() => doUnsuspend(org.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
                        >
                          <CheckCircle size={13} />
                          Unsuspend
                        </button>
                      ) : (
                        <button
                          onClick={() => confirmSuspend(org)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition"
                        >
                          <XCircle size={13} />
                          Suspend
                        </button>
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

      <ConfirmModal
        visible={confirm.visible}
        title={confirm.title}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm({ ...confirm, visible: false })}
        loading={confirm.loading}
      />
    </div>
  );
}

export default SuperAdmin;
