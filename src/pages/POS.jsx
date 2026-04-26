// POS.jsx — Point of Sale terminal
import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import {
  Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle,
  X, Barcode, RefreshCw, Printer, Mail, User, Download,
  Bluetooth, Usb, Settings, Wifi,
} from "lucide-react";
import Toast from "../components/Toast";
import {
  printReceiptBrowser,
  connectUSBPrinter, printReceiptUSB,
  connectBluetoothPrinter, printReceiptBluetooth,
  isWebUSBSupported, isWebBluetoothSupported,
} from "../utils/thermalPrint";

const fmt = (v) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(v || 0);
const PAYMENT_METHODS = ["CASH", "TRANSFER", "CARD", "POS_TERMINAL"];

// ── Printer Setup Modal ───────────────────────────────────────────────────
function PrinterSetupModal({ orgName, onClose }) {
  const [usbDevice, setUsbDevice]   = useState(null);
  const [btConn, setBtConn]         = useState(null);
  const [connectingType, setConnectingType] = useState(null); // "usb" | "bt" | "test" | null
  const [connectStep, setConnectStep]       = useState("");   // progress message
  const [error, setError]           = useState("");

  const handleConnectUSB = async () => {
    setConnectingType("usb");
    setError("");
    setConnectStep("Opening device picker… select your printer.");
    try {
      const device = await connectUSBPrinter();
      setConnectStep("Printer found — saving connection…");
      await new Promise(r => setTimeout(r, 400));
      setUsbDevice(device);
      setConnectStep("Connected: " + (device.productName || "USB Thermal Printer"));
    } catch (e) {
      setError(e.message.includes("No device") || e.message.includes("cancelled")
        ? "No printer selected. Try again." : e.message);
      setConnectStep("");
    } finally { setConnectingType(null); }
  };

  const handleConnectBT = async () => {
    setConnectingType("bt");
    setError("");
    setConnectStep("Scanning for Bluetooth printers nearby…");
    try {
      setConnectStep("Select your printer from the browser popup.");
      const conn = await connectBluetoothPrinter();
      setConnectStep("Pairing with " + conn.device.name + "…");
      await new Promise(r => setTimeout(r, 500));
      setBtConn(conn);
      setConnectStep("Connected: " + conn.device.name);
    } catch (e) {
      setError(e.message.includes("cancelled") || e.message.includes("chosen")
        ? "No printer selected. Make sure Bluetooth is on and try again." : e.message);
      setConnectStep("");
    } finally { setConnectingType(null); }
  };

  const handleTestPrint = async () => {
    setConnectingType("test");
    setError("");
    setConnectStep("Sending test receipt…");
    const testReceipt = {
      receiptNumber: "TEST-001", saleDate: new Date().toISOString(),
      paymentMethod: "CASH", customerName: "Test Customer",
      total: 5000, discount: 0,
      items: [{ productName: "Test Item", quantity: 1, unitPrice: 5000, subtotal: 5000 }],
    };
    try {
      if (usbDevice)      { await printReceiptUSB(usbDevice, testReceipt, orgName); setConnectStep("Test receipt sent to USB printer ✓"); }
      else if (btConn)    { await printReceiptBluetooth(btConn, testReceipt, orgName); setConnectStep("Test receipt sent to Bluetooth printer ✓"); }
      else                { printReceiptBrowser(testReceipt, orgName); setConnectStep("Browser print dialog opened ✓"); }
    } catch (e) {
      setError("Print error: " + e.message);
      setConnectStep("");
    } finally { setConnectingType(null); }
  };

  const isConnected = usbDevice || btConn;
  const isBusy = connectingType !== null;

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9998,
        background: "rgba(0,0,0,0.5)",
      }} onClick={!isBusy ? onClose : undefined} />

      {/* Card */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        width: "280px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        border: "1px solid #e2e8f0",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 12px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Printer size={15} style={{ color: "#2563eb" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Printer Setup</span>
          </div>
          <button onClick={onClose} disabled={isBusy} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 2, opacity: isBusy ? 0.4 : 1 }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Status */}
          {isBusy && connectStep && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe" }}>
              <div style={{ width: 12, height: 12, border: "2px solid #2563eb", borderTopColor: "transparent", borderRadius: "50%", flexShrink: 0, animation: "spin 0.7s linear infinite" }} />
              <span style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 500 }}>{connectStep}</span>
            </div>
          )}
          {!isBusy && isConnected && connectStep && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
              <CheckCircle size={12} style={{ color: "#16a34a", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#15803d", fontWeight: 500 }}>{connectStep}</span>
            </div>
          )}
          {error && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", background: "#fff1f2", borderRadius: 8, border: "1px solid #fecdd3" }}>
              <X size={12} style={{ color: "#e11d48", flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 11, color: "#be123c" }}>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <button onClick={handleTestPrint} disabled={isBusy} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            padding: "9px 12px", borderRadius: 8, border: "1px solid #dbeafe",
            background: "#eff6ff", cursor: isBusy ? "not-allowed" : "pointer",
            opacity: isBusy ? 0.5 : 1, textAlign: "left",
          }}>
            <Wifi size={13} style={{ color: "#2563eb", flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1e40af" }}>
              {connectingType === "test" ? "Sending…" : "Test Print (Browser)"}
            </span>
          </button>

          {isWebUSBSupported() && (
            <button onClick={handleConnectUSB} disabled={isBusy} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "9px 12px", borderRadius: 8, border: usbDevice ? "1px solid #bbf7d0" : "1px solid #e9d5ff",
              background: usbDevice ? "#f0fdf4" : "#faf5ff", cursor: isBusy ? "not-allowed" : "pointer",
              opacity: isBusy ? 0.5 : 1, textAlign: "left",
            }}>
              <Usb size={13} style={{ color: usbDevice ? "#16a34a" : "#7c3aed", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: usbDevice ? "#15803d" : "#6d28d9" }}>
                {connectingType === "usb" ? "Connecting…" : usbDevice ? `USB: ${usbDevice.productName || "Connected"}` : "Connect USB Printer"}
              </span>
            </button>
          )}

          {isWebBluetoothSupported() && (
            <button onClick={handleConnectBT} disabled={isBusy} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "9px 12px", borderRadius: 8, border: btConn ? "1px solid #bbf7d0" : "1px solid #bfdbfe",
              background: btConn ? "#f0fdf4" : "#f0f9ff", cursor: isBusy ? "not-allowed" : "pointer",
              opacity: isBusy ? 0.5 : 1, textAlign: "left",
            }}>
              <Bluetooth size={13} style={{ color: btConn ? "#16a34a" : "#2563eb", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: btConn ? "#15803d" : "#1d4ed8" }}>
                {connectingType === "bt" ? "Connecting…" : btConn ? `BT: ${btConn.device.name || "Connected"}` : "Connect Bluetooth"}
              </span>
            </button>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: "8px 16px 14px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} disabled={isBusy} style={{
            padding: "6px 16px", fontSize: 12, fontWeight: 600,
            color: "#475569", background: "#f1f5f9", border: "none",
            borderRadius: 8, cursor: isBusy ? "not-allowed" : "pointer",
            opacity: isBusy ? 0.4 : 1,
          }}>
            {isConnected ? "Done" : "Cancel"}
          </button>
        </div>

      </div>
    </>
  );
}

