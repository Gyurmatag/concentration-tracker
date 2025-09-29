# Installation Guide

## How to Install and Test the Concentration Tracker Extension

### Step 1: Load the Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the `concentration-tracker` folder
6. The extension should now appear in your extensions list

### Step 2: Pin the Extension

1. Click the puzzle piece icon in Chrome's toolbar
2. Find "Concentration Tracker" and click the pin icon
3. The extension icon will now be visible in your toolbar

### Step 3: Test the Functionality

1. **Click the extension icon** to open the popup
2. **Click "Start Focus"** to begin a timer session
3. **Watch the timer** count up in real-time
4. **Click "Stop"** to end the session
5. **Check the session count** - it should increment
6. **Click "Send Data"** to see the data summary
7. **Click "About"** to read the experiment information

### Step 4: Test Persistence

1. Start a timer session
2. Close the popup (click elsewhere)
3. Reopen the popup - the timer should still be running
4. Stop the timer and verify the session was saved

### Expected Behavior

- ✅ Timer starts and counts up
- ✅ Stop button becomes enabled when timer is running
- ✅ Session data is saved locally
- ✅ Daily session count updates
- ✅ Timer persists across popup closes
- ✅ Send button shows data summary
- ✅ Info modal displays experiment details
- ✅ Beautiful gradient UI with smooth animations

### Troubleshooting

If the extension doesn't work:
1. Check the Chrome console for errors (F12 → Console)
2. Reload the extension in `chrome://extensions/`
3. Make sure all files are present in the folder
4. Verify the manifest.json is valid

### Next Steps

The basic timer functionality is complete! The next phase would be to add Google Sheets integration for automatic data submission to the research database.
