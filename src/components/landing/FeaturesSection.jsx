import {
  BookOpen, TrendingUp, TrendingDown, BookMarked, Target, History,
  Landmark, Warehouse, Receipt, FileText, Repeat, FileCheck,
  GitBranch, FileMinus, ClipboardCheck, Undo2, Globe, Users,
  UserCog, Package2, Layers, ShoppingBag, Globe as Globe2,
} from "lucide-react";

const ACCOUNTING = [
  { icon: <BookOpen className="w-5 h-5 text-blue-600" />,      bg: "bg-blue-50",    title: "Full Double-Entry Accounting",  desc: "Chart of accounts, journal entries, opening balances. Real accounting tools — simple enough for any owner." },
  { icon: <TrendingUp className="w-5 h-5 text-rose-600" />,    bg: "bg-rose-50",    title: "Financial Reports",             desc: "Trial Balance, P&L, Balance Sheet — clear reports that show exactly where your business stands." },
  { icon: <TrendingDown className="w-5 h-5 text-emerald-600"/>,bg: "bg-emerald-50", title: "Cash Flow Statement",           desc: "See operating, investing, and financing cash flows for any period — automatically from your journal entries." },
  { icon: <BookMarked className="w-5 h-5 text-violet-600" />,  bg: "bg-violet-50",  title: "Account Ledger",                desc: "Drill into any account. See every transaction, debit, credit, and running balance — any date range." },
  { icon: <Target className="w-5 h-5 text-pink-600" />,        bg: "bg-pink-50",    title: "Budget vs Actual",              desc: "Set annual budgets per account. Compare actual spend to budget for any period — instantly." },
  { icon: <History className="w-5 h-5 text-sky-600" />,        bg: "bg-sky-50",     title: "Cash Flow Forecast",            desc: "Project future cash inflows from open invoices and outflows from outstanding bills — weeks ahead." },
  { icon: <Landmark className="w-5 h-5 text-teal-600" />,      bg: "bg-teal-50",    title: "Bank Reconciliation & Import",  desc: "Import bank statements, auto-match transactions, and reconcile your books in minutes." },
  { icon: <Warehouse className="w-5 h-5 text-orange-600" />,   bg: "bg-orange-50",  title: "Fixed Assets & Depreciation",   desc: "Track all assets. Auto-run straight-line or reducing-balance depreciation on the 1st of every month." },
  { icon: <Receipt className="w-5 h-5 text-amber-600" />,      bg: "bg-amber-50",   title: "Tax Compliance",                desc: "VAT and WHT calculated automatically on every invoice. One-click export for your country's tax authority." },
];

const INVOICING = [
  { icon: <FileText className="w-5 h-5 text-indigo-600" />,    bg: "bg-indigo-50",  title: "Invoicing & Payments",          desc: "Create, send, and track invoices. Clients pay via Paystack, bank transfer, or cash." },
  { icon: <Repeat className="w-5 h-5 text-blue-600" />,        bg: "bg-blue-50",    title: "Recurring Invoices",            desc: "Set a weekly, monthly, or quarterly schedule. Invoices generate and send automatically." },
  { icon: <FileCheck className="w-5 h-5 text-cyan-600" />,     bg: "bg-cyan-50",    title: "Quotes & Estimates",            desc: "Send professional quotes to clients. Accept, reject, or convert to invoice in one click." },
  { icon: <GitBranch className="w-5 h-5 text-violet-600" />,   bg: "bg-violet-50",  title: "Proforma Invoices",             desc: "Issue proforma invoices for customs clearance or pre-delivery confirmation. Convert to invoice when ready." },
  { icon: <FileMinus className="w-5 h-5 text-rose-600" />,     bg: "bg-rose-50",    title: "Bills & Payables",              desc: "Track supplier bills, record payments, and manage your full accounts payable workflow." },
  { icon: <ClipboardCheck className="w-5 h-5 text-teal-600" />,bg: "bg-teal-50",   title: "Purchase Orders",               desc: "Raise POs for suppliers. Approve and auto-convert to a bill when goods arrive." },
  { icon: <Undo2 className="w-5 h-5 text-emerald-600" />,      bg: "bg-emerald-50", title: "Credit & Debit Notes",          desc: "Issue credit notes against invoices or debit notes against bills. Balances update automatically." },
  { icon: <Globe className="w-5 h-5 text-sky-600" />,          bg: "bg-sky-50",     title: "Multi-Currency",                desc: "Invoice in USD, EUR, GBP, KES, NGN, GHS, UGX, TZS and more. Exchange rates tracked per transaction.", badge: "NEW" },
  { icon: <Users className="w-5 h-5 text-slate-600" />,        bg: "bg-slate-50",   title: "Client Account Statements",     desc: "Generate a full statement for any client — all invoices, payments, and credit notes with running balance." },
];

const OPERATIONS = [
  { icon: <UserCog className="w-5 h-5 text-emerald-600" />,    bg: "bg-emerald-50", title: "Payroll & PAYE",                desc: "Run monthly payroll. Calculates PAYE, NHIF/SHIF, NSSF, and Housing Levy automatically. Posts journal entries on approval.", badge: "NEW" },
  { icon: <Package2 className="w-5 h-5 text-amber-600" />,     bg: "bg-amber-50",   title: "Inventory & Stock Management",  desc: "Manage products, track stock levels, create restock orders, and view full movement history per product." },
  { icon: <Receipt className="w-5 h-5 text-violet-600" />,     bg: "bg-violet-50",  title: "Expense Reporting & Claims",    desc: "Staff submit expense claims with receipts. Approve in one click — auto-posts to your journal." },
  { icon: <Layers className="w-5 h-5 text-rose-600" />,        bg: "bg-rose-50",    title: "Project & Client Tracking",     desc: "Group invoices by project. Know what each client owes you and how much you've earned per engagement." },
  { icon: <ShoppingBag className="w-5 h-5 text-sky-600" />,    bg: "bg-sky-50",     title: "Point of Sale",                 desc: "Walk-in sales with barcode scanning, receipt printing, and instant stock deductions." },
  { icon: <Users className="w-5 h-5 text-teal-600" />,         bg: "bg-teal-50",    title: "Team Access & Roles",           desc: "Add admins, accountants, and staff. Each role sees exactly what they need — and nothing else." },
];

function FeatureCard({ f }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group relative">
      {f.badge && (
        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">{f.badge}</span>
      )}
      <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4 border border-slate-100 group-hover:scale-110 transition-transform`}>{f.icon}</div>
      <h3 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">{f.title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 mb-5">
            Everything included
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything your business needs</h2>
          <p className="text-slate-500 max-w-xl mx-auto">One platform — invoicing, accounting, payroll, inventory, multi-currency, and more. Built for African businesses.</p>
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Accounting & Reporting</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {ACCOUNTING.map(f => <FeatureCard key={f.title} f={f} />)}
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Invoicing & Payables</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {INVOICING.map(f => <FeatureCard key={f.title} f={f} />)}
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Operations & HR</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OPERATIONS.map(f => <FeatureCard key={f.title} f={f} />)}
        </div>
      </div>
    </section>
  );
}
