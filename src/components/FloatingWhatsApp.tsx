import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';
import { SALES_COPY } from '../data/copy';

export const FloatingWhatsApp: React.FC = () => {
  const waUrl = `https://wa.me/${SALES_COPY.header.whatsappNumber}?text=${encodeURIComponent(
    'Hello Lab Linik Services! I am interested in booking a Locum Medical Laboratory Professional for my facility.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2">
      {/* Floating WhatsApp CTA pill */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center space-x-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-2xl transition-all transform hover:scale-105 active:scale-95 border border-emerald-400/50"
        title="Chat with Lab Linik Services on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 fill-slate-950 text-emerald-500" />
        <span className="hidden sm:inline">Book via WhatsApp (08165686093)</span>
        <span className="sm:hidden">WhatsApp</span>
      </a>
    </div>
  );
};
