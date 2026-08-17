export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * LAB LINIK SERVICES — GOOGLE SHEETS FORM INTEGRATION SCRIPT
 * 
 * INSTRUCTIONS TO SET UP YOUR GOOGLE SHEET BACKEND:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new blank spreadsheet.
 * 2. Name your spreadsheet "Lab Linik Locum Requests".
 * 3. In the top menu, click "Extensions" > "Apps Script".
 * 4. Erase any existing code in the editor and PASTE THIS ENTIRE SCRIPT below.
 * 5. Click the "Save" icon (or press Ctrl+S / Cmd+S).
 * 6. Click "Deploy" > "New deployment".
 * 7. Click the gear icon next to "Select type" and choose "Web app".
 * 8. Set the configuration:
 *    - Description: "Lab Linik Booking Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (CRITICAL: Do NOT select "Only me", select "Anyone").
 * 9. Click "Deploy", authorize permissions when prompted.
 * 10. Copy the generated "Web App URL" (ends in /exec).
 * 11. Paste that URL into the "Google Sheets Webhook Settings" inside the Lab Linik app!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var contents = e.postData ? JSON.parse(e.postData.contents) : {};
    
    // Auto-create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp",
        "Request ID",
        "Organization Name",
        "Organization Type",
        "Organization Address",
        "Contact Person",
        "Position/Title",
        "Phone / WhatsApp",
        "Email Address",
        "Professional Needed",
        "Quantity",
        "Support Types",
        "Start Date",
        "Duration",
        "Preferred Shifts",
        "Expected Services",
        "Major Tests",
        "Equipment Experience",
        "Qualifications Required",
        "Working Arrangement",
        "Additional Responsibilities",
        "Medical Outreach?",
        "Outreach Dates",
        "Outreach Location",
        "Estimated Patients",
        "Outreach Tests",
        "Outreach Staff Count",
        "Outreach Accommodation",
        "Urgency Level",
        "Additional Notes",
        "Authorized Confirmation"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0A2540");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
    
    // Extract row data
    var row = [
      contents.timestamp || new Date().toLocaleString(),
      contents.id || "REQ-" + Math.floor(Math.random() * 899999 + 100000),
      contents.orgName || "",
      contents.orgType === "Other" ? "Other (" + (contents.orgTypeOther || "") + ")" : (contents.orgType || ""),
      contents.orgAddress || "",
      contents.contactName || "",
      contents.contactPosition || "",
      contents.contactPhone || "",
      contents.contactEmail || "",
      contents.professionalNeeded || "",
      contents.quantity || "1",
      Array.isArray(contents.supportTypes) ? contents.supportTypes.join(", ") : (contents.supportTypes || ""),
      contents.startDate || "",
      contents.duration === "Other" ? "Other (" + (contents.durationOther || "") + ")" : (contents.duration || ""),
      Array.isArray(contents.preferredShifts) ? contents.preferredShifts.join(", ") : (contents.preferredShifts || ""),
      contents.expectedServices || "",
      contents.majorTests || "",
      contents.equipmentExperience || "",
      contents.qualificationsRequired || "",
      contents.workingArrangement || "",
      contents.additionalResponsibilities || "",
      contents.isMedicalOutreach || "No",
      contents.outreachDates || "N/A",
      contents.outreachLocation || "N/A",
      contents.estimatedPatients || "N/A",
      contents.outreachTests || "N/A",
      contents.outreachStaffCount || "N/A",
      contents.outreachAccommodation || "N/A",
      contents.urgency || "Normal",
      contents.additionalInfo || "",
      contents.confirmedAuthorized ? "YES (Authorized)" : "NO"
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", message: "Booking recorded successfully!" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", message: "Lab Linik Services Webhook is online." }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
