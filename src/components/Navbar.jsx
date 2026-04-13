// Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, PlusCircle, Users, LogOut,
  ChevronLeft, ChevronRight, Building2, FolderOpen, ShieldCheck,
  CreditCard, Wallet, UsersRound, X, BookOpen, BookOpenCheck, Scale,
} from "lucide-react";
import { useState, useEffect } from "react";
import api, { getUserFromToken } from "../services/api";

const PLAN_BADGE = {
  FREE:    "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
  STARTER: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  PRO:     "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300",
};

function Navbar({ onClose }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [plan, setPlan] = useState(null);
  const user = getUserFromToken();
  const role = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : null);

  const isActive = (path) => location.pathname === path;
  const isPlatformAdmin = role === "PLATFORM_ADMIN" || (Array.isArray(user?.roles) && user.roles.includes("PLATFORM_ADMIN"));
  const isStaff = role === "STAFF";
  const isAdminOrStaff = role === "STAFF" || role === "ADMIN";

  useEffect(() => {
    if (!user) return;
    api.get("/api/billing/status")
      .then(res => setPlan(res.data.plan ?? null))
      .catch(() => {});
  }, []);

  const navItems = [
    ...(!isAdminOrStaff ? [{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] : []),
    { path: "/invoices",      label: "Invoices",      icon: FileText },
    { path: "/create",        label: "New Invoice",   icon: PlusCircle },
    { path: "/projects",      label: "Projects",      icon: FolderOpen },
    { path: "/clients/create",label: "New Customer",  icon: Users },
    { path: "/clients",       label: "Customers",     icon: Users },
    { path: "/finance",       label: "Finance",       icon: Wallet },
    { path: "/accounting/accounts", label: "Chart of Accounts", icon: BookOpen },
    { path: "/accounting/entries",  label: "Journal Entries",   icon: BookOpenCheck },
    { path: "/accounting/reports/trial-balance", label: "Trial Balance", icon: Scale },
    ...(!isStaff ? [{ path: "/team", label: "Team", icon: UsersRound }] : []),
    { path: "/settings/org",  label: "Org Settings",  icon: Building2 },
    { path: "/settings/billing", label: "Billing",    icon: CreditCard },
    ...(isPlatformAdmin ? [{ path: "/admin", label: "Platform Admin", icon: ShieldCheck }] : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className={`h-screen sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>

      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/20 flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              LumiCash<span className="text-blue-600">.</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Mobile close */}
          {onClose && !collapsed && (
            <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
              <X size={16} className="text-slate-500 dark:text-slate-400" />
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            {collapsed
              ? <ChevronRight size={18} className="text-slate-500 dark:text-slate-400" />
              : <ChevronLeft size={18} className="text-slate-500 dark:text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                  }`}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                  )}
                  {!collapsed && item.path === "/settings/billing" && plan && (
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/20 text-white" : PLAN_BADGE[plan] ?? PLAN_BADGE.FREE
                    }`}>
                      {plan}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60">
        {user && (
          <div className={`flex items-center gap-3 mb-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{user.username}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{role || "Member"}</p>
                  {plan && (
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${PLAN_BADGE[plan] ?? PLAN_BADGE.FREE}`}>
                      {plan}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 transition ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Navbar;
