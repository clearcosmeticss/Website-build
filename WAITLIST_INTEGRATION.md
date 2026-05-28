# Waitlist Form - Google Sheets Integration Guide

This guide will help you connect your custom waitlist form to Google Sheets for easy lead tracking.

## 🎯 What You'll Get

Your waitlist form will automatically send the following data to your Google Sheet:
- First Name
- Last Name
- Email Address
- Phone Number
- Preferred Clinic Location
- Treatment Interests
- How they heard about you
- Marketing consent
- Privacy consent
- Timestamp

## 📋 Setup Instructions

### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "ClearCollective Waitlist"
4. In the first row, add these column headers:

```
A1: First Name
B1: Last Name
C1: Email
D1: Phone
E1: Location
F1: Interests
G1: Heard About
H1: Marketing Consent
I1: Privacy Consent
J1: Timestamp
```

### Step 2: Create Google Apps Script

1. In your Google Sheet, go to `Extensions` → `Apps Script`
2. Delete any existing code and paste this script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Add a new row with the form data
    sheet.appendRow([
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.location,
      data.interests,
      data.hearAbout,
      data.marketing,
      data.privacy,
      data.timestamp
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Save the script (Ctrl+S or Cmd+S)
4. Click `Deploy` → `New Deployment`
5. Choose "Web app" as the type
6. Set these options:
   - Execute as: `Me`
   - Who has access: `Anyone`
7. Click `Deploy`
8. **IMPORTANT:** Copy the Web App URL - you'll need this!

### Step 3: Update Your Website Code

1. Open your `script.js` file
2. Find the `submitToGoogleSheets` function (around line 1118)
3. Replace the placeholder URL with your actual Web App URL:

```javascript
async function submitToGoogleSheets(data) {
    try {
        const response = await fetch('YOUR_WEB_APP_URL_HERE', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result.success;

    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        return false;
    }
}
```

4. Replace `YOUR_WEB_APP_URL_HERE` with the Web App URL you copied in Step 2

### Step 4: Test Your Integration

1. Open your website
2. Click "Join the Waitlist 💕"
3. Fill out the form with test data
4. Submit the form
5. Check your Google Sheet - the data should appear in a new row!

## 🔒 Security & Privacy

- The Google Apps Script only accepts POST requests
- No sensitive data is logged in the browser console
- All form validations happen client-side first
- Privacy consent is tracked for GDPR compliance

## 📊 Enhanced Tracking (Optional)

### Add Form Analytics

Add this to your Google Apps Script for additional tracking:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Add additional tracking data
    const enrichedData = [
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.location,
      data.interests,
      data.hearAbout,
      data.marketing,
      data.privacy,
      data.timestamp,
      new Date(), // Server timestamp
      e.parameter.userAgent || 'Unknown', // Browser info
      data.referrer || 'Direct' // Referrer info
    ];

    sheet.appendRow(enrichedData);

    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Email Notifications

To get email notifications when someone joins the waitlist, add this to your Apps Script:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Add to sheet
    sheet.appendRow([
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.location,
      data.interests,
      data.hearAbout,
      data.marketing,
      data.privacy,
      data.timestamp
    ]);

    // Send email notification
    const subject = `New Waitlist Signup: ${data.firstName} ${data.lastName}`;
    const body = `
New waitlist signup details:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Location: ${data.location}
Interests: ${data.interests}
Heard About: ${data.hearAbout}
Marketing Consent: ${data.marketing}

View the full spreadsheet: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
    `;

    // Replace with your email
    GmailApp.sendEmail('your-email@example.com', subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 🚀 Going Live

1. Complete all setup steps above
2. Test thoroughly with various form inputs
3. Monitor your Google Sheet for the first few submissions
4. Set up email notifications if desired
5. Consider adding the Google Sheet to Google Analytics for deeper insights

## 🛠️ Troubleshooting

**Form not submitting?**
- Check browser console for errors
- Verify the Web App URL is correct
- Ensure the Apps Script is deployed as a web app

**Data not appearing in Google Sheets?**
- Check if the spreadsheet has the correct column headers
- Verify the Apps Script has permission to access the sheet
- Look at the Apps Script execution logs for errors

**Need help?**
The form is set up to show success/error messages to users, and all errors are logged to the browser console for debugging.

## 📈 Data Export

Your Google Sheet data can be easily exported to:
- CSV files for email marketing tools
- Excel files for advanced analysis
- Other CRM systems via Google Sheets API
- Automated email marketing platforms

---

**Your waitlist form is now ready to capture and track leads automatically! 🎉**