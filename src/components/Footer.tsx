import React from 'react';
import { Stethoscope, Phone, MessageSquare, ArrowUp, Calendar } from 'lucide-react';
import { SALES_COPY } from '../data/copy';

interface FooterProps {
  onScrollToForm: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToForm }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Banner CTA box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-900/60 via-slate-900 to-cyan-900/60 border border-slate-800 shadow-2xl text-center space-y-4 mb-12">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {SALES_COPY.ctaBottom.heading}
          </h3>
          <p className="text-cyan-300 font-semibold text-lg">
            {SALES_COPY.ctaBottom.subheading}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={onScrollToForm}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg hover:from-teal-300 hover:to-cyan-300 transition-all"
            >
              {SALES_COPY.ctaBottom.finalBanner}
            </button>
            <a
              href={`tel:${SALES_COPY.header.phone}`}
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition-colors flex items-center space-x-2"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Call {SALES_COPY.header.phone}</span>
            </a>
          </div>
        </div>

        {/* Brand & Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-800 pb-12">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {SALES_COPY.header.brandName}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {SALES_COPY.header.tagline} Providing certified Locum Medical Laboratory Scientists and Technicians for hospitals, diagnostic centres, clinics, and medical outreach programs.
            </p>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Phone: <strong className="text-white">{SALES_COPY.header.phone}</strong></span>
              </p>
              <p className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: <strong className="text-white">{SALES_COPY.header.formattedPhone}</strong></span>
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="space-y-2 text-sm">
              <button
                onClick={onScrollToForm}
                className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-colors font-medium"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Book Locum Request</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {SALES_COPY.header.brandName}. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
