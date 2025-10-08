// Concentration Tracker Extension
class ConcentrationTracker {
  constructor() {
    this.startTime = null;
    this.timerInterval = null;
    this.isRunning = false;
    this.sessionData = [];
    this.currentSession = null;
    this.participantId = null;
    this.i18n = null;
    this.predictedDuration = null;
    this.actualEndTime = null;
    
    // Google Apps Script Web App URL
    this.googleScriptUrl = 'https://script.google.com/macros/s/AKfycbzVPaoMr1h6x1EP_9ddHCsTjzSW0JNwsyVq7c5UVYq1A-BUU_52H0cu_zb8Sjxh-7iBtg/exec';
    
    this.loadI18n().then(() => {
      this.initializeElements();
      this.loadSessionCount();
      this.setupEventListeners();
      this.initializeParticipantId();
    });
  }
  
  async loadI18n() {
    try {
      const response = await fetch(chrome.runtime.getURL('i18n.json'));
      this.i18n = await response.json();
    } catch (error) {
      console.error('Failed to load i18n data:', error);
      // Fallback to English if i18n fails to load
      this.i18n = {
        ui: {
          status: {
            ready: "Ready to start tracking your focus time",
            active: "Focus session active • Stay concentrated",
            resumed: "Focus session resumed • Timer continues",
            completed: "Session completed • Duration: {duration}",
            noData: "No data to send yet",
            sending: "Sending data to research database...",
            success: "Data sent successfully! {count} sessions submitted.",
            error: "Error: {error}",
            notConfigured: "Google Apps Script URL not configured"
          },
          sessionCount: "Sessions today: {count}",
          buttons: {
            sendData: "Send Data",
            sending: "Sending...",
            dataSent: "Data Sent ✓"
          }
        },
        alerts: {
          configurationRequired: "Please configure the Google Apps Script URL first!\n\nSee the setup instructions in the code.",
          sendDataError: "Failed to send data:\n\n{error}\n\nPlease check your internet connection and try again."
        }
      };
    }
  }
  
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.i18n;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof value === 'string') {
      // Replace placeholders with parameters
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }
    
    return value;
  }
  
  initializeElements() {
    this.timerDisplay = document.getElementById('timerDisplay');
    this.startBtn = document.getElementById('startBtn');
    this.stopBtn = document.getElementById('stopBtn');
    this.sendBtn = document.getElementById('sendBtn');
    this.infoBtn = document.getElementById('infoBtn');
    this.status = document.getElementById('status');
    this.sessionCount = document.getElementById('sessionCount');
    this.infoModal = document.getElementById('infoModal');
    this.closeInfo = document.getElementById('closeInfo');
    
    // Prediction modal elements
    this.predictionModal = document.getElementById('predictionModal');
    this.predictionMinutes = document.getElementById('predictionMinutes');
    this.predictionSeconds = document.getElementById('predictionSeconds');
    this.startWithPrediction = document.getElementById('startWithPrediction');
    
    // Estimation modal elements
    this.estimationModal = document.getElementById('estimationModal');
    this.estimationMinutes = document.getElementById('estimationMinutes');
    this.estimationSeconds = document.getElementById('estimationSeconds');
    this.confirmEstimation = document.getElementById('confirmEstimation');
    this.skipEstimation = document.getElementById('skipEstimation');
    this.actualDurationText = document.getElementById('actualDurationText');
    
    // Session details display
    this.sessionDetails = document.getElementById('sessionDetails');
    this.predictedValue = document.getElementById('predictedValue');
    this.actualValue = document.getElementById('actualValue');
    this.estimatedValue = document.getElementById('estimatedValue');
    
    // Set initial text content
    this.updateUIText();
  }
  
  updateUIText() {
    // Update header elements
    const tagline = document.getElementById('tagline');
    const experimentBadge = document.getElementById('experimentBadge');
    const category = document.getElementById('category');
    
    if (tagline) tagline.textContent = this.t('app.tagline');
    if (experimentBadge) experimentBadge.textContent = this.t('app.experimentBadge');
    if (category) category.textContent = this.t('ui.category');
    
    // Update button text
    this.startBtn.textContent = this.t('ui.buttons.startFocus');
    this.stopBtn.textContent = this.t('ui.buttons.stopSession');
    this.sendBtn.textContent = this.t('ui.buttons.sendData');
    this.infoBtn.textContent = this.t('ui.buttons.aboutExperiment');
    
    // Update status and session count
    this.status.textContent = this.t('ui.status.ready');
    this.sessionCount.textContent = this.t('ui.sessionCount', { count: 0 });
    
    // Update prediction modal
    const predictionTitle = document.getElementById('predictionTitle');
    const predictionQuestion = document.getElementById('predictionQuestion');
    const predictionHelper = document.getElementById('predictionHelper');
    const predictionMinutesLabel = document.getElementById('predictionMinutesLabel');
    const predictionSecondsLabel = document.getElementById('predictionSecondsLabel');
    if (predictionTitle) predictionTitle.textContent = this.t('ui.prediction.title');
    if (predictionQuestion) predictionQuestion.textContent = this.t('ui.prediction.question');
    if (predictionHelper) predictionHelper.textContent = this.t('ui.prediction.helper');
    if (predictionMinutesLabel) predictionMinutesLabel.textContent = this.t('ui.prediction.placeholderMinutes');
    if (predictionSecondsLabel) predictionSecondsLabel.textContent = this.t('ui.prediction.placeholderSeconds');
    
    // Update estimation modal
    const estimationTitle = document.getElementById('estimationTitle');
    const estimationQuestion = document.getElementById('estimationQuestion');
    const estimationHelper = document.getElementById('estimationHelper');
    const estimationMinutesLabel = document.getElementById('estimationMinutesLabel');
    const estimationSecondsLabel = document.getElementById('estimationSecondsLabel');
    if (estimationTitle) estimationTitle.textContent = this.t('ui.estimation.title');
    if (estimationQuestion) estimationQuestion.textContent = this.t('ui.estimation.question');
    if (estimationHelper) estimationHelper.textContent = this.t('ui.estimation.helper');
    if (estimationMinutesLabel) estimationMinutesLabel.textContent = this.t('ui.estimation.placeholderMinutes');
    if (estimationSecondsLabel) estimationSecondsLabel.textContent = this.t('ui.estimation.placeholderSeconds');
    if (this.confirmEstimation) this.confirmEstimation.textContent = this.t('ui.buttons.confirmEstimation');
    if (this.skipEstimation) this.skipEstimation.textContent = this.t('ui.buttons.skipEstimation');
    
    // Update session details labels
    const predictedLabel = document.getElementById('predictedLabel');
    const actualLabel = document.getElementById('actualLabel');
    const estimatedLabel = document.getElementById('estimatedLabel');
    if (predictedLabel) predictedLabel.textContent = this.t('ui.sessionDetails.predicted', { time: '' }).replace(' ', '');
    if (actualLabel) actualLabel.textContent = this.t('ui.sessionDetails.actual', { time: '' }).replace(' ', '');
    if (estimatedLabel) estimatedLabel.textContent = this.t('ui.sessionDetails.estimated', { time: '' }).replace(' ', '');
    
    // Update modal content
    this.updateModalContent();
  }
  
  updateModalContent() {
    const modal = this.infoModal;
    const title = modal.querySelector('h2');
    const welcome = modal.querySelector('p');
    const sections = modal.querySelectorAll('h3');
    const descriptions = modal.querySelectorAll('p:not(:first-child)');
    const lists = modal.querySelectorAll('ol');
    const footer = modal.querySelector('em');
    
    if (title) title.textContent = this.t('infoModal.title');
    if (welcome) welcome.textContent = this.t('infoModal.welcome');
    
    // Update section titles and content
    const sectionKeys = ['whatIsThis', 'howToParticipate', 'privacy', 'purpose', 'collaboration'];
    sectionKeys.forEach((key, index) => {
      if (sections[index]) {
        sections[index].textContent = this.t(`infoModal.sections.${key}.title`);
      }
    });
    
    // Update descriptions
    const descriptionKeys = ['whatIsThis', 'privacy', 'purpose', 'collaboration'];
    let descIndex = 1; // Skip the welcome paragraph
    descriptionKeys.forEach(key => {
      if (descriptions[descIndex]) {
        descriptions[descIndex].textContent = this.t(`infoModal.sections.${key}.description`);
        descIndex++;
      }
    });
    
    // Update how to participate steps
    const stepsList = lists[0];
    if (stepsList) {
      const steps = this.t('infoModal.sections.howToParticipate.steps');
      stepsList.innerHTML = '';
      steps.forEach(step => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${step.action}</strong> ${step.description}`;
        stepsList.appendChild(li);
      });
    }
    
    // Update footer
    if (footer) footer.textContent = this.t('infoModal.footer');
  }
  
  setupEventListeners() {
    this.startBtn.addEventListener('click', () => this.showPredictionModal());
    this.stopBtn.addEventListener('click', () => this.showEstimationModal());
    this.sendBtn.addEventListener('click', () => this.sendData());
    this.infoBtn.addEventListener('click', () => this.showInfo());
    this.closeInfo.addEventListener('click', () => this.hideInfo());
    
    // Prediction modal
    this.startWithPrediction.addEventListener('click', () => this.startTimerWithPrediction());
    this.predictionMinutes.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.startTimerWithPrediction();
      }
    });
    this.predictionSeconds.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.startTimerWithPrediction();
      }
    });
    
    // Estimation modal
    this.confirmEstimation.addEventListener('click', () => this.completeSessionWithEstimation());
    this.skipEstimation.addEventListener('click', () => this.completeSessionWithEstimation(true));
    this.estimationMinutes.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.completeSessionWithEstimation();
      }
    });
    this.estimationSeconds.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.completeSessionWithEstimation();
      }
    });
    
    // Close modals when clicking outside
    this.infoModal.addEventListener('click', (e) => {
      if (e.target === this.infoModal) {
        this.hideInfo();
      }
    });
    
    this.predictionModal.addEventListener('click', (e) => {
      if (e.target === this.predictionModal) {
        this.hidePredictionModal();
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.infoModal.style.display === 'block') {
          this.hideInfo();
        }
        if (this.predictionModal.style.display === 'block') {
          this.hidePredictionModal();
        }
      }
    });
  }
  
  showPredictionModal() {
    this.predictionMinutes.value = '';
    this.predictionSeconds.value = '';
    this.predictionModal.style.display = 'block';
    setTimeout(() => this.predictionMinutes.focus(), 100);
  }
  
  hidePredictionModal() {
    this.predictionModal.style.display = 'none';
  }
  
  startTimerWithPrediction() {
    const minutes = parseInt(this.predictionMinutes.value) || 0;
    const seconds = parseInt(this.predictionSeconds.value) || 0;
    
    if (minutes === 0 && seconds === 0) {
      this.predictionMinutes.style.borderColor = '#E62B1E';
      this.predictionSeconds.style.borderColor = '#E62B1E';
      return;
    }
    
    this.predictionMinutes.style.borderColor = '#e9ecef';
    this.predictionSeconds.style.borderColor = '#e9ecef';
    this.predictedDuration = (minutes * 60 + seconds) * 1000; // Convert to milliseconds
    this.hidePredictionModal();
    this.startTimer();
  }
  
  startTimer() {
    if (this.isRunning) return;
    
    this.startTime = Date.now();
    this.isRunning = true;
    this.currentSession = {
      startTime: this.startTime,
      endTime: null,
      duration: 0,
      predictedDuration: this.predictedDuration || null
    };
    
    this.startBtn.disabled = true;
    this.stopBtn.disabled = false;
    this.status.textContent = this.t('ui.status.active');
    
    // Update timer every second
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
    
    // Store running state
    chrome.storage.local.set({ 
      isRunning: true, 
      startTime: this.startTime,
      predictedDuration: this.predictedDuration
    });
  }
  
  showEstimationModal() {
    if (!this.isRunning) return;
    
    // Record the actual time when user clicked stop
    this.actualEndTime = Date.now();
    const actualDuration = this.actualEndTime - this.startTime;
    
    // Display the actual duration
    this.actualDurationText.textContent = this.t('ui.estimation.actualDuration', { 
      duration: this.formatTime(actualDuration) 
    });
    
    // Set max value for estimation input
    const maxMinutes = Math.floor(actualDuration / (60 * 1000));
    const maxSeconds = Math.floor((actualDuration % (60 * 1000)) / 1000);
    this.estimationMinutes.max = maxMinutes;
    this.estimationMinutes.value = '';
    this.estimationSeconds.value = '';
    
    this.estimationModal.style.display = 'block';
    setTimeout(() => this.estimationMinutes.focus(), 100);
  }
  
  hideEstimationModal() {
    this.estimationModal.style.display = 'none';
  }
  
  completeSessionWithEstimation(skip = false) {
    let estimatedFocusDuration = null;
    
    if (!skip) {
      const minutes = parseInt(this.estimationMinutes.value) || 0;
      const seconds = parseInt(this.estimationSeconds.value) || 0;
      if (minutes >= 0 || seconds >= 0) {
        estimatedFocusDuration = (minutes * 60 + seconds) * 1000; // Convert to milliseconds
      }
    }
    
    this.hideEstimationModal();
    this.stopTimer(estimatedFocusDuration);
  }
  
  stopTimer(estimatedFocusDuration = null) {
    if (!this.isRunning) return;
    
    const endTime = this.actualEndTime || Date.now();
    const duration = endTime - this.startTime;
    
    this.isRunning = false;
    
    // Check if currentSession exists before accessing its properties
    if (this.currentSession) {
      this.currentSession.endTime = endTime;
      this.currentSession.duration = duration;
      this.currentSession.detectionTime = endTime; // When user detected loss of focus
      this.currentSession.estimatedFocusDuration = estimatedFocusDuration; // User's estimation of actual focus time
    } else {
      // Create a new session if currentSession is null
      this.currentSession = {
        startTime: this.startTime || endTime,
        endTime: endTime,
        duration: duration,
        predictedDuration: this.predictedDuration || null,
        detectionTime: endTime,
        estimatedFocusDuration: estimatedFocusDuration
      };
    }
    
    // Add to session data
    if (this.currentSession) {
      this.sessionData.push({
        ...this.currentSession,
        date: new Date().toISOString().split('T')[0]
      });
    }
    
    // Display session details
    this.displaySessionDetails(this.currentSession);
    
    // Reset for next session
    this.predictedDuration = null;
    this.actualEndTime = null;
    
    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
    this.sendBtn.disabled = false;
    this.status.textContent = this.t('ui.status.completed', { duration: this.formatTime(duration) });
    
    clearInterval(this.timerInterval);
    
    // Update session count
    this.updateSessionCount();
    
    // Store data
    this.saveSessionData();
    chrome.storage.local.remove(['isRunning', 'startTime', 'predictedDuration']);
  }
  
  displaySessionDetails(session) {
    if (!session) return;
    
    // Show the session details panel
    this.sessionDetails.classList.add('visible');
    
    // Display predicted duration
    if (session.predictedDuration) {
      this.predictedValue.textContent = this.formatTime(session.predictedDuration);
    } else {
      this.predictedValue.textContent = '--:--';
    }
    
    // Display actual duration
    this.actualValue.textContent = this.formatTime(session.duration);
    
    // Display estimated focus duration
    if (session.estimatedFocusDuration !== null && session.estimatedFocusDuration !== undefined) {
      this.estimatedValue.textContent = this.formatTime(session.estimatedFocusDuration);
    } else {
      this.estimatedValue.textContent = this.t('ui.sessionDetails.noEstimation');
    }
  }
  
  updateTimer() {
    if (!this.isRunning || !this.startTime) return;
    
    const elapsed = Date.now() - this.startTime;
    this.timerDisplay.textContent = this.formatTime(elapsed);
  }
  
  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // This method is now handled by the async sendData() method above
  
  calculateTotalTime() {
    const totalMs = this.sessionData.reduce((sum, session) => sum + session.duration, 0);
    return this.formatTime(totalMs);
  }
  
  showInfo() {
    this.infoModal.style.display = 'block';
  }
  
  hideInfo() {
    this.infoModal.style.display = 'none';
  }
  
  loadSessionCount() {
    chrome.storage.local.get(['sessionData'], (result) => {
      if (result.sessionData) {
        this.sessionData = result.sessionData;
        this.updateSessionCount();
      }
      
      // Check if timer was running when popup was closed
      chrome.storage.local.get(['isRunning', 'startTime', 'predictedDuration'], (result) => {
        if (result.isRunning && result.startTime) {
          this.startTime = result.startTime;
          this.isRunning = true;
          this.predictedDuration = result.predictedDuration || null;
          
          // Restore currentSession when resuming
          this.currentSession = {
            startTime: this.startTime,
            endTime: null,
            duration: 0,
            predictedDuration: this.predictedDuration
          };
          
          this.startBtn.disabled = true;
          this.stopBtn.disabled = false;
          this.status.textContent = this.t('ui.status.resumed');
          
          // Resume timer
          this.timerInterval = setInterval(() => {
            this.updateTimer();
          }, 1000);
        }
      });
    });
  }
  
  updateSessionCount() {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = this.sessionData.filter(session => session.date === today).length;
    this.sessionCount.textContent = this.t('ui.sessionCount', { count: todaySessions });
  }
  
  saveSessionData() {
    chrome.storage.local.set({ sessionData: this.sessionData });
  }
  
  initializeParticipantId() {
    chrome.storage.local.get(['participantId'], (result) => {
      if (!result.participantId) {
        // Generate a unique participant ID
        this.participantId = 'user_' + Math.random().toString(36).substr(2, 9);
        chrome.storage.local.set({ participantId: this.participantId });
      } else {
        this.participantId = result.participantId;
      }
    });
  }
  
  async sendData() {
    if (this.sessionData.length === 0) {
      this.status.textContent = this.t('ui.status.noData');
      return;
    }
    
    if (this.googleScriptUrl === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
      this.status.textContent = this.t('ui.status.notConfigured');
      alert(this.t('alerts.configurationRequired'));
      return;
    }
    
    this.status.textContent = this.t('ui.status.sending');
    this.sendBtn.disabled = true;
    this.sendBtn.textContent = this.t('ui.buttons.sending');
    
    try {
      const response = await this.submitToGoogleSheets();
      
      if (response.success) {
        this.status.textContent = this.t('ui.status.success', { count: this.sessionData.length });
        this.sessionData = []; // Clear sent data
        this.saveSessionData();
        this.updateSessionCount();
        this.sendBtn.disabled = true;
        this.sendBtn.textContent = this.t('ui.buttons.dataSent');
        
        // Reset button after 3 seconds
        setTimeout(() => {
          this.sendBtn.textContent = this.t('ui.buttons.sendData');
          this.sendBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error(response.error || this.t('technical.unknownError'));
      }
    } catch (error) {
      console.error('Error sending data:', error);
      this.status.textContent = this.t('ui.status.error', { error: error.message });
      this.sendBtn.disabled = false;
      this.sendBtn.textContent = this.t('ui.buttons.sendData');
      
      // Show error details
      alert(this.t('alerts.sendDataError', { error: error.message }));
    }
  }
  
  async submitToGoogleSheets() {
    const dataToSend = {
      sessions: this.sessionData,
      participantId: this.participantId,
      browserInfo: navigator.userAgent,
      experimentVersion: '1.0',
      timestamp: new Date().toISOString()
    };
    
    // Debug: Log the data being sent
    console.log('=== DATA BEING SENT TO SHEETS ===');
    console.log('Target URL:', this.googleScriptUrl);
    console.log('Number of sessions:', this.sessionData.length);
    console.log('Session data:', JSON.stringify(this.sessionData, null, 2));
    console.log('Full payload:', JSON.stringify(dataToSend, null, 2));
    
    // Use POST request with proper JSON body (correct approach)
    const response = await fetch(this.googleScriptUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    });
    
    if (!response.ok) {
      throw new Error(this.t('technical.httpError', { status: response.status, statusText: response.statusText }));
    }
    
    const result = await response.json();
    console.log('=== RESPONSE FROM SHEETS ===');
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return result;
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ConcentrationTracker();
});
