# Chrome Web Store Publishing Guide

This guide will help you publish the Concentration Tracker extension to the Chrome Web Store as an **unlisted** extension (downloadable only with a direct link).

## 📋 **Prerequisites**

- Google account
- $5 one-time registration fee for Chrome Web Store
- Extension package ready (✅ `concentration-tracker-extension.zip` created)

## 🚀 **Step-by-Step Publishing Process**

### **Step 1: Register for Chrome Web Store Developer Account**

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account
3. Pay the **$5 one-time registration fee**
4. Complete the developer registration process

### **Step 2: Upload Your Extension**

1. **Click "Add new item"** in the developer dashboard
2. **Upload the ZIP file:**
   - Click "Choose file"
   - Select `concentration-tracker-extension.zip`
   - Click "Upload"

### **Step 3: Fill Out Store Listing**

#### **Basic Information:**
- **Name:** `Concentration Tracker`
- **Summary:** `Track your focus time for the TED concentration experiment`
- **Description:** 
```
A Chrome extension for tracking focus time as part of a TED community science research project on attention and concentration.

Features:
• Start/Stop Timer: Track your focus sessions with a simple start/stop interface
• Session Tracking: Automatically saves session data locally
• Daily Statistics: Shows how many focus sessions you've completed today
• Data Export: Prepare session data for anonymous submission to research
• Beautiful UI: Modern TED-style design with clean, professional appearance

About the Experiment:
This extension is part of a community science experiment conducted by TED to understand how long people can maintain focus on tasks without getting distracted. The data collected helps researchers understand attention patterns and could lead to better productivity tools and insights about digital wellness.

Privacy:
• All data is collected anonymously
• Only timing information is tracked, no personal details
• Data is stored locally until you choose to send it
• No tracking of websites visited or content viewed

Collaboration Partners:
• TED: Bringing expertise in ideas, community science, and research methodology
```

#### **Category:**
- Select **"Productivity"** or **"Education"**

#### **Language:**
- **English (United States)**

### **Step 4: Upload Store Assets**

#### **Icons:**
- **16x16:** Upload `icon16.png`
- **48x48:** Upload `icon.png` (will be resized)
- **128x128:** Upload `icon.png` (will be resized)

#### **Screenshots:**
You'll need to create screenshots showing:
1. **Main popup interface** with timer
2. **About experiment modal** open
3. **Timer running** state
4. **Data submission** interface

#### **Promotional Images (Optional):**
- **Small tile (128x128):** Use `icon.png`
- **Large tile (440x280):** Create a promotional image

### **Step 5: Set Visibility to Unlisted**

1. **Scroll to "Visibility" section**
2. **Select "Unlisted"** - This means:
   - Extension won't appear in search results
   - Only people with the direct link can install it
   - Perfect for research experiments and controlled distribution

### **Step 6: Privacy and Permissions**

#### **Permissions Explanation:**
- **Storage:** "Stores your focus session data locally on your device"
- **Host permissions (script.google.com):** "Sends anonymous research data to Google Sheets for the concentration experiment"

#### **Privacy Policy:**
You'll need to create a simple privacy policy. Here's a template:

```
Privacy Policy for Concentration Tracker

Data Collection:
- We only collect timing information about your focus sessions
- No personal information, browsing history, or website data is collected
- All data is stored locally on your device until you choose to send it

Data Usage:
- Session data is used anonymously for research purposes
- Data helps understand attention patterns and digital wellness
- No data is shared with third parties except for anonymous research submission

Data Storage:
- Session data is stored locally in your browser
- You can delete all data at any time by uninstalling the extension
- Data sent to research database is completely anonymous

Contact:
For questions about this privacy policy, contact [your-email]
```

### **Step 7: Submit for Review**

1. **Review all information** carefully
2. **Click "Submit for review"**
3. **Wait for approval** (usually 1-3 business days)

## ⏱️ **Timeline**

- **Registration:** 5-10 minutes
- **Upload & Setup:** 15-30 minutes
- **Review Process:** 1-3 business days
- **Total:** 1-4 days

## 🔗 **After Approval**

Once approved, you'll get:
- **Direct installation link** for sharing
- **Extension ID** for updates
- **Analytics dashboard** for usage statistics

## 📊 **Sharing Your Extension**

### **Direct Link Format:**
```
https://chrome.google.com/webstore/detail/[EXTENSION_ID]
```

### **Installation Instructions:**
1. Click the link above
2. Click "Add to Chrome"
3. Click "Add extension" when prompted
4. Start tracking your focus time!

## 🔄 **Updating Your Extension**

1. **Make changes** to your code
2. **Create new ZIP file** with updated version
3. **Update version number** in `manifest.json`
4. **Upload new package** in developer dashboard
5. **Submit for review** (updates usually approved faster)

## 💡 **Tips for Success**

1. **Test thoroughly** before submitting
2. **Write clear descriptions** explaining the research purpose
3. **Include good screenshots** showing the interface
4. **Be transparent** about data collection
5. **Keep it simple** - focus on the core functionality

## 🆘 **Common Issues**

### **Rejection Reasons:**
- **Missing privacy policy** - Create one using the template above
- **Unclear permissions** - Explain why each permission is needed
- **Poor screenshots** - Take clear, high-quality images
- **Incomplete description** - Be thorough about the extension's purpose

### **Getting Help:**
- [Chrome Web Store Developer Support](https://support.google.com/chrome_webstore/contact/developer_contact)
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)

## ✅ **Checklist Before Submitting**

- [ ] Extension tested and working
- [ ] ZIP file created and uploaded
- [ ] Store listing completed
- [ ] Icons uploaded (16x16, 48x48, 128x128)
- [ ] Screenshots uploaded
- [ ] Privacy policy created and linked
- [ ] Visibility set to "Unlisted"
- [ ] All information reviewed
- [ ] Ready to submit!

Once published, your TED Concentration Tracker will be available for download via direct link! 🎯
