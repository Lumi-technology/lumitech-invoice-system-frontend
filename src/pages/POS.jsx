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
  connectBluetoothPrinter, reconnectBluetoothPrinter, printReceiptBluetooth,
  isWebUSBSupported, isWebBluetoothSupported,
  getAuthorizedUSBPrinters, getAuthorizedBTPrinters,
} from "../utils/thermalPrint";

const fmt = (v) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(v || 0);
const PAYMENT_METHODS = ["CASH", "TRANSFER", "CARD", "POS_TERMINAL"];

// ── Printer Setup Modal ───────────────────────────────────────────────────
function PrinterSetupModal({ orgName, onClose }) {
  const [usbDevice, setUsbDevice]     = useState(null);
  const [btConn, setBtConn]           = useState(null);
  const [knownUSB, setKnownUSB]       = useState([]);   // previously authorised
  const [knownBT, setKnownBT]         = useState([]);
  const [busy, setBusy]               = useState(null); // device key being connected
  const [error, setError]             = useState("");
  const [status, setStatus]           = useState("");

  // Load previously authorised devices on mount — no picker
  useEffect(() => {
    getAuthorizedUSBPrinters().then(setKnownUSB);
    getAuthorizedBTPrinters().then(setKnownBT);
  }, []);

  const isBusy = busy !== null;
  const isConnected = usbDevice || btConn;

  const connectUSB = async (device) => {
    const key = device.serialNumber || device.productName || "usb";
    setBusy(key); setError(""); setStatus("Connecting to " + (device.productName || "USB Printer") + "…");
    try {
      setUsbDevice(device);
      setStatus("Connected: " + (device.productName || "USB Printer"));
    } catch (e) {
      setError(e.message); setStatus("");
    } finally { setBusy(null); }
  };

  const addNewUSB = async () => {
    setBusy("new-usb"); setError(""); setStatus("Select your printer from the browser popup…");
    try {
      const device = await connectUSBPrinter();
      setKnownUSB(prev => prev.some(d => d.serialNumber === device.serialNumber) ? prev : [...prev, device]);
      setUsbDevice(device);
      setStatus("Connected: " + (device.productName || "USB Printer"));
    } catch (e) {
      setError(e.message.includes("No device") || e.message.includes("cancelled")
        ? "No printer selected." : e.message);
      setStatus("");
    } finally { setBusy(null); }
  };

  const connectBT = async (device) => {
    setBusy(device.id); setError(""); setStatus("Connecting to " + (device.name || "BT Printer") + "…");
    try {
      const conn = await reconnectBluetoothPrinter(device);
      setBtConn(conn);
      setStatus("Connected: " + (device.name || "BT Printer"));
    } catch (e) {
      setError(e.message); setStatus("");
    } finally { setBusy(null); }
  };

  const addNewBT = async () => {
    setBusy("new-bt"); setError(""); setStatus("Select your printer from the browser popup…");
    try {
      const conn = await connectBluetoothPrinter();
      setKnownBT(prev => prev.some(d => d.id === conn.device.id) ? prev : [...prev, conn.device]);
      setBtConn(conn);
      setStatus("Connected: " + (conn.device.name || "BT Printer"));
    } catch (e) {
      setError(e.message.includes("cancelled") || e.message.includes("chosen")
        ? "No printer selected. Make sure Bluetooth is on." : e.message);
      setStatus("");
    } finally { setBusy(null); }
  };

  const handleTestPrint = async () => {
    setBusy("test"); setError(""); setStatus("Sending test receipt…");
    const testReceipt = {
      receiptNumber: "TEST-001", saleDate: new Date().toISOString(),
      paymentMethod: "CASH", customerName: "Test Customer", total: 5000, discount: 0,
      items: [{ productName: "Test Item", quantity: 1, unitPrice: 5000, subtotal: 5000 }],
    };
    try {
      if (usbDevice)   { await printReceiptUSB(usbDevice, testReceipt, orgName);    setStatus("Test sent to USB printer ✓"); }
      else if (btConn) { await printReceiptBluetooth(btConn, testReceipt, orgName); setStatus("Test sent to Bluetooth printer ✓"); }
      else             { printReceiptBrowser(testReceipt, orgName);                 setStatus("Browser print dialog opened ✓"); }
    } catch (e) {
      setError("Print error: " + e.message); setStatus("");
    } finally { setBusy(null); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-auto"
           style={{ maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-600/20">
              <Printer className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Printer Setup</h3>
              <p className="text-xs text-slate-400">Connect a thermal receipt printer</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isBusy}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition disabled:opacity-40">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Status banners */}
          {isBusy && status && (
            <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <p className="text-sm text-blue-700 font-medium">{status}</p>
            </div>
          )}
          {!isBusy && status && (
            <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-700 font-medium">{status}</p>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
              <X className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          )}

          {/* Browser Print */}
          <div className={`p-4 rounded-xl border-2 transition-all ${!isConnected ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Wifi className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">Browser Print</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">Works everywhere</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Any printer set as default — no setup needed</p>
              </div>
            </div>
            <button onClick={handleTestPrint} disabled={isBusy}
              className="w-full mt-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {busy === "test" ? "Sending…" : "Test Print"}
            </button>
          </div>

          {/* USB — known devices + add new */}
          {isWebUSBSupported() && (
            <div className={`p-4 rounded-xl border-2 transition-all ${usbDevice ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${usbDevice ? "bg-emerald-100" : "bg-violet-50"}`}>
                  <Usb className={`w-4 h-4 ${usbDevice ? "text-emerald-600" : "text-violet-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">USB Direct</p>
                    {usbDevice
                      ? <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">Connected</span>
                      : <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">Chrome / Edge</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {usbDevice ? (usbDevice.productName || "USB Printer") + " — ESC/POS direct" : "ESC/POS direct to USB printer"}
                  </p>
                </div>
              </div>
              {/* Previously paired — one tap, no picker */}
              {knownUSB.length > 0 && knownUSB.map((d) => {
                const key = d.serialNumber || d.productName || "usb";
                return (
                  <button key={key} onClick={() => connectUSB(d)} disabled={isBusy}
                    className={`w-full mt-1 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
                      usbDevice === d ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200"
                                      : "bg-violet-600 text-white hover:bg-violet-700"}`}>
                    {busy === key ? "Connecting…" : usbDevice === d ? `Connected: ${d.productName || "USB Printer"}` : `Connect ${d.productName || "USB Printer"}`}
                  </button>
                );
              })}
              {/* Add new — triggers picker only if no known devices or want a different one */}
              <button onClick={addNewUSB} disabled={isBusy}
                className={`w-full mt-1 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
                  knownUSB.length > 0
                    ? "border border-dashed border-violet-300 text-violet-600 hover:bg-violet-50"
                    : "bg-violet-600 text-white hover:bg-violet-700"}`}>
                {busy === "new-usb" ? "Opening picker…" : knownUSB.length > 0 ? "+ Add different USB printer" : "Connect USB Printer"}
              </button>
            </div>
          )}

          {/* Bluetooth — known devices + add new */}
          {isWebBluetoothSupported() && (
            <div className={`p-4 rounded-xl border-2 transition-all ${btConn ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${btConn ? "bg-emerald-100" : "bg-blue-50"}`}>
                  <Bluetooth className={`w-4 h-4 ${btConn ? "text-emerald-600" : "text-blue-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">Bluetooth</p>
                    {btConn
                      ? <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">Connected</span>
                      : <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">Chrome / Edge</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {btConn ? (btConn.device.name || "BT Printer") + " — wireless ESC/POS" : "Wireless BLE thermal printer"}
                  </p>
                </div>
              </div>
              {knownBT.length > 0 && knownBT.map((d) => (
                <button key={d.id} onClick={() => connectBT(d)} disabled={isBusy}
                  className={`w-full mt-1 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
                    btConn?.device === d ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200"
                                        : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                  {busy === d.id ? "Connecting…" : btConn?.device === d ? `Connected: ${d.name || "BT Printer"}` : `Connect ${d.name || "BT Printer"}`}
                </button>
              ))}
              <button onClick={addNewBT} disabled={isBusy}
                className={`w-full mt-1 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
                  knownBT.length > 0
                    ? "border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                {busy === "new-bt" ? "Opening picker…" : knownBT.length > 0 ? "+ Add different Bluetooth printer" : "Connect Bluetooth Printer"}
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">USB/BT requires Chrome or Edge</p>
          <button onClick={onClose} disabled={isBusy}
            className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-40">
            {isConnected ? "Done" : "Cancel"}
          </button>
        </div>

      </div>
    </div>
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
