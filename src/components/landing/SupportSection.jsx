import { LifeBuoy, Mail, Ticket } from "lucide-react";

export default function SupportSection() {
  return (
    <section id="support" className="py-16 bg-slate-50 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <LifeBuoy className="w-4 h-4" /> Help & Support
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">We're here to help</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Questions? Issues? Reach out to our support team.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="mailto:support@lumitechsystems.com"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-blue-300 group">
            <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800">Email us</p>
              <p className="text-xs text-slate-500">support@lumitechsystems.com</p>
            </div>
          </a>
          <a href="https://www.issuetask.com/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all group">
            <Ticket className="w-5 h-5 group-hover:rotate-12 transition" />
            <div className="text-left">
              <p className="text-sm font-semibold">Create a support ticket</p>
              <p className="text-xs text-blue-200">Get dedicated help</p>
            </div>
          </a>
        </div>
        <p className="text-center text-xs text-slate-400 mt-8">Typical response time: within 24 hours (business days)</p>
      </div>
    </section>
  );
}
