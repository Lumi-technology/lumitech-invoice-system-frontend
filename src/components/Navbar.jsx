// Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, PlusCircle, Users, LogOut,
  ChevronLeft, ChevronRight, Building2, FolderOpen, ShieldCheck,
  CreditCard, Wallet, UsersRound, X, BookOpen, BookOpenCheck, Scale, TrendingUp, LayoutList, Landmark, ClipboardList,
  ChevronDown, Briefcase, Calculator, ArrowLeftRight, Banknote, PiggyBank, Lock, Receipt,
} from "lucide-react";
import { useState, useEffect } from "react";
import api, { getUserFromToken } from "../services/api";
import { getUserType, setUserType, getRegisteredAs, USER_TYPES, paymentLabel } from "../utils/userType";

const PLAN_BADGE = {
  FREE:           "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
  STARTER:        "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  GROWTH:         "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300",
  ACCOUNTANT_PRO: "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300",
};

// Plans that include Chart of Accounts + Journal Entries
// STARTER (Essential) does NOT include accounting tools
const ACCOUNTING_PLANS = new Set(["FREE", "GROWTH", "ACCOUNTANT_PRO"]);

function NavLink({ item, collapsed, onClick, isActive }) {
  const active = isActive(item.path);
  return (
    <li>
      <Link
        to={item.path}
        onClick={onClick}
        data-tour={
          item.path === "/create"   ? "new-invoice"  :
          item.path === "/invoices" ? "nav-invoices" :
          item.path === "/clients"  ? "nav-clients"  :
          item.path === "/invoices/reports/aging" ? "nav-reports" : undefined
        }
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
          active
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
        }`}
      >
        <item.icon size={20} className="flex-shrink-0" />
        {!collapsed && <span className="text-sm font-medium flex-1">{item.label}</span>}
      </Link>
    </li>
  );
}

function Navbar({ onClose }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [plan, setPlan] = useState(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [userType, setUserTypeState] = useState(getUserType());

  const user = getUserFromToken();
  const role = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : null);

  const isActive = (path) => location.pathname === path;
  const isPlatformAdmin = role === "PLATFORM_ADMIN" || (Array.isArray(user?.roles) && user.roles.includes("PLATFORM_ADMIN"));
  const isStaff = role === "STAFF";
  const isAdminOrStaff = role === "STAFF" || role === "ADMIN";
  const isAccountant = userType === USER_TYPES.ACCOUNTANT;

  // React to mode switches from other parts of the app
  useEffect(() => {
    const handler = () => setUserTypeState(getUserType());
    window.addEventListener("userTypeChange", handler);
    return () => window.removeEventListener("userTypeChange", handler);
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get("/api/billing/status")
      .then(res => setPlan(res.data.plan ?? null))
      .catch(() => {});
  }, []);

  // FREE = null means trial (full access); plan not yet loaded also means no restriction
  const canAccessAccountingTools = !plan || ACCOUNTING_PLANS.has(plan);

  // Only users who registered as accountant can toggle modes.
  // Business owners are permanently locked to business owner experience.
  const canSwitchMode = getRegisteredAs() === USER_TYPES.ACCOUNTANT;

  const handleSwitchMode = () => {
    const next = userType === USER_TYPES.BUSINESS_OWNER ? USER_TYPES.ACCOUNTANT : USER_TYPES.BUSINESS_OWNER;
    setUserType(next);
    setUserTypeState(next);
  };

  // ── Primary nav items shared by both modes ──────────────────────────────
  const coreItems = [
    ...(!isAdminOrStaff ? [{ path: "/dashboard",   label: "Dashboard",            icon: LayoutDashboard }] : []),
    { path: "/invoices",                            label: "Invoices",             icon: FileText },
    { path: "/create",                              label: "New Invoice",          icon: PlusCircle },
    { path: "/clients",                             label: "Customers",            icon: Users },
    { path: "/projects",                            label: "Projects",             icon: FolderOpen },
    // Collections (business owner) / Payments (accountant)
    { path: "/finance",                             label: paymentLabel("module"), icon: Banknote },
    // Capital — business owner primary, accountant secondary
    ...(!isAccountant ? [{ path: "/dashboard", label: "Capital", icon: PiggyBank }] : []),
  ];

  // ── Accounting items (always visible for accountants, hidden for biz owners) ──
  const accountingItems = [
    { path: "/accounting/accounts",                  label: "Chart of Accounts", icon: BookOpen },
    { path: "/accounting/entries",                   label: "Journal Entries",   icon: BookOpenCheck },
    { path: "/invoices/reports/aging",               label: "Aging Report",      icon: ClipboardList },
    { path: "/invoices/reports/tax",                 label: "Tax Report",        icon: Calculator },
    { path: "/accounting/reports/trial-balance",     label: "Trial Balance",     icon: Scale },
    { path: "/accounting/reports/profit-loss",       label: "Profit & Loss",     icon: TrendingUp },
    { path: "/accounting/reports/balance-sheet",     label: "Balance Sheet",     icon: LayoutList },
    ...(["SUPER_ADMIN", "ADMIN"].includes(role) ? [{ path: "/accounting/import", label: "Import Statement", icon: Landmark }] : []),
  ];

  // ── Reports visible in primary nav for business owners ──────────────────
  const reportItems = [
    { path: "/invoices/reports/aging",               label: "Aging Report",      icon: ClipboardList },
    { path: "/invoices/reports/tax",                 label: "Tax Report",        icon: Calculator },
    { path: "/accounting/reports/trial-balance",     label: "Trial Balance",     icon: Scale },
    { path: "/accounting/reports/profit-loss",       label: "Profit & Loss",     icon: TrendingUp },
    { path: "/accounting/reports/balance-sheet",     label: "Balance Sheet",     icon: LayoutList },
  ];

  const isAccountantPro = plan === "ACCOUNTANT_PRO";

  const bottomItems = [
    ...(isAccountantPro ? [{ path: "/expenses",  label: "Expenses",    icon: Receipt }] : []),
    ...(!isStaff ? [{ path: "/team",             label: "Team",        icon: UsersRound }] : []),
    { path: "/settings/org",                      label: "Org Settings", icon: Building2 },
    { path: "/settings/billing",                  label: "Billing",     icon: CreditCard },
    ...(isAccountantPro && !isStaff ? [{ path: "/audit", label: "Audit Trail", icon: ShieldCheck }] : []),
    ...(isPlatformAdmin ? [{ path: "/admin",      label: "Platform Admin", icon: ShieldCheck }] : []),
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
              LumiLedger<span className="text-blue-600">.</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
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
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">

        {/* Core items */}
        <ul className="space-y-1">
          {coreItems.map(item => (
            <NavLink key={item.path} item={item} collapsed={collapsed} onClick={onClose} isActive={isActive} />
          ))}
        </ul>

        {/* ── ACCOUNTANT: all accounting items inline ────────────────────── */}
        {isAccountant && (
          <>
            {!collapsed && (
              <p className="px-3 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Accounting</p>
            )}
            <ul className="space-y-1">
              {accountingItems
                .filter(item => {
                  // Gate Chart of Accounts + Journal Entries + Bank Import by plan
                  const restricted = ["/accounting/accounts", "/accounting/entries", "/accounting/import"];
                  return canAccessAccountingTools || !restricted.includes(item.path);
                })
                .map(item => (
                  <NavLink key={item.path} item={item} collapsed={collapsed} onClick={onClose} isActive={isActive} />
                ))}
            </ul>
            {/* Show upgrade nudge for restricted items if on STARTER */}
            {!canAccessAccountingTools && !collapsed && (
              <Link
                to="/settings/billing"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 mx-0 rounded-xl border border-dashed border-slate-600 text-slate-500 hover:border-indigo-400 hover:text-indigo-400 transition text-xs mt-1"
              >
                <Lock size={12} />
                Chart of Accounts &amp; Journal Entries
                <span className="ml-auto text-indigo-400 font-semibold">Upgrade</span>
              </Link>
            )}
          </>
        )}

        {/* ── BUSINESS OWNER: reports visible, advanced collapsed ─────────── */}
        {!isAccountant && (
          <>
            {!collapsed && (
              <p className="px-3 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reports</p>
            )}
            <ul className="space-y-1">
              {reportItems.map(item => (
                <NavLink key={item.path} item={item} collapsed={collapsed} onClick={onClose} isActive={isActive} />
              ))}
            </ul>

            {/* Advanced Accounting — gated by plan */}
            {canAccessAccountingTools ? (
              /* Unlocked: collapsible section */
              !collapsed ? (
                <div className="pt-2">
                  <button
                    onClick={() => setAdvancedOpen(o => !o)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition text-sm font-medium"
                  >
                    <span>Advanced Accounting</span>
                    <ChevronDown size={14} className={`transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                  </button>
                  {advancedOpen && (
                    <ul className="space-y-1 mt-1 pl-2">
                      {[
                        { path: "/accounting/accounts", label: "Chart of Accounts", icon: BookOpen },
                        { path: "/accounting/entries",  label: "Journal Entries",   icon: BookOpenCheck },
                        ...(["SUPER_ADMIN", "ADMIN"].includes(role) ? [{ path: "/accounting/import", label: "Import Statement", icon: Landmark }] : []),
                      ].map(item => (
                        <NavLink key={item.path} item={item} collapsed={false} onClick={onClose} isActive={isActive} />
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <ul className="space-y-1 pt-1">
                  {[
                    { path: "/accounting/accounts", label: "Chart of Accounts", icon: BookOpen },
                    { path: "/accounting/entries",  label: "Journal Entries",   icon: BookOpenCheck },
                  ].map(item => (
                    <NavLink key={item.path} item={item} collapsed={true} onClick={onClose} isActive={isActive} />
                  ))}
                </ul>
              )
            ) : (
              /* Locked: upgrade prompt */
              !collapsed ? (
                <div className="pt-2">
                  <Link
                    to="/settings/billing"
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-indigo-400 hover:text-indigo-500 transition text-sm group"
                  >
                    <Lock size={14} className="flex-shrink-0" />
                    <span className="flex-1">Advanced Accounting</span>
                    <span className="text-xs font-semibold text-indigo-500 group-hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full">
                      Upgrade
                    </span>
                  </Link>
                  <p className="px-3 mt-1.5 text-xs text-slate-400">
                    Chart of Accounts &amp; Journal Entries — available on Business plan
                  </p>
                </div>
              ) : (
                <div className="pt-1">
                  <Link
                    to="/settings/billing"
                    onClick={onClose}
                    title="Upgrade for Advanced Accounting"
                    className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
                  >
                    <Lock size={16} />
                  </Link>
                </div>
              )
            )}
          </>
        )}

        {/* Bottom items */}
        {!collapsed && (
          <p className="px-3 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Settings</p>
        )}
        <ul className="space-y-1">
          {bottomItems.map(item => {
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
                    <>
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      {item.path === "/settings/billing" && plan && (
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                          active ? "bg-white/20 text-white" : PLAN_BADGE[plan] ?? PLAN_BADGE.FREE
                        }`}>
                          {{ FREE: "Trial", STARTER: "Essential", GROWTH: "Business", ACCOUNTANT_PRO: "Pro" }[plan] ?? plan}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile + Mode Switch */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60">
        {user && !collapsed && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{user.username}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  isAccountant
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                    : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                }`}>
                  {isAccountant ? <Calculator size={10} /> : <Briefcase size={10} />}
                  {isAccountant ? "Accountant" : "Business Owner"}
                </span>
              </div>
            </div>
          </div>
        )}
        {user && collapsed && (
          <div className="flex justify-center mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        )}

        {/* Switch Mode — only available for accountant-registered users */}
        {canSwitchMode && (
          <button
            onClick={handleSwitchMode}
            title={`Switch to ${isAccountant ? "Business Owner" : "Accountant"} view`}
            className={`flex items-center gap-3 px-3 py-2 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition mb-1 ${collapsed ? "justify-center" : ""}`}
          >
            <ArrowLeftRight size={16} />
            {!collapsed && (
              <span className="text-xs font-medium">
                Switch to {isAccountant ? "Business Owner" : "Accountant"} view
              </span>
            )}
          </button>
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
