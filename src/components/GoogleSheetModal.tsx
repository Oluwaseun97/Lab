import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  Copy,
  Check,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/googleScriptCode';
import { getSavedWebhookUrl, saveWebhookUrl } from '../utils/formHelpers';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({ isOpen, onClose }) => {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setWebhookUrl(getSavedWebhookUrl());
      setSavedSuccess(false);
      setTestStatus('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveUrl = () => {
    saveWebhookUrl(webhookUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      setTestStatus('❌ Please enter a valid URL ending in /exec');
      return;
    }

    setIsTesting(true);
    setTestStatus('Testing connection...');

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          id: 'TEST-PING',
          timestamp: new Date().toLocaleString(),
          orgName: 'Test Organization Ping',
          contactName: 'Lab Linik Tester',
          professionalNeeded: 'Medical Laboratory Scientist',
          quantity: '1',
          urgency: 'Test Ping',
        }),
      });

      setTestStatus('✅ Ping sent to Google Sheets! Check your sheet for the test row.');
    } catch (err: any) {
      setTestStatus(`⚠️ Webhook triggered (Note: Browser CORS limits may prevent reading response directly, but check your Sheet to confirm row added!).`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Google Sheets Integration & Script</h3>
              <p className="text-xs text-slate-400">Auto-sync all form details directly into your Google Sheet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm">
          
          {/* Step 1: Webhook URL Input */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center space-x-2">
                <span>1. Enter Your Deployed Google Sheet Web App URL</span>
              </label>
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saved!</span>
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={handleSaveUrl}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save URL</span>
              </button>
            </div>

            {webhookUrl && (
              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={handleTestWebhook}
                  disabled={isTesting}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-2 border border-slate-700"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isTesting ? 'Testing...' : 'Test Ping Sheet'}</span>
                </button>
                {testStatus && <span className="text-xs text-slate-300">{testStatus}</span>}
              </div>
            )}
          </div>

          {/* Step 2: Google Apps Script Code */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">
                2. Copy the Google Apps Script Code
              </h4>
              <button
                onClick={handleCopyScript}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Code Copied!' : 'Copy Entire Code.gs'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-cyan-200/90 overflow-x-auto max-h-56">
              <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
            </div>
          </div>

          {/* Step 3: Setup Instructions */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>3. How to Deploy in 2 Minutes:</span>
            </h4>

            <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed pl-1">
              <li>
                Open <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Google Sheets</a> and create a blank spreadsheet named <strong className="text-white">"Lab Linik Locum Requests"</strong>.
              </li>
              <li>
                In the top menu, click <strong className="text-white">Extensions &gt; Apps Script</strong>.
              </li>
              <li>
                Erase any code inside <code className="text-cyan-300">Code.gs</code>, paste the code copied above, and save (Ctrl+S / Cmd+S).
              </li>
              <li>
                Click <strong className="text-white">Deploy &gt; New deployment</strong>.
              </li>
              <li>
                Click the gear icon next to "Select type" and select <strong className="text-white">Web app</strong>.
              </li>
              <li>
                Set <strong className="text-white">"Execute as"</strong> to <code className="text-cyan-300">Me</code> and <strong className="text-emerald-400">"Who has access"</strong> to <code className="text-emerald-400">Anyone</code>.
              </li>
              <li>
                Click <strong className="text-white">Deploy</strong>, grant permissions, copy the <strong className="text-white">Web App URL</strong>, and paste it into field #1 above!
              </li>
            </ol>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
