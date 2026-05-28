// UPDATED GOOGLE APPS SCRIPT CODE - REPLACE YOUR ENTIRE SCRIPT WITH THIS

function doPost(e) {
  try {
    console.log('doPost function called');
    console.log('Event object:', e);

    // Handle different types of incoming data
    let data;

    if (e.postData && e.postData.contents) {
      console.log('Parsing JSON data');
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      console.log('Using parameter data');
      data = e.parameter;
    } else {
      console.log('No data found in request');
      throw new Error('No data received');
    }

    console.log('Parsed data:', data);

    // Check if this is a waitlist form or contact form
    if (data.formType === 'contact') {
      return handleContactForm(data);
    } else {
      return handleWaitlistForm(data);
    }

  } catch (error) {
    console.error('Error in doPost:', error);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle waitlist form submissions (save to Google Sheet)
function handleWaitlistForm(data) {
  try {
    console.log('Processing waitlist form');

    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    console.log('Sheet name:', sheet.getName());

    // Prepare the row data
    const rowData = [
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
    ];

    console.log('Row data to append:', rowData);

    // Add the data to the sheet
    sheet.appendRow(rowData);
    console.log('Waitlist data successfully added to sheet');

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Waitlist data saved successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error handling waitlist form:', error);
    throw error;
  }
}

// Handle contact form submissions (send email)
function handleContactForm(data) {
  try {
    console.log('Processing contact form');

    // Email details
    const recipientEmail = 'clearcosmeticss@gmail.com';
    const subject = `New Contact Form Submission from ${data.name}`;

    const emailBody = `
New contact form submission from your website:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${data.name}
📧 Email: ${data.email}
📱 Phone: ${data.phone || 'Not provided'}

💬 Message:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Submitted: ${new Date().toLocaleString('en-IE', {
  timeZone: 'Europe/Dublin',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Reply directly to this email to respond to ${data.name}.
    `;

    // Send the email
    console.log('Sending email to:', recipientEmail);
    GmailApp.sendEmail(
      recipientEmail,
      subject,
      emailBody,
      {
        replyTo: data.email,
        name: 'ClearCosmetics Contact Form'
      }
    );

    console.log('Contact form email sent successfully');

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error handling contact form:', error);
    throw error;
  }
}

// Test function for waitlist
function testWaitlistForm() {
  console.log('Testing waitlist form...');

  const testEvent = {
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

  const result = doPost(testEvent);
  console.log('Waitlist test result:', result.getContent());
}

// Test function for contact form
function testContactForm() {
  console.log('Testing contact form...');

  const testEvent = {
    postData: {
      contents: JSON.stringify({
        formType: 'contact',
        name: 'Test Customer',
        email: 'testcustomer@example.com',
        phone: '+353123456789',
        message: 'This is a test message from the contact form. Please ignore this email.',
        timestamp: new Date().toISOString()
      })
    }
  };

  const result = doPost(testEvent);
  console.log('Contact test result:', result.getContent());
}

// Function to check if the sheet has proper headers
function checkSheetHeaders() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const headers = sheet.getRange(1, 1, 1, 10).getValues()[0];

  const expectedHeaders = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Location',
    'Interests', 'Heard About', 'Marketing Consent', 'Privacy Consent', 'Timestamp'
  ];

  console.log('Current headers:', headers);
  console.log('Expected headers:', expectedHeaders);

  // Set headers if they don't exist or are wrong
  if (headers.join('') === '' || JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
    console.log('Setting correct headers...');
    sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
    console.log('Headers set successfully');
  }
}

// Run this to set up your sheet properly
function setupSheet() {
  checkSheetHeaders();
  console.log('Sheet setup complete');
}