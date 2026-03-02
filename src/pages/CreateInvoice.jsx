import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowRight, Plus, Trash2 } from "lucide-react";

function CreateInvoice() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    clientId: "",
    issueDate: today,
    dueDate: "",
    tax: 0,
    items: [{ description: "", quantity: 1, unitPrice: 0 }]
  });

  useEffect(() => {
    api.get("api/clients")
      .then(res => setClients(res.data))
      .catch(err => console.error(err));
  }, []);

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

  const subtotal = form.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const total = subtotal + Number(form.tax || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("api/invoices", form);
      navigate("/");
    } catch (err) {
      console.error("CREATE INVOICE ERROR:", err.response?.data || err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back
          </button>

          <h1 className="text-xl font-semibold text-slate-900">
            Create Invoice
          </h1>

          <div></div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Client + Dates */}
            <div className="grid md:grid-cols-3 gap-6">

              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <select
                  value={form.clientId}
                  onChange={(e) =>
                    setForm({ ...form, clientId: e.target.value })
                  }
                  required
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Issue Date</label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) =>
                    setForm({ ...form, issueDate: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  required
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Invoice Items</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 text-blue-600 text-sm hover:underline"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              {form.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 mb-4 items-center"
                >
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    className="col-span-5 border rounded-xl px-3 py-2"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", Number(e.target.value))
                    }
                    className="col-span-2 border rounded-xl px-3 py-2"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", Number(e.target.value))
                    }
                    className="col-span-3 border rounded-xl px-3 py-2"
                    required
                  />

                  <div className="col-span-1 text-sm font-medium text-slate-700">
                    ₦ {(item.quantity * item.unitPrice).toLocaleString()}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="col-span-1 flex justify-center text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-6 space-y-4">

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₦ {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span>Tax</span>
                <input
                  type="number"
                  value={form.tax}
                  onChange={(e) =>
                    setForm({ ...form, tax: Number(e.target.value) })
                  }
                  className="border rounded-lg px-3 py-1 w-32 text-right"
                />
              </div>

              <div className="flex justify-between text-lg font-semibold border-t pt-4">
                <span>Total</span>
                <span>₦ {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-md"
            >
              {isLoading ? "Creating Invoice..." : "Create Invoice"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateInvoice;