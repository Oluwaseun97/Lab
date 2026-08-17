import React from 'react';
import { Clock, Calendar, TrendingUp, Users, ShieldAlert, ArrowRight } from 'lucide-react';
import { SALES_COPY } from '../data/copy';

interface ValuePropsProps {
  onScrollToForm: () => void;
}

export const ValueProps: React.FC<ValuePropsProps> = ({ onScrollToForm }) => {
  const coverageIcons = [
    <Clock className="w-6 h-6 text-cyan-500" />,
    <Calendar className="w-6 h-6 text-teal-500" />,
    <TrendingUp className="w-6 h-6 text-cyan-500" />,
    <Users className="w-6 h-6 text-emerald-500" />,
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-bold tracking-wider uppercase">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Staffing Solutions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {SALES_COPY.staffingGaps.heading}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {SALES_COPY.staffingGaps.description}
          </p>
        </div>

        {/* Coverage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {SALES_COPY.staffingGaps.coverageTypes.map((item, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {coverageIcons[index % coverageIcons.length]}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-cyan-400">
                <span>Flexible Booking Available</span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-teal-950 border border-cyan-800/60 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-white">
              Need immediate or upcoming locum coverage?
            </h4>
            <p className="text-sm text-cyan-200 mt-1">
              Tell us your requirements and get a qualified scientist or technician assigned.
            </p>
          </div>
          <button
            onClick={onScrollToForm}
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <span>Request Staff Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
