/**
 * Google Apps Script for Concentration Tracker Data Collection
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this code
 * 4. Create a new Google Sheet for data collection
 * 5. Update the SPREADSHEET_ID in the code below
 * 6. Deploy as a web app with "Anyone with Google account" access
 * 7. Copy the web app URL to the Chrome extension
 */

// CONFIGURATION - UPDATED WITH YOUR VALUES
const SPREADSHEET_ID = '1vnMQkdeGkG9z0wiud0K9nUyvk5w8uimRposlvFyecS4'; // Your Google Sheet ID
const SHEET_NAME = 'Concentration Data'; // Name of the sheet tab

// Basic configuration

/**
 * Handle GET requests (required for web app deployment)
 */
function doGet(e) {
  try {
    // Check if data is being submitted via GET request
    if (e.parameter && e.parameter.data) {
      // Parse the data from URL parameter
      const data = JSON.parse(e.parameter.data);
      
      // Validate the data
      if (!data.sessions || !Array.isArray(data.sessions)) {
        return createResponse(false, 'Invalid data format: sessions array required');
      }
      
      if (!data.participantId) {
        return createResponse(false, 'Invalid data format: participantId required');
      }
      
      // Process each session
      const results = [];
      for (const session of data.sessions) {
        const result = addSessionToSheet(session, data);
        results.push(result);
      }
      
      // Log the submission
      console.log(`Processed ${results.length} sessions for participant ${data.participantId}`);
      
      return createResponse(true, `Successfully processed ${results.length} sessions`, {
        sessionsProcessed: results.length,
        participantId: data.participantId
      });
    } else {
      // Health check - return API status
      return createResponse(true, 'Concentration Tracker API is running', {
        version: '1.0',
        status: 'active',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error processing GET request:', error);
    return createResponse(false, `Error processing request: ${error.message}`);
  }
}

/**
 * Handle POST requests (fallback for direct POST calls)
 */
function doPost(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'POST endpoint working!',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * Add a single session to the Google Sheet
 */
function addSessionToSheet(session, metadata) {
  try {
    const sheet = getOrCreateSheet();
    
        // Prepare the row data - matching your exact column structure
        const rowData = [
          new Date().toISOString(), // timestamp
          generateSessionId(session, metadata.participantId), // session_id
          session.date, // date
          session.startTime, // start_time (timestamp)
          session.endTime, // end_time (timestamp)
          Math.floor(session.duration / 1000), // duration_seconds
          session.predictedDuration ? Math.floor(session.predictedDuration / 1000) : '', // predicted_duration_seconds
          session.detectionTime, // detection_time (timestamp when user detected focus loss)
          session.estimatedFocusDuration !== null && session.estimatedFocusDuration !== undefined ? Math.floor(session.estimatedFocusDuration / 1000) : '', // estimated_focus_seconds
          metadata.participantId, // participant_id
          metadata.browserInfo || 'Unknown', // browser_info
          metadata.experimentVersion || '1.0', // experiment_version
          metadata.timestamp || new Date().toISOString() // submission_timestamp
        ];
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    return { success: true, sessionId: rowData[1] };
    
  } catch (error) {
    console.error('Error adding session to sheet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get or create the data sheet
 */
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // Create the sheet with headers
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    
        // Add headers - matching your exact column structure
        const headers = [
          'Timestamp',
          'Session ID',
          'Date',
          'Start Time (timestamp)',
          'End Time (timestamp)',
          'Duration (seconds)',
          'Predicted Duration (seconds)',
          'Detection Time (timestamp)',
          'Estimated Focus (seconds)',
          'Participant ID',
          'Browser Info',
          'Experiment Version',
          'Submission Timestamp'
        ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format the header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#E62B1E'); // TED red
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    
    // Freeze the header row
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
  
  return sheet;
}

/**
 * Generate a unique session ID
 */
function generateSessionId(session, participantId) {
  const timestamp = new Date(session.startTime).getTime();
  const random = Math.random().toString(36).substr(2, 5);
  return `sess_${participantId}_${timestamp}_${random}`;
}

/**
 * Format a timestamp to time string
 */
function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'HH:mm:ss');
}

/**
 * Format duration in milliseconds to readable format
 */
function formatDuration(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Create a JSON response with CORS headers
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle OPTIONS request for CORS preflight
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Test function to verify the setup
 */
function testSetup() {
  console.log('Testing Google Apps Script setup...');

  // Test data
  const testData = {
    sessions: [{
      startTime: Date.now() - 300000, // 5 minutes ago
      endTime: Date.now(),
      duration: 300000, // 5 minutes
      predictedDuration: 360000, // 6 minutes predicted
      detectionTime: Date.now(),
      estimatedFocusDuration: 240000, // 4 minutes estimated actual focus
      date: new Date().toISOString().split('T')[0]
    }],
    participantId: 'test_user_123',
    browserInfo: 'Chrome Test',
    experimentVersion: '1.0',
    timestamp: new Date().toISOString()
  };

  // Simulate a GET request with data parameter
  const mockEvent = {
    parameter: {
      data: JSON.stringify(testData)
    }
  };

  const result = doGet(mockEvent);
  console.log('Test result:', result.getContent());

  return result;
}

/**
 * Simple test to check sheet access
 */
function testSheetAccess() {
  try {
    console.log('Testing sheet access...');
    console.log('Spreadsheet ID:', SPREADSHEET_ID);
    console.log('Sheet Name:', SHEET_NAME);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Spreadsheet opened successfully');
    console.log('Spreadsheet name:', spreadsheet.getName());
    
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      console.log('Sheet not found, creating it...');
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      console.log('Sheet created successfully');
    } else {
      console.log('Sheet found:', sheet.getName());
    }
    
    // Test adding a simple row
    const testRow = [new Date().toISOString(), 'TEST_ROW', 'Test Data'];
    sheet.appendRow(testRow);
    console.log('Test row added successfully');
    
    return 'SUCCESS: Sheet access working';
  } catch (error) {
    console.error('Sheet access error:', error);
    return 'ERROR: ' + error.message;
  }
}
