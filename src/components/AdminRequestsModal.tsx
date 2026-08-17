import React from 'react';
import {
  X,
  ClipboardList,
  Download,
  MessageSquare,
  ExternalLink,
  Building,
  Calendar,
  Clock,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import { SubmittedBooking } from '../types';
import { buildWhatsAppUrl, exportToCSV } from '../utils/formHelpers';

interface AdminRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: SubmittedBooking[];
  onClearRequests: () => void;
}

export const AdminRequestsModal: React.FC<AdminRequestsModalProps> = ({
  isOpen,
  onClose,
  requests,
  onClearRequests,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Saved Locum Requests Log</h3>
              <p className="text-xs text-slate-400">
                {requests.length} total request{requests.length === 1 ? '' : 's'} recorded locally on this device
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {requests.length > 0 && (
              <button
                onClick={() => exportToCSV(requests)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-colors"
                title="Download CSV"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {requests.length === 0 ? (
            <div className="p-12 text-center space-y-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <ClipboardList className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-semibold text-sm">No locum requests saved yet.</p>
              <p className="text-slate-500 text-xs">
                When a client fills out the booking form, their request will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <span className="text-xs font-bold text-cyan-400">{req.id}</span>
                      <span className="text-xs text-slate-500 ml-2">• {req.timestamp}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={buildWhatsAppUrl(req.data)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center space-x-1 hover:bg-emerald-900 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Send WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Organization:</span>
                      <strong className="text-white">{req.data.orgName}</strong> ({req.data.orgType})
                    </div>
                    <div>
                      <span className="text-slate-400 block">Contact:</span>
                      <strong className="text-cyan-300">{req.data.contactName}</strong> ({req.data.contactPhone})
                    </div>
                    <div>
                      <span className="text-slate-400 block">Staff Needed:</span>
                      <strong className="text-white">{req.data.quantity}x {req.data.professionalNeeded}</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap gap-4 pt-1">
                    <span>📅 Start Date: <strong className="text-slate-200">{req.data.startDate}</strong></span>
                    <span>⏱️ Duration: <strong className="text-slate-200">{req.data.duration}</strong></span>
                    <span>🚨 Urgency: <strong className="text-amber-400">{req.data.urgency}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {requests.length > 0 ? (
            <button
              onClick={onClearRequests}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
