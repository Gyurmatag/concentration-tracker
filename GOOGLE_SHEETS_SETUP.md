# Google Sheets Integration Setup Guide

This guide will help you set up the Google Sheets integration for the Concentration Tracker extension.

## 📋 Prerequisites

- Google account
- Access to Google Sheets and Google Apps Script
- The Concentration Tracker Chrome extension

## 🚀 Step-by-Step Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click "Blank" to create a new spreadsheet
3. Name it "TED Concentration Experiment Data"
4. **Copy the Sheet ID** from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the part between `/d/` and `/edit`

### Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the code from `google-apps-script.js` file
5. **Update the configuration:**
   - Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
   - Optionally change `SHEET_NAME` if you want a different tab name

### Step 3: Deploy as Web App

1. In Google Apps Script, click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set the following:
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
4. Click "Deploy"
5. **Copy the Web App URL** - you'll need this for the extension

### Step 4: Update Chrome Extension

1. Open `popup.js` in the extension folder
2. Find this line:
   ```javascript
   this.googleScriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace with your actual Web App URL:
   ```javascript
   this.googleScriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

### Step 5: Test the Integration

1. **Reload the extension** in Chrome:
   - Go to `chrome://extensions/`
   - Find "Concentration Tracker"
   - Click the refresh button (🔄)

2. **Test data submission:**
   - Start and stop a focus session
   - Click "Send Data"
   - Check your Google Sheet for new data

## 🔧 Troubleshooting

### Common Issues:

**"Google Apps Script URL not configured"**
- Make sure you updated the URL in `popup.js`
- Check that the URL is correct and accessible

**"Error: HTTP 403"**
- Make sure the Web App is deployed with "Anyone" access
- Check that the Google Apps Script is published

**"Error: HTTP 404"**
- Verify the Web App URL is correct
- Make sure the deployment was successful

**Data not appearing in sheet:**
- Check the Sheet ID is correct in the Google Apps Script
- Verify the sheet name matches the configuration
- Check the Google Apps Script logs for errors

### Testing the Setup:

1. **Test the Google Apps Script directly:**
   - In Google Apps Script, click "Run" on the `testSetup` function
   - Check the logs for any errors

2. **Test the Chrome extension:**
   - Open the extension popup
   - Complete a focus session
   - Try sending data
   - Check the browser console for errors (F12)

## 📊 Data Structure

The Google Sheet will contain these columns:

| Column | Description | Example |
|--------|-------------|---------|
| Timestamp | When data was submitted | 2024-09-29T14:30:25.000Z |
| Session ID | Unique session identifier | sess_user_abc123_1696005025000_xyz45 |
| Date | Session date | 2024-09-29 |
| Start Time | Session start time | 14:15:30 |
| End Time | Session end time | 14:30:25 |
| Duration (seconds) | Focus duration in seconds | 890 |
| Duration (formatted) | Human readable duration | 14:50 |
| Participant ID | Anonymous participant ID | user_abc123 |
| Browser Info | Browser version | Chrome 120.0.0.0 |
| Experiment Version | Extension version | 1.0 |
| Submission Timestamp | When data was sent | 2024-09-29T14:30:25.000Z |

## 🔒 Privacy & Security

- **Anonymous data collection:** No personal information is collected
- **Participant IDs:** Generated randomly, not linked to user accounts
- **Data storage:** Stored in your Google Sheet, you control access
- **No tracking:** No cookies or tracking beyond the experiment data

## 📈 Data Analysis

Once you have data, you can:

1. **Export to CSV** for analysis in Excel/Google Sheets
2. **Create charts** to visualize focus patterns
3. **Filter by participant** to see individual patterns
4. **Calculate statistics** like average focus time, session frequency

## 🆘 Need Help?

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Check Google Apps Script logs for server-side errors
3. Verify all URLs and IDs are correct
4. Test with a simple focus session first

## ✅ Verification Checklist

- [ ] Google Sheet created and ID copied
- [ ] Google Apps Script code deployed
- [ ] Web App URL copied to extension
- [ ] Extension reloaded in Chrome
- [ ] Test session completed successfully
- [ ] Data appears in Google Sheet
- [ ] No error messages in console

Once all items are checked, your integration is ready for the TED concentration experiment! 🎯
