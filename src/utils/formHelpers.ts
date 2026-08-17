import { BookingFormData, SubmittedBooking } from '../types';
import { SALES_COPY } from '../data/copy';

/**
 * Constructs a crisp, professional, formatted WhatsApp message URL for sending to Lab Linik Services.
 */
export function buildWhatsAppUrl(formData: BookingFormData): string {
  const phone = SALES_COPY.header.whatsappNumber; // 2348165686093

  const lines: string[] = [
    `🔬 *NEW LOCUM REQUEST — LAB LINIK SERVICES*`,
    `──────────────────────────────`,
    `🏢 *1. ORGANIZATION DETAILS*`,
    `• *Org Name:* ${formData.orgName}`,
    `• *Org Type:* ${formData.orgType === 'Other' ? formData.orgTypeOther : formData.orgType}`,
    `• *Location:* ${formData.orgAddress}`,
    `• *Contact Person:* ${formData.contactName} ${formData.contactPosition ? `(${formData.contactPosition})` : ''}`,
    `• *Phone/WA:* ${formData.contactPhone}`,
    `• *Email:* ${formData.contactEmail}`,
    ``,
    `📋 *2. STAFFING REQUIREMENT*`,
    `• *Professional Needed:* ${formData.professionalNeeded}`,
    `• *Quantity:* ${formData.quantity} professional(s)`,
    `• *Support Type:* ${formData.supportTypes.join(', ') || 'N/A'}`,
    `• *Start Date:* ${formData.startDate}`,
    `• *Duration:* ${formData.duration === 'Other' ? formData.durationOther : formData.duration}`,
    `• *Shift/Hours:* ${formData.preferredShifts.join(', ') || 'Flexible'}`,
    ``,
    `🧪 *3. ASSIGNMENT DETAILS*`,
    `• *Expected Services:* ${formData.expectedServices || 'Standard lab duties'}`,
    `• *Major Tests:* ${formData.majorTests || 'Routine diagnostic tests'}`,
    `• *Equipment/Analyzers:* ${formData.equipmentExperience || 'Standard equipment'}`,
    `• *Qualifications:* ${formData.qualificationsRequired || 'Certified Scientist/Technician'}`,
    `• *Arrangement:* ${formData.workingArrangement}`,
    `• *Additional Responsibilities:* ${formData.additionalResponsibilities || 'None'}`,
  ];

  if (formData.isMedicalOutreach === 'Yes') {
    lines.push(
      ``,
      `🏥 *4. MEDICAL OUTREACH DETAILS*`,
      `• *Outreach Dates:* ${formData.outreachDates || 'TBD'}`,
      `• *Location:* ${formData.outreachLocation || 'TBD'}`,
      `• *Est. Patients:* ${formData.estimatedPatients || 'TBD'}`,
      `• *Tests:* ${formData.outreachTests || 'Screening tests'}`,
      `• *Staff Required:* ${formData.outreachStaffCount || formData.quantity}`,
      `• *Accommodation/Transport:* ${formData.outreachAccommodation || 'To be discussed'}`
    );
  }

  lines.push(
    ``,
    `🚨 *5. URGENCY & ADDITIONAL NOTES*`,
    `• *Urgency:* ${formData.urgency || 'Normal'}`,
    `• *Additional Info:* ${formData.additionalInfo || 'None'}`,
    ``,
    `✅ *Authorization:* Confirmed by ${formData.contactName}`,
    `──────────────────────────────`,
    `Please review my locum staffing request and get back to me promptly!`
  );

  const fullText = lines.join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(fullText)}`;
}

/**
 * Submits form payload to a custom Google Apps Script Webhook URL if configured.
 */
export async function submitToGoogleSheetsWebhook(
  webhookUrl: string,
  submission: SubmittedBooking
): Promise<{ success: boolean; error?: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, error: 'No valid Google Webhook URL provided.' };
  }

  try {
    const payload = {
      id: submission.id,
      timestamp: submission.timestamp,
      ...submission.data,
    };

    // Use mode 'no-cors' fallback if CORS preflight blocks, or standard fetch
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (err: any) {
    console.error('Google Sheets submission error:', err);
    return { success: false, error: err?.message || 'Failed to connect to Google Sheets Webhook.' };
  }
}

/**
 * Local Storage helpers for persisting submitted requests and Google Sheets Webhook URL settings.
 */
const STORAGE_KEY_REQUESTS = 'lab_linik_submitted_requests_v1';
const STORAGE_KEY_SHEET_URL = 'lab_linik_google_sheet_url_v1';

export function getSavedRequests(): SubmittedBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REQUESTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookingRequest(booking: SubmittedBooking): void {
  try {
    const existing = getSavedRequests();
    const updated = [booking, ...existing];
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save booking to localStorage', err);
  }
}

export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxJo6ZjPVcPJgPSTD-2s3iBZhZqVMkwks-DU1yh2-PUC7ujFlwyPEr1es5be7MfK1N0ow/exec';

export function getSavedWebhookUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_SHEET_URL) || DEFAULT_WEBHOOK_URL;
  } catch {
    return DEFAULT_WEBHOOK_URL;
  }
}

export function saveWebhookUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SHEET_URL, url.trim());
  } catch (err) {
    console.error('Failed to save webhook URL to localStorage', err);
  }
}

/**
 * Export saved requests as downloadable CSV file.
 */
export function exportToCSV(requests: SubmittedBooking[]): void {
  if (requests.length === 0) return;

  const headers = [
    'Request ID',
    'Date Submitted',
    'Organization Name',
    'Organization Type',
    'Contact Name',
    'Phone',
    'Email',
    'Professional Needed',
    'Quantity',
    'Start Date',
    'Duration',
    'Urgency'
  ];

  const rows = requests.map((r) => [
    `"${r.id}"`,
    `"${r.timestamp}"`,
    `"${r.data.orgName.replace(/"/g, '""')}"`,
    `"${r.data.orgType}"`,
    `"${r.data.contactName.replace(/"/g, '""')}"`,
    `"${r.data.contactPhone}"`,
    `"${r.data.contactEmail}"`,
    `"${r.data.professionalNeeded}"`,
    `"${r.data.quantity}"`,
    `"${r.data.startDate}"`,
    `"${r.data.duration}"`,
    `"${r.data.urgency}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Lab_Linik_Locum_Requests_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
