// BankStatementImport.jsx — Accounting > Import Bank Statement
import { useState, useRef, useCallback } from "react";
import { Navigate } from "react-router-dom";
import api, { getUserFromToken } from "../services/api";
import {
  Landmark, Upload, FileText, Download, CheckCircle,
  XCircle, AlertTriangle, X, CloudUpload,
} from "lucide-react";

const SAMPLE_CSV = `date,description,debit_account,credit_account,amount,reference
2026-01-15,Client payment received,1100,4000,5000.00,INV-001
2026-01-16,Rent payment,5200,1100,50000.00,RENT-JAN`;

const SAMPLE_FILENAME = "sample-bank-statement.csv";

function downloadSample() {
  const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = SAMPLE_FILENAME;
  a.click();
  URL.revokeObjectURL(url);
}

function BankStatementImport() {
  const user = getUserFromToken();
  const role = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : null);
  const canAccess = ["SUPER_ADMIN", "ADMIN"].includes(role) ||
    (Array.isArray(user?.roles) && (user.roles.includes("SUPER_ADMIN") || user.roles.includes("ADMIN")));

  if (!canAccess) return <Navigate to="/dashboard" replace />;

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { imported, total, errors: [] }
  const [submitError, setSubmitError] = useState("");
  const inputRef = useRef(null);

  const acceptFile = (f) => {
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      setSubmitError("Only .csv files are accepted.");
      return;
    }
    setFile(f);
    setResult(null);
    setSubmitError("");
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    acceptFile(f);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleFileInput = (e) => acceptFile(e.target.files?.[0]);

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setSubmitError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/api/accounting/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Expected: { imported: 9, total: 10, errors: ["Row 3: invalid amount", ...] }
      setResult(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Import failed. Please check your file and try again.");
    } finally {
      setLoading(false);
    }
  };

  const allPassed = result && result.errors?.length === 0;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Landmark className="w-6 h-6 text-blue-600" />
          Import Bank Statement
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload a CSV file to post journal entries from your bank statement.
        </p>
      </div>

      {/* Expected format */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Expected CSV Format</h2>
          </div>
          <button
            onClick={downloadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
          >
            <Download size={13} />
            Download Sample
          </button>
        </div>
        <div className="p-5">
          <div className="rounded-xl bg-slate-900 dark:bg-slate-950 overflow-x-auto">
            <pre className="px-5 py-4 text-xs text-emerald-300 leading-relaxed font-mono whitespace-pre">{SAMPLE_CSV}</pre>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { col: "date",           desc: "YYYY-MM-DD format" },
              { col: "description",    desc: "Transaction description" },
              { col: "debit_account",  desc: "Account code to debit" },
              { col: "credit_account", desc: "Account code to credit" },
              { col: "amount",         desc: "Numeric amount (no ₦)" },
              { col: "reference",      desc: "Optional reference number" },
            ].map(c => (
              <div key={c.col} className="flex items-start gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{c.col}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Upload className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            Upload File
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all px-6 py-12 text-center
              ${dragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : file
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10"
                  : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/30"
              }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setFile(null); if (inputRef.current) inputRef.current.value = ""; }}
                  className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 transition"
                >
                  <X size={12} />Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                  <CloudUpload className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {dragging ? "Drop your CSV here" : "Drag & drop your CSV here"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">or click to browse — .csv files only</p>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {submitError && (
            <div className="flex items-start gap-2 px-4 py-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700 dark:text-rose-300">{submitError}</p>
            </div>
          )}

          {/* Import button */}
          <div className="flex justify-end">
            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Importing…
                </>
              ) : (
                <>
                  <Upload size={15} />
                  Import
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${allPassed ? "border-emerald-200 dark:border-emerald-800" : "border-amber-200 dark:border-amber-800"}`}>
          {/* Summary bar */}
          <div className={`px-6 py-4 flex items-center gap-3 ${allPassed ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-amber-50 dark:bg-amber-900/20"}`}>
            {allPassed
              ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              : <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />}
            <p className={`text-sm font-semibold ${allPassed ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>
              {result.imported} of {result.total} row{result.total !== 1 ? "s" : ""} imported successfully
            </p>
          </div>

          {/* Error list */}
          {result.errors?.length > 0 && (
            <div className="bg-white dark:bg-slate-800 px-6 py-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                {result.errors.length} row{result.errors.length !== 1 ? "s" : ""} failed
              </p>
              {result.errors.map((err, i) => (
                <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl">
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-700 dark:text-rose-300">{err}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BankStatementImport;
