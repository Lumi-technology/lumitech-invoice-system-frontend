import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        {/* CLIENT PORTAL — public, no auth */}
        <Route path="/portal/:token" element={<ClientPortal />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;