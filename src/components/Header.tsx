import React from 'react';
import { Phone, Stethoscope, ArrowRight } from 'lucide-react';
import { SALES_COPY } from '../data/copy';

interface HeaderProps {
  onScrollToForm: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToForm }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-md shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
              {SALES_COPY.header.brandName}
            </span>
            <span className="hidden sm:block text-xs text-cyan-300 font-medium tracking-wide">
              Locum Medical Lab Staffing
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Phone Link */}
          <a
            href={`tel:${SALES_COPY.header.phone}`}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700"
            title="Call Us Directly"
          >
            <Phone className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{SALES_COPY.header.phone}</span>
            <span className="sm:hidden">Call Us</span>
          </a>

          {/* Scroll to Form CTA */}
          <button
            onClick={onScrollToForm}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Book Locum</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
