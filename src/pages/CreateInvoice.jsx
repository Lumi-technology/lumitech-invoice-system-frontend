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
  FileText,
  Receipt,
} from "lucide-react";

function CreateInvoice() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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

  const subtotal = form.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const total = subtotal + Number(form.tax || 0);

  useEffect(() => {
    if (total > 0 && error) setError("");
  }, [total, error]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { description: "", quantity: 1, unitPrice: 0 }] });
  };

  const removeItem = (index) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (total <= 0) { setError("Invoice total must be greater than zero."); return; }
    setIsLoading(true);
    setError("");
    try {
      await api.post("api/invoices", { ...form, projectId: form.projectId || null });
      navigate("/invoices");
    } catch (err) {
      console.error("CREATE INVOICE ERROR:", err.response?.data || err);
      setError("Failed to create invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-6 h-6 text-blue-600" />
              New Invoice
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Fill in the details below to create an invoice.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 1 — Invoice Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Invoice Details
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Client */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="w-4 h-4 text-slate-400" />
                Client <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.clientId}
                onChange={e => setForm({ ...form, clientId: e.target.value })}
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
              >
                <option value="">Select a client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Project */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FolderOpen className="w-4 h-4 text-slate-400" />
                Project
                <span className="text-xs text-slate-400 font-normal ml-1">(optional)</span>
              </label>
              <select
                value={form.projectId}
                onChange={e => setForm({ ...form, projectId: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
              >
                <option value="">No project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {/* Issue Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400" />
                Issue Date
              </label>
              <input
                type="date"
                value={form.issueDate}
                onChange={e => setForm({ ...form, issueDate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400" />
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
              />
            </div>

          </div>
        </div>

        {/* Section 2 — Line Items */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-500" />
              Line Items
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-sm"
            >
              <Plus size={14} />
              Add Item
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Column headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-3">Unit Price</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1" />
            </div>

            {form.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition"
              >
                {/* Description */}
                <div className="md:col-span-5">
                  <label className="md:hidden text-xs font-medium text-slate-500 mb-1.5 block">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Website design, Consulting…"
                    value={item.description}
                    onChange={e => handleItemChange(index, "description", e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
                  />
                </div>

                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="md:hidden text-xs font-medium text-slate-500 mb-1.5 block">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="1"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, "quantity", Number(e.target.value))}
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-center"
                  />
                </div>

                {/* Unit Price */}
                <div className="md:col-span-3">
                  <label className="md:hidden text-xs font-medium text-slate-500 mb-1.5 block">Unit Price (₦)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₦</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={item.unitPrice}
                      onChange={e => handleItemChange(index, "unitPrice", Number(e.target.value))}
                      required
                      className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
                    />
                  </div>
                </div>

                {/* Line total */}
                <div className="md:col-span-1 text-right">
                  <label className="md:hidden text-xs font-medium text-slate-500 mb-1 block">Total</label>
                  <span className="text-sm font-semibold text-slate-900">
                    ₦{(item.quantity * item.unitPrice).toLocaleString()}
                  </span>
                </div>

                {/* Remove */}
                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={form.items.length === 1}
                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 — CC + Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CC Emails */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                CC Recipients
                <span className="text-xs text-slate-400 font-normal">(optional)</span>
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter email and press Enter"
                    value={ccInput}
                    onChange={e => setCcInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCcEmail(); } }}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={addCcEmail}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition"
                >
                  Add
                </button>
              </div>
              {form.ccEmails.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {form.ccEmails.map(email => (
                    <span key={email} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
                      {email}
                      <button type="button" onClick={() => removeCcEmail(email)} className="hover:text-blue-900 transition">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No CC recipients added yet.</p>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Tax</span>
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₦</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.tax}
                    onChange={e => setForm({ ...form, tax: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-right"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-base font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pb-4">
          <button
            type="submit"
            disabled={isLoading || total <= 0}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Save size={17} />
                Create Invoice
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default CreateInvoice;