export default function POS() {
  const [products, setProducts]     = useState([]);
  const [cart, setCart]             = useState([]);
  const [search, setSearch]         = useState("");
  const [barcode, setBarcode]       = useState("");
  const [discount, setDiscount]     = useState("");
  const [paymentMethod, setMethod]  = useState("CASH");
  const [customerName, setCustName] = useState("");
  const [customerEmail, setCustEmail]= useState("");
  const [notes, setNotes]           = useState("");
  const [processing, setProcessing] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [toast, setToast]           = useState({ visible: false, message: "", type: "info" });
  const [showPrinterSetup, setShowPrinterSetup] = useState(false);
  const [usbDevice, setUsbDevice]   = useState(null);
  const [btConn, setBtConn]         = useState(null);
  const [orgName, setOrgName]       = useState("My Shop");
  const barcodeRef                  = useRef(null);

  const notify = (message, type = "success") => setToast({ visible: true, message, type });

  // Load all products on mount + org name
  useEffect(() => {
    api.get("/api/inventory/products?page=0&size=200")
      .then(r => setProducts(r.data.content || []))
      .catch(() => {});
    api.get("/api/org/settings").then(r => {
      if (r.data?.name) setOrgName(r.data.name);
    }).catch(() => {});
  }, []);

  // Live search
  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
    if (!search.trim()) { setFiltered([]); return; }
    const q = search.toLowerCase();
    setFiltered(products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.barcode && p.barcode.includes(q))
    ).slice(0, 8));
  }, [search, products]);

  // Barcode scan (press Enter)
  const handleBarcodeScan = async (e) => {
    if (e.key !== "Enter" || !barcode.trim()) return;
    try {
      const res = await api.get(`/api/inventory/products/barcode/${encodeURIComponent(barcode.trim())}`);
      addToCart(res.data);
      setBarcode("");
    } catch {
      notify("Product not found for barcode: " + barcode, "error");
      setBarcode("");
    }
  };

  const addToCart = (product) => {
    if (product.quantityInStock <= 0) { notify(`${product.name} is out of stock`, "error"); return; }
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.quantityInStock) {
          notify(`Only ${product.quantityInStock} in stock`, "error");
          return prev;
        }
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        unit: product.unit,
        maxQty: product.quantityInStock,
        quantity: 1,
      }];
    });
    setSearch("");
    setFiltered([]);
  };

  const updateQty = (productId, delta) => {
    setCart(prev => prev.map(i => {
      if (i.productId !== productId) return i;
      const newQty = Math.max(1, Math.min(i.quantity + delta, i.maxQty));
      return { ...i, quantity: newQty };
    }));
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.productId !== productId));

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmt = parseFloat(discount) || 0;
  const total = Math.max(0, subtotal - discountAmt);

  const clearSale = () => {
    setCart([]); setDiscount(""); setMethod("CASH");
    setCustName(""); setCustEmail(""); setNotes("");
  };

  const handlePrint = async (receipt) => {
    if (usbDevice) {
      try { await printReceiptUSB(usbDevice, receipt, orgName); notify("Printed to USB printer"); return; }
      catch { notify("USB print failed, using browser print", "info"); }
    }
    if (btConn) {
      try { await printReceiptBluetooth(btConn, receipt, orgName); notify("Printed to Bluetooth printer"); return; }
      catch { notify("Bluetooth print failed, using browser print", "info"); }
    }
    printReceiptBrowser(receipt, orgName);
  };

  const downloadReceipt = (receipt) => {
    const date = new Date(receipt.saleDate || Date.now()).toLocaleString("en-NG", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
    const rows = (receipt.items || []).map(i => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9">${i.productName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:center">${i.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:right">${fmt(i.unitPrice)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:600">${fmt(i.subtotal)}</td>
      </tr>`).join("");
    const html = `<!DOCTYPE html><html><head><title>Receipt ${receipt.receiptNumber}</title>
    <style>body{font-family:Arial,sans-serif;max-width:520px;margin:32px auto;color:#0f172a}
    h1{font-size:22px;margin:0 0 4px}p{margin:2px 0;color:#64748b;font-size:13px}
    table{width:100%;border-collapse:collapse;margin:20px 0;font-size:13px}
    th{background:#2563eb;color:#fff;padding:10px 12px;text-align:left}
    .total-row td{font-weight:700;font-size:15px;color:#1d4ed8;background:#eff6ff}
    .footer{margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center}
    @media print{body{margin:0}}</style></head><body>
    <h1>Receipt</h1>
    <p><strong>Receipt #:</strong> ${receipt.receiptNumber}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Payment:</strong> ${(receipt.paymentMethod || "").replace("_"," ")}</p>
    ${receipt.customerName ? `<p><strong>Customer:</strong> ${receipt.customerName}</p>` : ""}
    <table>
      <thead><tr>
        <th>Item</th><th style="text-align:center">Qty</th>
        <th style="text-align:right">Unit Price</th><th style="text-align:right">Subtotal</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr class="total-row">
        <td colspan="3" style="padding:10px 12px;text-align:right">Total</td>
        <td style="padding:10px 12px;text-align:right">${fmt(receipt.total)}</td>
      </tr></tfoot>
    </table>
    <div class="footer">Thank you for your purchase!</div>
    </body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt-${receipt.receiptNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) { notify("Add at least one item", "error"); return; }
    setProcessing(true);
    try {
      const res = await api.post("/api/inventory/sales", {
        items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })),
        discount: discountAmt > 0 ? discountAmt : null,
        paymentMethod,
        customerName: customerName || null,
        customerEmail: customerEmail || null,
        notes: notes || null,
      });
      setLastReceipt(res.data);
      clearSale();
      // Refresh stock
      api.get("/api/inventory/products?page=0&size=200")
        .then(r => setProducts(r.data.content || []));
    } catch (e) {
      notify(e.response?.data?.message || "Sale failed", "error");
    } finally { setProcessing(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, visible: false }))} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT — Product search */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" /> Point of Sale
            </h1>
            <button onClick={() => setShowPrinterSetup(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                usbDevice || btConn
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
              }`}>
              <Printer className="w-3.5 h-3.5" />
              {usbDevice ? "USB Printer" : btConn ? "BT Printer" : "Setup Printer"}
            </button>
          </div>

          {/* Barcode scanner input */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={barcodeRef}
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                onKeyDown={handleBarcodeScan}
                placeholder="Scan barcode and press Enter…"
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Product search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products by name or SKU…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            {filtered.length > 0 && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                {filtered.map(p => (
                  <button key={p.id} onClick={() => addToCart(p)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700 transition text-left">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.sku || "No SKU"} · {p.quantityInStock} {p.unit} left</p>
                    </div>
                    <p className="text-sm font-bold text-blue-600 ml-4 flex-shrink-0">{fmt(p.price)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {products.slice(0, 30).map(p => (
              <button key={p.id} onClick={() => addToCart(p)}
                disabled={p.quantityInStock <= 0}
                className={`text-left p-3 rounded-xl border transition ${
                  p.quantityInStock <= 0
                    ? "opacity-40 cursor-not-allowed border-slate-100"
                    : "border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-sm bg-white dark:bg-slate-800"
                }`}>
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{p.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.quantityInStock > 0 ? `${p.quantityInStock} ${p.unit}` : "Out of stock"}</p>
                <p className="text-sm font-bold text-blue-600 mt-1">{fmt(p.price)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Cart & checkout */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white">Cart</h2>
              {cart.length > 0 && (
                <button onClick={clearSale} className="text-xs text-rose-500 hover:text-rose-700 font-semibold">Clear</button>
              )}
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700 max-h-64">
              {cart.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-sm">No items yet</p>
              ) : (
                cart.map(item => (
                  <div key={item.productId} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">{fmt(item.price)} each</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => updateQty(item.productId, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-slate-800 dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, 1)}
                        className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 transition">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white w-20 text-right">
                      {fmt(item.price * item.quantity)}
                    </p>
                    <button onClick={() => removeFromCart(item.productId)}
                      className="text-slate-300 hover:text-rose-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 flex-1">Discount (₦)</span>
                <input type="number" value={discount} onChange={e => setDiscount(e.target.value)}
                  placeholder="0" min="0" className="w-24 px-2 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-right text-sm bg-white dark:bg-slate-700 dark:text-white" />
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-slate-100 dark:border-slate-700">
                <span className="text-slate-800 dark:text-white">Total</span>
                <span className="text-blue-600">{fmt(total)}</span>
              </div>
            </div>

            {/* Customer info */}
            <div className="px-4 pb-3 space-y-2 border-t border-slate-100 dark:border-slate-700 pt-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer (optional)</p>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input value={customerName} onChange={e => setCustName(e.target.value)}
                  placeholder="Customer name" className="w-full pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white" />
              </div>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input value={customerEmail} onChange={e => setCustEmail(e.target.value)}
                  placeholder="Email for receipt (optional)" type="email"
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white" />
              </div>
            </div>

            {/* Payment method */}
            <div className="px-4 pb-3 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payment Method</p>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      paymentMethod === m
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400"
                    }`}>
                    {m.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 pt-2">
              <button onClick={handleCheckout} disabled={processing || cart.length === 0}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2 text-sm">
                {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {processing ? "Processing…" : `Charge ${fmt(total)}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printer Setup Modal */}
      {showPrinterSetup && (
        <PrinterSetupModal
          orgName={orgName}
          onClose={() => setShowPrinterSetup(false)}
        />
      )}

      {/* Receipt modal */}
      {lastReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Sale Complete!</h2>
            <p className="text-slate-500 text-sm mb-4">Receipt #{lastReceipt.receiptNumber}</p>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 text-left space-y-2 mb-5 text-sm">
              {lastReceipt.items?.map(i => (
                <div key={i.id} className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>{i.quantity}× {i.productName}</span>
                  <span>{fmt(i.subtotal)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-600 pt-2 flex justify-between font-bold text-slate-900 dark:text-white">
                <span>Total</span><span className="text-blue-600">{fmt(lastReceipt.total)}</span>
              </div>
              {lastReceipt.customerEmail && (
                <p className="text-xs text-emerald-600 pt-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Receipt sent to {lastReceipt.customerEmail}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button onClick={() => handlePrint(lastReceipt)}
                className="py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition flex items-center justify-center gap-1.5">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button onClick={() => downloadReceipt(lastReceipt)}
                className="py-2.5 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-200 transition flex items-center justify-center gap-1.5">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
            <button onClick={() => setLastReceipt(null)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition">
              New Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
