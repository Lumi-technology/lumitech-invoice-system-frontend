import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceList from "./pages/InvoiceList";
import CreateClient from "./pages/CreateClient";
import InvoiceDetail from "./pages/InvoiceDetail";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ClientList from "./pages/ClientList";
import ClientDetail from "./pages/ClientDetail";
import ClientPortal from "./pages/ClientPortal";
import Landing from "./pages/Landing";
import OrgSettings from "./pages/OrgSettings";
import Register from "./pages/Register";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";
import SuperAdmin from "./pages/SuperAdmin";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Billing from "./pages/Billing";
import Finance from "./pages/Finance";
import Team from "./pages/Team";

function App() {
  const [planLimitMessage, setPlanLimitMessage] = useState(null);
  const [isSuspended, setIsSuspended] = useState(false);

  useEffect(() => {
    const onPlanLimit = (e) => setPlanLimitMessage(e.detail);
    const onSuspended = () => setIsSuspended(true);
    window.addEventListener("plan-limit", onPlanLimit);
    window.addEventListener("account-suspended", onSuspended);
    return () => {
      window.removeEventListener("plan-limit", onPlanLimit);
      window.removeEventListener("account-suspended", onSuspended);
    };
  }, []);

  return (
    <>
      {/* Account Suspended — full-screen block */}
      {isSuspended && (
        <div className="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="inline-flex p-4 bg-rose-600/20 rounded-full mb-6">
              <svg className="w-12 h-12 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Account Suspended</h1>
            <p className="text-slate-400 mb-8">
              Your organisation has been suspended. Please contact support to restore access.
            </p>
            <a
              href="mailto:support@lumitechsystems.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
            >
              Contact Support
            </a>
          </div>
        </div>
      )}

      {/* Plan Limit — modal banner */}
      {planLimitMessage && (
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-8 text-center">
            <div className="inline-flex p-4 bg-amber-100 rounded-full mb-5">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Plan Limit Reached</h2>
            <p className="text-slate-600 mb-6">{planLimitMessage}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setPlanLimitMessage(null)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Dismiss
              </button>
              <button
                onClick={() => { setPlanLimitMessage(null); window.location.href = "/settings/billing"; }}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <BrowserRouter>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* INVOICE LIST */}
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <Layout>
                  <InvoiceList />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* CREATE INVOICE */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateInvoice />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* INVOICE DETAILS */}
          <Route
            path="/invoices/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <InvoiceDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* CREATE CLIENT */}
          <Route
            path="/clients/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateClient />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <Layout>
                  <ClientList />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* CLIENT DETAIL */}
          <Route
            path="/clients/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ClientDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ORG SETTINGS */}
          <Route
            path="/settings/org"
            element={
              <ProtectedRoute>
                <Layout>
                  <OrgSettings />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* PROJECTS */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProjectList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProjectDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* FINANCE */}
          <Route
            path="/finance"
            element={
              <ProtectedRoute>
                <Layout>
                  <Finance />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* BILLING */}
          <Route
            path="/settings/billing"
            element={
              <ProtectedRoute>
                <Layout>
                  <Billing />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* TEAM */}
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <Layout>
                  <Team />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* PLATFORM ADMIN */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute>
                <Layout>
                  <SuperAdmin />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout>
                  <SuperAdmin />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* CLIENT PORTAL — public, no auth */}
          <Route path="/portal/:token" element={<ClientPortal />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
