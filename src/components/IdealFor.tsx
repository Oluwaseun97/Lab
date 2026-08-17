import React, { useState } from 'react';
import { Building2, CheckCircle2, Search, Building, HeartPulse, Landmark, Microscope, Users, Sparkles } from 'lucide-react';
import { SALES_COPY } from '../data/copy';

interface IdealForProps {
  onScrollToForm: () => void;
}

export const IdealFor: React.FC<IdealForProps> = ({ onScrollToForm }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const categoryIcons: Record<string, React.ReactNode> = {
    'Hospitals': <Building2 className="w-5 h-5 text-cyan-400" />,
    'Diagnostic Laboratories & Centres': <Microscope className="w-5 h-5 text-teal-400" />,
    'Medical Centres & Clinics': <HeartPulse className="w-5 h-5 text-cyan-400" />,
    'Private Healthcare Facilities': <Building className="w-5 h-5 text-indigo-400" />,
    'Research & Medical Institutions': <Landmark className="w-5 h-5 text-emerald-400" />,
    'NGOs & Healthcare Organizations': <Users className="w-5 h-5 text-cyan-400" />,
    'Medical Outreach Programmes': <Sparkles className="w-5 h-5 text-amber-400" />,
    'Health Screening & Community Health Events': <HeartPulse className="w-5 h-5 text-teal-400" />,
    'Any healthcare organization requiring temporary laboratory personnel': <CheckCircle2 className="w-5 h-5 text-cyan-400" />
  };

  const filteredCategories = SALES_COPY.idealFor.categories.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-slate-100 border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & Image */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Target Organizations</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {SALES_COPY.idealFor.heading}
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              We partner with healthcare establishments across all tiers to provide dependable locum medical laboratory scientists and technicians for seamless daily operations.
            </p>

            {/* Outreach Lab Image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
              <img
                src="/src/assets/images/lab_team_outreach_1786473385471.jpg"
                alt="Medical Laboratory Technician in action"
                className="w-full h-[240px] object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-5">
                <p className="text-xs font-medium text-slate-200">
                  ⚡ Qualified locum personnel available for rapid deployment across diagnostic facilities & outreach clinics.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column Filterable Grid */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search facility type (e.g. Hospital, Outreach, Clinic)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* List items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCategories.map((item, idx) => (
                <div
                  key={idx}
                  onClick={onScrollToForm}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-950 transition-all cursor-pointer group flex items-start space-x-3"
                >
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 flex-shrink-0 mt-0.5">
                    {categoryIcons[item] || <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {item}
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Click to request locum staff
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
                No matching facility found. But don't worry — we serve <strong className="text-white">all healthcare organizations</strong>!
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
