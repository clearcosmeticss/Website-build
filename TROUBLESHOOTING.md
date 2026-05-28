# Waitlist Form Troubleshooting Guide

## 🚨 "Error submitting form" - Common Fixes

### Step 1: Check Google Apps Script Setup

**Go to your Google Apps Script project and verify:**

1. **Script Code** - Make sure you have this exact code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();

    // Handle both JSON and form data
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      // Handle form data
      data = e.parameter;
    }

    // Add a new row with the form data
    sheet.appendRow([
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.location || '',
      data.interests || '',
      data.hearAbout || '',
      data.marketing || '',
      data.privacy || '',
      data.timestamp || new Date().toISOString()
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error in doPost:', error);
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

2. **Deployment Settings:**
   - Click "Deploy" → "Manage Deployments"
   - Make sure it's set to:
     - Type: Web app
     - Execute as: Me
     - Who has access: Anyone

3. **Test the Script:**
   - In Apps Script, click the "Run" button
   - It should ask for permissions - ACCEPT ALL
   - Make sure there are no authorization errors

### Step 2: Check Your Google Sheet

**Column Headers (Row 1) must be exactly:**
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

### Step 3: Browser Console Check

1. Open your website
2. Press F12 (or right-click → Inspect)
3. Go to Console tab
4. Try submitting the form
5. Look for any error messages

**Common error messages and fixes:**

- **"CORS error"** → Already fixed in the updated code
- **"Authorization required"** → Run the script in Apps Script first
- **"Unauthorized"** → Check deployment permissions
- **"Script not found"** → Verify the Web App URL

### Step 4: Alternative Testing Method

**Test your Google Apps Script directly:**

1. Go to your Apps Script project
2. Add this test function:

```javascript
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+353123456789',
        location: 'dublin',
        interests: 'botox, fillers',
        hearAbout: 'website',
        marketing: 'Yes',
        privacy: 'Yes',
        timestamp: new Date().toISOString()
      })
    }
  };

  const result = doPost(testData);
  console.log(result.getContent());
}
```

3. Run this test function
4. Check if data appears in your Google Sheet

### Step 5: Quick Fix - Temporary Fallback

If the Google Sheets integration still isn't working, I can add a temporary email fallback:

**Update your script to also send an email with the form data while we fix the Sheets integration.**

---

## 🔧 Quick Fixes to Try Now:

1. **Redeploy your Google Apps Script:**
   - Go to Deploy → New Deployment
   - Get a fresh Web App URL
   - Update the URL in your website code

2. **Check browser console** (F12) when submitting the form

3. **Try the form in an incognito/private browser window**

4. **Make sure you're the owner of the Google Sheet** (not just editor)

Let me know what error messages you see in the browser console!