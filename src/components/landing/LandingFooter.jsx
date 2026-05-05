import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-100 py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-sm">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">LumiLedger<span className="text-blue-600">.</span></span>
          </div>
          <p className="text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} LumiLedger by Lumitech Systems. Your business finances, simplified.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/login"    className="text-xs text-slate-500 hover:text-blue-600 transition">Sign In</Link>
            <Link to="/register" className="text-xs text-slate-500 hover:text-blue-600 transition">Register</Link>
            <a href="#support"   className="text-xs text-slate-500 hover:text-blue-600 transition">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
