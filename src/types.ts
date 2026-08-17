export type OrganizationType =
  | 'Hospital'
  | 'Diagnostic Centre/Laboratory'
  | 'Clinic/Medical Centre'
  | 'Research Institution'
  | 'NGO'
  | 'Medical Outreach Organization'
  | 'Other';

export type ProfessionalNeeded =
  | 'Medical Laboratory Scientist'
  | 'Medical Laboratory Technician'
  | 'Either / No preference';

export type SupportType =
  | 'Duty shift coverage'
  | 'Staff leave/absence coverage'
  | 'Temporary additional staff'
  | 'Emergency/urgent coverage'
  | 'Medical outreach'
  | 'Health screening'
  | 'Other';

export type DurationOption =
  | '1 day'
  | '2–3 days'
  | '4–7 days'
  | '1–2 weeks'
  | '1 month'
  | '2–3 months'
  | '3–6 months'
  | '6+ months'
  | 'Other';

export type ShiftOption =
  | 'Morning'
  | 'Afternoon'
  | 'Night'
  | '24-hour/Full day'
  | 'Flexible'
  | 'Other';

export type WorkingArrangement =
  | 'Working independently'
  | 'Alongside existing laboratory team'
  | 'Mixed / Depends on shift';

export type AccommodationOption = 'Yes' | 'No' | 'To be discussed';

export type UrgencyOption =
  | 'Emergency — need someone as soon as possible'
  | 'Within 24–48 hours'
  | 'Within 3–7 days'
  | 'More than 1 week in advance';

export interface BookingFormData {
  // 1. Organization Details
  orgName: string;
  orgType: OrganizationType | '';
  orgTypeOther?: string;
  orgAddress: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactEmail: string;

  // 2. Staffing Requirement
  professionalNeeded: ProfessionalNeeded;
  quantity: string;
  supportTypes: SupportType[];
  supportTypeOther?: string;
  startDate: string;
  duration: DurationOption | '';
  durationOther?: string;
  preferredShifts: ShiftOption[];
  preferredShiftOther?: string;

  // 3. Assignment Details
  expectedServices: string;
  majorTests: string;
  equipmentExperience: string;
  qualificationsRequired: string;
  workingArrangement: WorkingArrangement;
  additionalResponsibilities: string;

  // 4. Medical Outreach Details
  isMedicalOutreach: 'Yes' | 'No';
  outreachDates?: string;
  outreachLocation?: string;
  estimatedPatients?: string;
  outreachTests?: string;
  outreachStaffCount?: string;
  outreachAccommodation?: AccommodationOption;

  // 5. Urgency & Additional Info
  urgency: UrgencyOption | '';
  additionalInfo: string;

  // 6. Confirmation
  confirmedAuthorized: boolean;
}

export interface SubmittedBooking {
  id: string;
  timestamp: string;
  data: BookingFormData;
  syncedToSheet?: boolean;
}
