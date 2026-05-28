// COPY THIS ENTIRE CODE INTO YOUR GOOGLE APPS SCRIPT PROJECT

function doPost(e) {
  try {
    console.log('doPost function called');
    console.log('Event object:', e);

    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    console.log('Sheet name:', sheet.getName());

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
    console.log('Data successfully added to sheet');

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error in doPost:', error);

    // Log detailed error information
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      eventData: e
    });

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function you can run manually
function testDoPost() {
  console.log('Running test...');

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
  console.log('Test result:', result.getContent());
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