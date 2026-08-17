import React from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Phone, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { SALES_COPY } from '../data/copy';
import heroImage from '../assets/images/lab_hero_banner.jpg';

interface HeroProps {
  onScrollToForm: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToForm }) => {
  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden pt-10 pb-20 border-b border-slate-800">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column — Sales Pitch */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs sm:text-sm font-medium shadow-inner">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{SALES_COPY.header.tagline}</span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {SALES_COPY.hero.title}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-cyan-300 leading-snug">
                {SALES_COPY.hero.subtitle}
              </p>
            </div>

            {/* Question Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {SALES_COPY.hero.questions.map((question, index) => (
                <div
                  key={index}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-medium shadow-sm hover:border-cyan-500/50 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{question}</span>
                </div>
              ))}
            </div>

            {/* Main Pitch Highlight Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-800/60 to-slate-900/90 border border-slate-700/80 shadow-xl space-y-3">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
                {SALES_COPY.hero.mainPitch}
              </p>
              <div className="pt-2 border-t border-slate-700/60 text-sm sm:text-base text-cyan-100 font-normal leading-relaxed flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>{SALES_COPY.hero.valueProp}</span>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={onScrollToForm}
                className="flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{SALES_COPY.hero.ctaPrimary}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={`https://wa.me/${SALES_COPY.header.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2.5 px-6 py-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-700/70 font-semibold text-base transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Quick stats trust bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Verified Scientists</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Fast Shift Deployment</span>
              </div>
              <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Direct WhatsApp Contact</span>
              </div>
            </div>
          </div>

          {/* Right Column — Lab Scientist Image & Floating Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800 group">
              <img
                src={heroImage || "/images/lab_hero_banner.jpg"}
                alt="Lab Linik Medical Laboratory Scientist at work"
                className="w-full h-[400px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/90 shadow-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Locum Readiness
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-sm font-semibold text-white">
                  Qualified Scientists & Technicians Available
                </p>
                <p className="text-xs text-slate-300">
                  Ready for hospital shifts, lab leave cover & outreach
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
