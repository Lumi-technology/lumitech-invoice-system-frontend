// CreateInvoice.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  User,
  Save,
  Mail,
  X,
  FolderOpen,
} from "lucide-react";

function CreateInvoice() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // validation error message
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [projects, setProjects] = useState([]);
  const [ccInput, setCcInput] = useState("");
  const [form, setForm] = useState({
    clientId: "",
    projectId: "",
    issueDate: today,
    dueDate: "",
    tax: 0,
    ccEmails: [],
    items: [{ description: "", quantity: 1, unitPrice: 0 }]
  });

  const addCcEmail = () => {
    const email = ccInput.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (form.ccEmails.includes(email)) return;
    setForm({ ...form, ccEmails: [...form.ccEmails, email] });
    setCcInput("");
  };

  const removeCcEmail = (email) => {
    setForm({ ...form, ccEmails: form.ccEmails.filter(e => e !== email) });
  };

  useEffect(() => {
    api.get("api/clients", { params: { page: 0, size: 100 } })
      .then(res => setClients(res.data.content))
      .catch(err => console.error(err));
    api.get("/api/projects", { params: { page: 0, size: 100 } })
      .then(res => setProjects(res.data.content ?? res.data ?? []))
      .catch(() => {});
  }, []);

  // Calculate subtotal and total
  const subtotal = form.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const total = subtotal + Number(form.tax || 0);

  // Clear error when total becomes valid
  useEffect(() => {
    if (total > 0 && error) {
      setError("");
    }
  }, [total, error]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", quantity: 1, unitPrice: 0 }]
    });
  };

  const removeItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: total must be greater than zero
    if (total <= 0) {
      setError("Invoice total must be greater than zero.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.post("api/invoices", {
        ...form,
        projectId: form.projectId || null,
      });
      navigate("/");
    } catch (err) {
      console.error("CREATE INVOICE ERROR:", err.response?.data || err);
      setError("Failed to create invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sticky Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-slate-900">
              Create New Invoice
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Form Card */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Client & Dates Section */}
            <div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Invoice Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Select */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <User className="w-4 h-4 text-slate-400" />
                    Client
                  </label>
                  <select
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    <option value="">Select a client</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Select (optional) */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FolderOpen className="w-4 h-4 text-slate-400" />
                    Project <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <select
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    <option value="">No project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Issue Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* CC Emails Section */}
            <div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                CC Recipients <span className="normal-case font-normal text-slate-400">(optional)</span>
              </h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Enter email and press Enter"
                      value={ccInput}
                      onChange={(e) => setCcInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCcEmail(); } }}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addCcEmail}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                {form.ccEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.ccEmails.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => removeCcEmail(email)}
                          className="hover:text-blue-900 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Items Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Invoice Items
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              {/* Items Table Header (hidden on mobile) */}
              <div className="hidden md:grid grid-cols-12 gap-4 mb-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-3">Unit Price (₦)</div>
                <div className="col-span-1">Total</div>
                <div className="col-span-1" />
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {form.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start md:items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100"
                  >
                    {/* Description */}
                    <div className="md:col-span-5">
                      <label className="md:hidden text-xs text-slate-500 mb-1 block">Description</label>
                      <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2">
                      <label className="md:hidden text-xs text-slate-500 mb-1 block">Quantity</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="md:col-span-3">
                      <label className="md:hidden text-xs text-slate-500 mb-1 block">Unit Price (₦)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₦</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, "unitPrice", Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                          required
                        />
                      </div>
                    </div>

                    {/* Line Total (read-only) */}
                    <div className="md:col-span-1">
                      <label className="md:hidden text-xs text-slate-500 mb-1 block">Line Total</label>
                      <div className="flex items-center justify-between md:justify-start">
                        <span className="text-sm font-medium text-slate-900">
                          ₦ {(item.quantity * item.unitPrice).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        disabled={form.items.length === 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Section */}
            <div className="border-t border-slate-100 pt-6">
              <div className="flex justify-end">
                <div className="w-full sm:w-72 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-900 font-medium">₦ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Tax (₦)</span>
                    <div className="relative w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₦</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.tax}
                        onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })}
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-right"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-base font-semibold border-t border-slate-200 pt-3">
                    <span className="text-slate-900">Total</span>
                    <span className="text-blue-600">₦ {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || total <= 0}
              className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Invoice...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Invoice
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateInvoice;