// Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  FolderOpen,
  ShieldCheck,
  CreditCard,
  Wallet,
  UsersRound,
} from "lucide-react";
import { useState, useEffect } from "react";
import api, { getUserFromToken } from "../services/api";

const PLAN_BADGE = {
  FREE:    "bg-slate-100 text-slate-500",
  STARTER: "bg-blue-100 text-blue-700",
  PRO:     "bg-indigo-100 text-indigo-700",
};

function Navbar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [plan, setPlan] = useState(null);
  const user = getUserFromToken();
  const role = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : null);

  const isActive = (path) => location.pathname === path;

  const isPlatformAdmin =
    role === "PLATFORM_ADMIN" ||
    (Array.isArray(user?.roles) && user.roles.includes("PLATFORM_ADMIN"));

  useEffect(() => {
    if (!user) return;
    api.get("/api/billing/status")
      .then(res => setPlan(res.data.plan ?? null))
      .catch(() => {});
  }, []);

  const navItems = [
    { path: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
    { path: "/invoices",     label: "Invoices",     icon: FileText },
    { path: "/create",       label: "New Invoice",  icon: PlusCircle },
    { path: "/projects",     label: "Projects",     icon: FolderOpen },
    { path: "/clients/create", label: "New Customer", icon: Users },
    { path: "/clients",      label: "Customers",    icon: Users },
    { path: "/finance",      label: "Finance",      icon: Wallet },
    { path: "/team",         label: "Team",         icon: UsersRound },
    { path: "/settings/org", label: "Org Settings", icon: Building2 },
    { path: "/settings/billing", label: "Billing",  icon: CreditCard },
    ...(isPlatformAdmin ? [{ path: "/admin", label: "Platform Admin", icon: ShieldCheck }] : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside
      className={`h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
        <div className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-slate-900">
              LumiCash<span className="text-blue-600">.</span>
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                )}
                {/* Plan badge next to Billing link */}
                {!collapsed && item.path === "/settings/billing" && plan && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive(item.path) ? "bg-white/20 text-white" : PLAN_BADGE[plan] ?? PLAN_BADGE.FREE
                  }`}>
                    {plan}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-200/60">
        {user && (
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{user.username}</p>
                <p className="text-xs text-slate-500 truncate">{role || "Member"}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`mt-3 flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Navbar;
