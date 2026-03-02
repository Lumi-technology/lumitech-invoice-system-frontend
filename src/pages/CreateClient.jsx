import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowRight, UserPlus } from "lucide-react";

function CreateClient() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("api/clients", form);
      navigate("/"); // back to invoice list
    } catch (err) {
      console.error("CREATE CLIENT ERROR:", err.response?.data || err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back
          </button>

          <h1 className="text-xl font-semibold text-slate-900">
            Create Customer
          </h1>

          <div></div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Address
              </label>
              <textarea
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                rows="3"
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              {isLoading ? "Creating..." : "Create Customer"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateClient;