// Inventory.jsx — Product management
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Plus, Search, Edit2, Trash2, Package, AlertTriangle, X, Check,
  Barcode, Tag, RefreshCw, ChevronDown,
} from "lucide-react";
import Toast from "../components/Toast";

const fmt = (v) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(v || 0);
const UNITS = ["unit", "piece", "kg", "litre", "pack", "carton", "dozen", "bottle", "bag", "box"];
const CATS  = ["Electronics", "Food & Drinks", "Clothing", "Beauty", "Health", "Office", "Household", "Automotive", "Stationery", "Other"];

const emptyForm = () => ({
  name: "", sku: "", barcode: "", description: "", price: "",
  costPrice: "", quantityInStock: 0, lowStockThreshold: 5, category: "", unit: "unit",
});

const inputCls = "w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock]  = useState([]);
  const [loading, setLoading]    = useState(true);
  const [search, setSearch]      = useState("");
  const [showForm, setShowForm]  = useState(false);
  const [editing, setEditing]    = useState(null);
  const [form, setForm]          = useState(emptyForm());
  const [saving, setSaving]      = useState(false);
  const [toast, setToast]        = useState({ visible: false, message: "", type: "info" });
  const [page, setPage]          = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const notify = (message, type = "success") => setToast({ visible: true, message, type });

  const load = async (p = 0) => {
    setLoading(true);
    try {
      const [prodRes, lowRes] = await Promise.all([
        api.get(`/api/inventory/products?page=${p}&size=30`),
        api.get("/api/inventory/products/low-stock"),
      ]);
      setProducts(prodRes.data.content || []);
      setTotalPages(prodRes.data.totalPages || 1);
      setLowStock(lowRes.data || []);
    } catch { notify("Failed to load inventory", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const doSearch = async (q) => {
    if (!q.trim()) { load(0); return; }
    try {
      const res = await api.get(`/api/inventory/products/search?q=${encodeURIComponent(q)}`);
      setProducts(res.data || []);
      setTotalPages(1);
    } catch { notify("Search failed", "error"); }
  };

  useEffect(() => {
    const t = setTimeout(() => doSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit   = (p)  => {
    setEditing(p.id);
    setForm({
      name: p.name || "", sku: p.sku || "", barcode: p.barcode || "",
      description: p.description || "", price: p.price || "",
      costPrice: p.costPrice || "", quantityInStock: p.quantityInStock,
      lowStockThreshold: p.lowStockThreshold, category: p.category || "", unit: p.unit || "unit",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { notify("Name and price are required", "error"); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), costPrice: form.costPrice ? parseFloat(form.costPrice) : null };
      if (editing) {
        await api.put(`/api/inventory/products/${editing}`, payload);
        notify("Product updated");
      } else {
        await api.post("/api/inventory/products", payload);
        notify("Product added");
      }
      setShowForm(false);
      load(page);
    } catch (e) {
      notify(e.response?.data?.message || "Failed to save product", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from inventory?`)) return;
    try {
      await api.delete(`/api/inventory/products/${id}`);
      notify("Product removed");
      load(page);
    } catch { notify("Failed to remove product", "error"); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, visible: false }))} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" /> Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your products and stock levels</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Low stock banner */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {lowStock.length} product{lowStock.length > 1 ? "s" : ""} running low on stock
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              {lowStock.map(p => `${p.name} (${p.quantityInStock} left)`).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, SKU or barcode…"
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading…</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500">No products yet. Add your first product to get started.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  {["Product", "SKU / Barcode", "Price", "Cost", "Stock", "Category", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800 dark:text-white">{p.name}</p>
                      {p.description && <p className="text-xs text-slate-400 truncate max-w-[180px]">{p.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      <span className="font-mono text-xs">{p.sku || "—"}</span>
                      {p.barcode && <span className="block font-mono text-xs text-slate-400">{p.barcode}</span>}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{fmt(p.price)}</td>
                    <td className="px-4 py-3 text-slate-500">{p.costPrice ? fmt(p.costPrice) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        p.lowStock
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {p.lowStock && <AlertTriangle className="w-3 h-3" />}
                        {p.quantityInStock} {p.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{p.category || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                className="px-4 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-slate-50 transition">Prev</button>
              <span className="px-3 py-1.5 text-sm text-slate-500">{page + 1} / {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                className="px-4 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-slate-50 transition">Next</button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Product Name *</label>
                <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Indomie Noodles" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Selling Price (₦) *</label>
                  <input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0" min="0" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Cost Price (₦)</label>
                  <input type="number" value={form.costPrice} onChange={e => set("costPrice", e.target.value)} placeholder="Optional" min="0" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Quantity in Stock</label>
                  <input type="number" value={form.quantityInStock} onChange={e => set("quantityInStock", parseInt(e.target.value) || 0)} min="0" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Low Stock Alert Below</label>
                  <input type="number" value={form.lowStockThreshold} onChange={e => set("lowStockThreshold", parseInt(e.target.value) || 0)} min="0" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">SKU</label>
                  <input value={form.sku} onChange={e => set("sku", e.target.value)} placeholder="e.g. IND-001" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Barcode</label>
                  <input value={form.barcode} onChange={e => set("barcode", e.target.value)} placeholder="e.g. 6001234567890" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                  <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls}>
                    <option value="">Select category</option>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Unit</label>
                  <select value={form.unit} onChange={e => set("unit", e.target.value)} className={inputCls}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  rows={2} placeholder="Optional short description" className={inputCls + " resize-none"} />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-slate-100 dark:border-slate-700">
              <button onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition flex items-center justify-center gap-2">
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editing ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
