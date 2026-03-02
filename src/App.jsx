import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceList from "./pages/InvoiceList";
import CreateClient from "./pages/CreateClient";
import InvoiceDetail from "./pages/InvoiceDetail";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <InvoiceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateInvoice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices/:id"
          element={
            <ProtectedRoute>
              <InvoiceDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/create"
          element={
            <ProtectedRoute>
              <CreateClient />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;