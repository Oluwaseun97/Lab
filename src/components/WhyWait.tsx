import React from 'react';
import { AlertTriangle, Clock, Frown, FileSpreadsheet, UserX, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SALES_COPY } from '../data/copy';

interface WhyWaitProps {
  onScrollToForm: () => void;
}

export const WhyWait: React.FC<WhyWaitProps> = ({ onScrollToForm }) => {
  const riskIcons = [
    <Clock className="w-5 h-5 text-amber-400" />,
    <UserX className="w-5 h-5 text-rose-400" />,
    <FileSpreadsheet className="w-5 h-5 text-amber-400" />,
    <AlertTriangle className="w-5 h-5 text-rose-400" />,
    <Frown className="w-5 h-5 text-amber-400" />,
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Risks Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold tracking-wider uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Operational Risks</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {SALES_COPY.whyWait.heading}
          </h2>

          <p className="text-lg font-medium text-slate-300">
            {SALES_COPY.whyWait.subheading}
          </p>
        </div>

        {/* 5 Risks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
          {SALES_COPY.whyWait.risks.map((risk, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-900/90 border border-rose-950/80 hover:border-rose-800/60 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                {riskIcons[index % riskIcons.length]}
              </div>
              <p className="text-sm font-bold text-slate-200 leading-snug">
                {risk}
              </p>
            </div>
          ))}
        </div>

        {/* The Solution Banner */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border border-cyan-800/80 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950 px-3 py-1 rounded-md border border-cyan-800/80">
              The Lab Linik Solution
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {SALES_COPY.whyWait.flexibleHeader}
            </h3>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
              {SALES_COPY.whyWait.flexibleDesc}
            </p>

            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <span>{SALES_COPY.whyWait.flexibleHighlight}</span>
            </div>

            <p className="text-slate-300 font-medium text-sm sm:text-base">
              {SALES_COPY.whyWait.flexibleAction}
            </p>
          </div>

          <div className="pt-4 relative z-10">
            <button
              onClick={onScrollToForm}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-base shadow-lg transition-all flex items-center space-x-3"
            >
              <span>BOOK A LOCUM SCIENTIST / TECHNICIAN TODAY</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
