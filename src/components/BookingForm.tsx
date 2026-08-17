import React, { useState, forwardRef } from 'react';
import {
  Send,
  Building,
  Users,
  Briefcase,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Check,
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Info,
  Copy,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import {
  BookingFormData,
  OrganizationType,
  ProfessionalNeeded,
  SupportType,
  DurationOption,
  ShiftOption,
  WorkingArrangement,
  AccommodationOption,
  UrgencyOption,
  SubmittedBooking
} from '../types';
import {
  buildWhatsAppUrl,
  submitToGoogleSheetsWebhook,
  saveBookingRequest,
  getSavedWebhookUrl
} from '../utils/formHelpers';

interface BookingFormProps {
  onFormSubmitted: (booking: SubmittedBooking) => void;
}

const initialFormState: BookingFormData = {
  // 1. Organization Details
  orgName: '',
  orgType: '',
  orgTypeOther: '',
  orgAddress: '',
  contactName: '',
  contactPosition: '',
  contactPhone: '',
  contactEmail: '',

  // 2. Staffing Requirement
  professionalNeeded: 'Medical Laboratory Scientist',
  quantity: '1',
  supportTypes: ['Duty shift coverage'],
  supportTypeOther: '',
  startDate: new Date().toISOString().slice(0, 10),
  duration: '1 day',
  durationOther: '',
  preferredShifts: ['Morning'],
  preferredShiftOther: '',

  // 3. Assignment Details
  expectedServices: '',
  majorTests: '',
  equipmentExperience: '',
  qualificationsRequired: '',
  workingArrangement: 'Alongside existing laboratory team',
  additionalResponsibilities: '',

  // 4. Medical Outreach Details
  isMedicalOutreach: 'No',
  outreachDates: '',
  outreachLocation: '',
  estimatedPatients: '',
  outreachTests: '',
  outreachStaffCount: '1',
  outreachAccommodation: 'To be discussed',

  // 5. Urgency & Additional Info
  urgency: 'Within 24–48 hours',
  additionalInfo: '',

  // 6. Confirmation
  confirmedAuthorized: false,
};

export const BookingForm = forwardRef<HTMLDivElement, BookingFormProps>(
  ({ onFormSubmitted }, ref) => {
    const [formData, setFormData] = useState<BookingFormData>(initialFormState);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submittedBooking, setSubmittedBooking] = useState<SubmittedBooking | null>(null);
    const [webhookStatus, setWebhookStatus] = useState<string>('');
    const [validationError, setValidationError] = useState<string>('');
    const [copiedText, setCopiedText] = useState<boolean>(false);

    // Step names for tab navigation
    const steps = [
      { id: 1, name: 'Organization', icon: Building },
      { id: 2, name: 'Staffing Needs', icon: Users },
      { id: 3, name: 'Assignment', icon: Briefcase },
      { id: 4, name: 'Outreach', icon: Calendar },
      { id: 5, name: 'Urgency & Notes', icon: Clock },
      { id: 6, name: 'Confirmation', icon: ShieldCheck },
    ];

    const orgTypeOptions: OrganizationType[] = [
      'Hospital',
      'Diagnostic Centre/Laboratory',
      'Clinic/Medical Centre',
      'Research Institution',
      'NGO',
      'Medical Outreach Organization',
      'Other',
    ];

    const supportTypeOptions: SupportType[] = [
      'Duty shift coverage',
      'Staff leave/absence coverage',
      'Temporary additional staff',
      'Emergency/urgent coverage',
      'Medical outreach',
      'Health screening',
      'Other',
    ];

    const durationOptions: DurationOption[] = [
      '1 day',
      '2–3 days',
      '4–7 days',
      '1–2 weeks',
      '1 month',
      '2–3 months',
      '3–6 months',
      '6+ months',
      'Other',
    ];

    const shiftOptions: ShiftOption[] = [
      'Morning',
      'Afternoon',
      'Night',
      '24-hour/Full day',
      'Flexible',
      'Other',
    ];

    const urgencyOptions: UrgencyOption[] = [
      'Emergency — need someone as soon as possible',
      'Within 24–48 hours',
      'Within 3–7 days',
      'More than 1 week in advance',
    ];

    // Toggle array checkboxes
    const handleCheckboxToggle = (field: 'supportTypes' | 'preferredShifts', item: any) => {
      setFormData((prev) => {
        const current = prev[field] as string[];
        const exists = current.includes(item);
        const updated = exists ? current.filter((x) => x !== item) : [...current, item];
        return { ...prev, [field]: updated };
      });
    };

    // Step validation before moving to next step
    const validateStep = (step: number): boolean => {
      setValidationError('');
      if (step === 1) {
        if (!formData.orgName.trim()) {
          setValidationError('Please enter your Organization Name.');
          return false;
        }
        if (!formData.orgType) {
          setValidationError('Please select your Organization Type.');
          return false;
        }
        if (!formData.orgAddress.trim()) {
          setValidationError('Please enter your Organization Location / Address.');
          return false;
        }
        if (!formData.contactName.trim()) {
          setValidationError('Please enter Contact Person Name.');
          return false;
        }
        if (!formData.contactPhone.trim()) {
          setValidationError('Please enter Phone / WhatsApp number.');
          return false;
        }
        if (!formData.contactEmail.trim()) {
          setValidationError('Please enter Email address.');
          return false;
        }
      } else if (step === 2) {
        if (!formData.professionalNeeded) {
          setValidationError('Please select the professional needed.');
          return false;
        }
        if (!formData.quantity.trim()) {
          setValidationError('Please enter how many professionals you need.');
          return false;
        }
        if (!formData.startDate) {
          setValidationError('Please select when you need the professional.');
          return false;
        }
      } else if (step === 6) {
        if (!formData.confirmedAuthorized) {
          setValidationError('You must confirm that you are authorized to make this staffing request.');
          return false;
        }
      }
      return true;
    };

    const handleNext = () => {
      if (validateStep(currentStep)) {
        setCurrentStep((prev) => Math.min(prev + 1, 6));
        window.scrollTo({ top: ref && typeof ref !== 'function' && ref.current ? ref.current.offsetTop - 100 : 0, behavior: 'smooth' });
      }
    };

    const handleBack = () => {
      setValidationError('');
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateStep(6)) return;

      setIsSubmitting(true);
      setValidationError('');

      const newBooking: SubmittedBooking = {
        id: `REQ-${Math.floor(Math.random() * 899999 + 100000)}`,
        timestamp: new Date().toLocaleString(),
        data: formData,
        syncedToSheet: false,
      };

      // 1. Save to LocalStorage
      saveBookingRequest(newBooking);

      // 2. Submit to Google Sheets Webhook if configured
      const webhookUrl = getSavedWebhookUrl();
      if (webhookUrl) {
        setWebhookStatus('Syncing to Google Sheets...');
        const result = await submitToGoogleSheetsWebhook(webhookUrl, newBooking);
        if (result.success) {
          newBooking.syncedToSheet = true;
          setWebhookStatus('✅ Successfully synced to your Google Sheet!');
        } else {
          setWebhookStatus('⚠️ Webhook submission complete.');
        }
      } else {
        setWebhookStatus('ℹ️ Form submitted.');
      }

      setIsSubmitting(false);
      setSubmittedBooking(newBooking);
      onFormSubmitted(newBooking);

      // 3. Automatically launch WhatsApp in new tab
      const waUrl = buildWhatsAppUrl(formData);
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 300);
    };

    return (
      <div ref={ref} id="booking-form-section" className="py-16 sm:py-20 bg-slate-950 text-slate-100 scroll-mt-20 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Card */}
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Locum Booking Form</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              BOOK A LOCUM TODAY
            </h2>

            <p className="text-slate-300 text-base max-w-2xl mx-auto">
              Get in touch with <strong className="text-cyan-300">Lab Linik Services</strong> and tell us your staffing requirement. We will help you keep your laboratory running smoothly.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Step Navigation Bar */}
            <div className="bg-slate-950 p-4 border-b border-slate-800">
              <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2 scrollbar-none">
                {steps.map((s) => {
                  const Icon = s.icon;
                  const isActive = currentStep === s.id;
                  const isCompleted = currentStep > s.id;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        if (s.id < currentStep || validateStep(currentStep)) {
                          setCurrentStep(s.id);
                        }
                      }}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md'
                          : isCompleted
                          ? 'bg-slate-900 text-cyan-400 border border-slate-800'
                          : 'bg-slate-900/50 text-slate-500 border border-slate-800/50'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center text-[11px]">
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.id}
                      </span>
                      <Icon className="w-4 h-4" />
                      <span>{s.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="mx-6 mt-6 p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-sm flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Submission Success Dialog */}
            {submittedBooking ? (
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-white">
                    LOCUM REQUEST SUBMITTED!
                  </h3>
                  <p className="text-cyan-300 font-medium">
                    Request Reference: <span className="font-bold text-white">{submittedBooking.id}</span>
                  </p>
                  <p className="text-slate-300 text-sm max-w-lg mx-auto">
                    Your request details have been recorded locally and formatted for WhatsApp dispatch.
                  </p>
                </div>

                {/* Status Message */}
                {webhookStatus && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
                    {webhookStatus}
                  </div>
                )}

                {/* Primary WhatsApp Redirect CTA */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-950 border border-emerald-800/80 max-w-xl mx-auto space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-emerald-300 font-bold text-sm">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                    <span>Send directly to 08165686093 via WhatsApp</span>
                  </div>

                  <a
                    href={buildWhatsAppUrl(submittedBooking.data)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base shadow-lg transition-all"
                  >
                    <span>OPEN WHATSAPP & SEND REQUEST</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>

                  <p className="text-xs text-slate-400">
                    If WhatsApp did not open automatically, click the button above to launch WhatsApp with your pre-filled details.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      const text = buildWhatsAppUrl(submittedBooking.data);
                      navigator.clipboard.writeText(text);
                      setCopiedText(true);
                      setTimeout(() => setCopiedText(false), 3000);
                    }}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                  >
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>{copiedText ? 'Copied Message!' : 'Copy Formatted Text'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubmittedBooking(null);
                      setFormData(initialFormState);
                      setCurrentStep(1);
                    }}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                  >
                    <span>Book Another Locum</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                
                {/* STEP 1: ORGANIZATION DETAILS */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <Building className="w-5 h-5 text-cyan-400" />
                        <span>1. Organization Details</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Tell us about your healthcare institution so we know who is making the request.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Organization Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Organization Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. St. Jude Memorial Hospital"
                          value={formData.orgName}
                          onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      {/* Type of Organization */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Type of Organization <span className="text-rose-400">*</span>
                        </label>
                        <select
                          value={formData.orgType}
                          onChange={(e) =>
                            setFormData({ ...formData, orgType: e.target.value as OrganizationType })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                        >
                          <option value="">-- Select Organization Type --</option>
                          {orgTypeOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Other Organization Type text if selected */}
                      {formData.orgType === 'Other' && (
                        <div className="sm:col-span-2 space-y-2">
                          <label className="text-xs font-semibold text-slate-300">
                            Specify Organization Type <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Specify facility type"
                            value={formData.orgTypeOther || ''}
                            onChange={(e) => setFormData({ ...formData, orgTypeOther: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* Address */}
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Organization Address / Location <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 14 Medical Road, Ikeja, Lagos State"
                          value={formData.orgAddress}
                          onChange={(e) => setFormData({ ...formData, orgAddress: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      {/* Contact Person Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Contact Person's Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Samuel Adebayo"
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      {/* Position / Job Title */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Position / Job Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Head of Laboratory Services"
                          value={formData.contactPosition}
                          onChange={(e) => setFormData({ ...formData, contactPosition: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      {/* Phone / WhatsApp */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Phone / WhatsApp Number <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 08012345678"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Email Address <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. labmanager@hospital.com"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: STAFFING REQUIREMENT */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <Users className="w-5 h-5 text-cyan-400" />
                        <span>2. Staffing Requirement</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Select the type of professional, quantity, duration, and shift preferences.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* What professional do you need? */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          What professional do you need? <span className="text-rose-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            'Medical Laboratory Scientist',
                            'Medical Laboratory Technician',
                            'Either / No preference',
                          ].map((prof) => (
                            <button
                              key={prof}
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, professionalNeeded: prof as ProfessionalNeeded })
                              }
                              className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                                formData.professionalNeeded === prof
                                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {prof}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* How many professionals? */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300">
                            How many professionals do you need? <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 1 or 2"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        {/* When do you need the professional(s)? */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300">
                            When do you need the professional(s)? <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Support Type Checkboxes */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          What type of support do you need? (Select all that apply)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {supportTypeOptions.map((st) => {
                            const checked = formData.supportTypes.includes(st);
                            return (
                              <label
                                key={st}
                                onClick={() => handleCheckboxToggle('supportTypes', st)}
                                className={`flex items-center space-x-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                                  checked
                                    ? 'bg-slate-950 border-cyan-500/80 text-white'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    checked ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-slate-700'
                                  }`}
                                >
                                  {checked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span>{st}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* How long will you need the professional(s)? */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          How long will you need the professional(s)?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                          {durationOptions.map((dur) => (
                            <button
                              key={dur}
                              type="button"
                              onClick={() => setFormData({ ...formData, duration: dur })}
                              className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                                formData.duration === dur
                                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {dur}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Preferred shift/work hours */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Preferred shift / work hours
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {shiftOptions.map((sh) => {
                            const checked = formData.preferredShifts.includes(sh);
                            return (
                              <label
                                key={sh}
                                onClick={() => handleCheckboxToggle('preferredShifts', sh)}
                                className={`flex items-center space-x-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                                  checked
                                    ? 'bg-slate-950 border-cyan-500/80 text-white'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    checked ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-slate-700'
                                  }`}
                                >
                                  {checked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span>{sh}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: ASSIGNMENT DETAILS */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <Briefcase className="w-5 h-5 text-cyan-400" />
                        <span>3. Assignment Details</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Helps Lab Linik match the right scientist/technician to your specific lab systems and tests.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          What laboratory services will the professional be expected to perform?
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Hematology routine benchwork, blood group serology, chemistry profile..."
                          value={formData.expectedServices}
                          onChange={(e) => setFormData({ ...formData, expectedServices: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          What are the major tests/services involved?
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. FBC, MP, LFT, EUCr, Lipid profile, Widal, Urinalysis..."
                          value={formData.majorTests}
                          onChange={(e) => setFormData({ ...formData, majorTests: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Is experience with any particular equipment, analyser, or laboratory system required?
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Mindray Hematology Analyzer, Cobas Chemistry, Sysmex, manual microscopy..."
                          value={formData.equipmentExperience}
                          onChange={(e) => setFormData({ ...formData, equipmentExperience: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Are there any specific qualifications, certifications, or experience requirements?
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. MLSCN current practice license required, 2+ years experience..."
                          value={formData.qualificationsRequired}
                          onChange={(e) => setFormData({ ...formData, qualificationsRequired: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Will the professional be working independently or alongside your existing team?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            'Working independently',
                            'Alongside existing laboratory team',
                            'Mixed / Depends on shift',
                          ].map((arr) => (
                            <button
                              key={arr}
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, workingArrangement: arr as WorkingArrangement })
                              }
                              className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                                formData.workingArrangement === arr
                                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {arr}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Any additional responsibilities or expectations?
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Phlebotomy support, sample logging, emergency call-duty..."
                          value={formData.additionalResponsibilities}
                          onChange={(e) => setFormData({ ...formData, additionalResponsibilities: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: MEDICAL OUTREACH DETAILS */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-cyan-400" />
                        <span>4. Medical Outreach Details</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Optional section specifically for community health screenings, field outreach, and mobile labs.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-sm font-semibold text-white">
                          Is this request for a medical outreach?
                        </span>
                        <div className="flex items-center space-x-2">
                          {['Yes', 'No'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, isMedicalOutreach: opt as 'Yes' | 'No' })
                              }
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                formData.isMedicalOutreach === opt
                                  ? 'bg-cyan-400 text-slate-950'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.isMedicalOutreach === 'Yes' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4 sm:space-y-0">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300">Outreach Date(s)</label>
                            <input
                              type="text"
                              placeholder="e.g. Nov 15–18, 2026"
                              value={formData.outreachDates || ''}
                              onChange={(e) => setFormData({ ...formData, outreachDates: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300">Outreach Location</label>
                            <input
                              type="text"
                              placeholder="e.g. Epe Community Centre, Lagos"
                              value={formData.outreachLocation || ''}
                              onChange={(e) => setFormData({ ...formData, outreachLocation: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300">
                              Estimated Patients / Participants
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 200–300 patients"
                              value={formData.estimatedPatients || ''}
                              onChange={(e) => setFormData({ ...formData, estimatedPatients: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300">
                              Number of Lab Staff Required
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 3 Scientists, 2 Technicians"
                              value={formData.outreachStaffCount || ''}
                              onChange={(e) => setFormData({ ...formData, outreachStaffCount: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-2">
                            <label className="text-xs font-semibold text-slate-300">
                              Tests / Services to be provided
                            </label>
                            <textarea
                              rows={2}
                              placeholder="e.g. Blood glucose screening, malaria RDT, blood pressure, HBV/HCV screening..."
                              value={formData.outreachTests || ''}
                              onChange={(e) => setFormData({ ...formData, outreachTests: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-2">
                            <label className="text-xs font-semibold text-slate-300 block">
                              Will accommodation / transportation be provided if required?
                            </label>
                            <div className="flex items-center space-x-3">
                              {(['Yes', 'No', 'To be discussed'] as AccommodationOption[]).map((acc) => (
                                <button
                                  key={acc}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, outreachAccommodation: acc })}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    formData.outreachAccommodation === acc
                                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                                      : 'bg-slate-950 border-slate-800 text-slate-400'
                                  }`}
                                >
                                  {acc}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 5: URGENCY & ADDITIONAL INFO */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-cyan-400" />
                        <span>5. Urgency & Additional Information</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Indicate urgency so our dispatch team can prioritize emergency cover.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">
                          How urgent is your request?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {urgencyOptions.map((urg) => (
                            <button
                              key={urg}
                              type="button"
                              onClick={() => setFormData({ ...formData, urgency: urg })}
                              className={`p-4 rounded-xl border text-xs font-bold text-left transition-all flex items-start space-x-3 ${
                                formData.urgency === urg
                                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                                  formData.urgency === urg
                                    ? 'border-cyan-400 bg-cyan-400'
                                    : 'border-slate-600'
                                }`}
                              >
                                {formData.urgency === urg && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                                )}
                              </div>
                              <span>{urg}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Is there anything else we should know about your requirement?
                        </label>
                        <textarea
                          rows={3}
                          placeholder="e.g. Parking instructions, security protocols, preferred lab coats, specific shift handovers..."
                          value={formData.additionalInfo}
                          onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: CONFIRMATION */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <ShieldCheck className="w-5 h-5 text-cyan-400" />
                        <span>6. Confirmation & Submission</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Please review your summary and confirm authorization to submit.
                      </p>
                    </div>

                    {/* Summary Card */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                      <div className="flex justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">Organization:</span>
                        <span className="font-bold text-white">{formData.orgName || 'N/A'} ({formData.orgType || 'N/A'})</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">Contact:</span>
                        <span className="font-bold text-cyan-300">{formData.contactName} ({formData.contactPhone})</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">Staff Needed:</span>
                        <span className="font-bold text-white">{formData.quantity}x {formData.professionalNeeded}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">Start Date / Duration:</span>
                        <span className="font-bold text-white">{formData.startDate} ({formData.duration})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Urgency:</span>
                        <span className="font-bold text-amber-400">{formData.urgency}</span>
                      </div>
                    </div>

                    {/* Required Authorization Checkbox */}
                    <label className="flex items-start space-x-3 p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-cyan-500/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.confirmedAuthorized}
                        onChange={(e) => setFormData({ ...formData, confirmedAuthorized: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 mt-0.5 bg-slate-900"
                      />
                      <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                        I confirm that the information provided is accurate and that I am authorized to make this staffing request on behalf of the organization.
                      </span>
                    </label>

                    {/* Final Submission Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.confirmedAuthorized}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 hover:from-teal-300 hover:to-cyan-300 disabled:opacity-50 text-slate-950 font-extrabold text-base shadow-xl transition-all flex items-center justify-center space-x-3"
                    >
                      <Send className="w-5 h-5" />
                      <span>{isSubmitting ? 'PROCESSING REQUEST...' : 'SUBMIT LOCUM REQUEST'}</span>
                    </button>
                  </div>
                )}

                {/* Form Footer Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors border border-slate-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  ) : <div />}

                  {currentStep < 6 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs sm:text-sm font-extrabold shadow-md transition-colors"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </form>
            )}

          </div>

        </div>
      </div>
    );
  }
);

BookingForm.displayName = 'BookingForm';
