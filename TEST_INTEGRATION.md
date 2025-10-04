# Integration Test Guide

Your Google Sheets integration is now configured! Here's how to test it:

## ✅ Configuration Complete

- **Sheet ID:** `1ff56G3Mk1gsOpcLCTHc9l_7RlhYxnAdiTvxCyHKLpqk`
- **Web App URL:** `https://script.google.com/macros/s/AKfycbyun8IQ6DddKXOTd6vC9LzPvc3KbAuVY7ex9cRQTx_CSHqGWeigXFAIpP7ywXQvDJ31/exec`
- **Extension:** Updated with your URLs

## 🧪 Testing Steps

### Step 1: Update Google Apps Script

1. Go to your [Google Apps Script project](https://script.google.com/)
2. Replace the existing code with the updated `google-apps-script.js` file
3. **Save** the project (Ctrl+S)
4. **Deploy** → **Manage deployments** → **Edit** (pencil icon)
5. Click **Deploy** to update the web app

### Step 2: Test the Web App

1. Open this URL in your browser:
   ```
   https://script.google.com/macros/s/AKfycbyun8IQ6DddKXOTd6vC9LzPvc3KbAuVY7ex9cRQTx_CSHqGWeigXFAIpP7ywXQvDJ31/exec
   ```
2. You should see: `{"success":true,"message":"Concentration Tracker API is running",...}`

### Step 3: Test the Chrome Extension

1. **Reload the extension** in Chrome:
   - Go to `chrome://extensions/`
   - Find "Concentration Tracker"
   - Click the refresh button (🔄)

2. **Test a focus session:**
   - Click the extension icon
   - Click "Start Focus"
   - Wait 10-15 seconds
   - Click "Stop Session"
   - Click "Send Data"

3. **Check for success:**
   - You should see "Data sent successfully!" message
   - Check your Google Sheet for new data

## 🔍 Troubleshooting

### If the web app test fails:
- Make sure you updated the Google Apps Script code
- Check that the deployment was successful
- Verify the Sheet ID is correct

### If the extension test fails:
- Check the browser console (F12) for errors
- Make sure the extension was reloaded
- Verify the Web App URL is accessible

### If data doesn't appear in the sheet:
- Check the Google Apps Script logs
- Verify the Sheet ID and permissions
- Make sure the sheet exists and is accessible

## 📊 Expected Results

After a successful test, your Google Sheet should have:
- A new sheet tab called "Concentration Data"
- Headers in TED red color
- One row of data from your test session

## 🎯 Ready for Production

Once the test is successful, your integration is ready for the TED concentration experiment! Participants can now:
- Track their focus sessions
- Submit data anonymously
- Contribute to the research database

The data will be automatically collected in your Google Sheet for analysis.
