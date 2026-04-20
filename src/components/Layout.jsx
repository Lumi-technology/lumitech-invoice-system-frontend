// Layout.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import OnboardingBanner from "./OnboardingBanner";
import TrialBanner from "./TrialBanner";
import NotificationBell from "./NotificationBell";
import { Menu } from "lucide-react";

const PAGE_TITLES = {
  "/dashboard":                          "Dashboard",
  "/invoices":                           "Invoices",
  "/create":                             "New Invoice",
  "/clients":                            "Customers",
  "/clients/create":                     "New Customer",
  "/projects":                           "Projects",
  "/finance":                            "Finance",
  "/staff-home":                         "Home",
  "/expenses":                           "Expenses",
  "/expenses/manage":                    "Manage Expenses",
  "/team":                               "Team",
  "/settings/org":                       "Org Settings",
  "/settings/billing":                   "Billing",
  "/audit":                              "Audit Trail",
  "/accounting/accounts":                "Chart of Accounts",
  "/accounting/entries":                 "Journal Entries",
  "/accounting/import":                  "Import Statement",
  "/accounting/reconciliation":          "Reconciliation",
  "/accounting/reports/trial-balance":   "Trial Balance",
  "/accounting/reports/profit-loss":     "Profit & Loss",
  "/accounting/reports/balance-sheet":   "Balance Sheet",
  "/invoices/reports/aging":             "Aging Report",
  "/invoices/reports/tax":               "Tax Report",
  "/admin":                              "Platform Admin",
};

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? "LumiLedger";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Navbar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0"
          >
            <Menu size={22} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-sm shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white truncate">{pageTitle}</span>
          </div>
          <NotificationBell />
        </div>

        <TrialBanner />
        <OnboardingBanner />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
