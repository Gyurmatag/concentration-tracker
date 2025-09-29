// Concentration Tracker Extension
class ConcentrationTracker {
  constructor() {
    this.startTime = null;
    this.timerInterval = null;
    this.isRunning = false;
    this.sessionData = [];
    this.currentSession = null;
    
    this.initializeElements();
    this.loadSessionCount();
    this.setupEventListeners();
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
  }
  
  setupEventListeners() {
    this.startBtn.addEventListener('click', () => this.startTimer());
    this.stopBtn.addEventListener('click', () => this.stopTimer());
    this.sendBtn.addEventListener('click', () => this.sendData());
    this.infoBtn.addEventListener('click', () => this.showInfo());
    this.closeInfo.addEventListener('click', () => this.hideInfo());
    
    // Close modal when clicking outside
    this.infoModal.addEventListener('click', (e) => {
      if (e.target === this.infoModal) {
        this.hideInfo();
      }
    });
  }
  
  startTimer() {
    if (this.isRunning) return;
    
    this.startTime = Date.now();
    this.isRunning = true;
    this.currentSession = {
      startTime: this.startTime,
      endTime: null,
      duration: 0
    };
    
    this.startBtn.disabled = true;
    this.stopBtn.disabled = false;
    this.status.textContent = 'Focus session active • Stay concentrated';
    
    // Update timer every second
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
    
    // Store running state
    chrome.storage.local.set({ isRunning: true, startTime: this.startTime });
  }
  
  stopTimer() {
    if (!this.isRunning) return;
    
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    
    this.isRunning = false;
    this.currentSession.endTime = endTime;
    this.currentSession.duration = duration;
    
    // Add to session data
    this.sessionData.push({
      ...this.currentSession,
      date: new Date().toISOString().split('T')[0]
    });
    
    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
    this.sendBtn.disabled = false;
    this.status.textContent = `Session completed • Duration: ${this.formatTime(duration)}`;
    
    clearInterval(this.timerInterval);
    
    // Update session count
    this.updateSessionCount();
    
    // Store data
    this.saveSessionData();
    chrome.storage.local.remove(['isRunning', 'startTime']);
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
  
  sendData() {
    if (this.sessionData.length === 0) {
      this.status.textContent = 'No data to send yet';
      return;
    }
    
    // For now, just show a message - Google Sheets integration will be added later
    this.status.textContent = `Ready to send ${this.sessionData.length} session(s)`;
    
    // TODO: Implement Google Sheets integration
    console.log('Session data to send:', this.sessionData);
    
    // Show confirmation
    alert(`Data ready to send!\n\nSessions: ${this.sessionData.length}\nTotal time: ${this.calculateTotalTime()}\n\nGoogle Sheets integration coming soon!`);
  }
  
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
      chrome.storage.local.get(['isRunning', 'startTime'], (result) => {
        if (result.isRunning && result.startTime) {
          this.startTime = result.startTime;
          this.isRunning = true;
          this.startBtn.disabled = true;
          this.stopBtn.disabled = false;
          this.status.textContent = 'Focus session resumed • Timer continues';
          
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
    this.sessionCount.textContent = `Sessions today: ${todaySessions}`;
  }
  
  saveSessionData() {
    chrome.storage.local.set({ sessionData: this.sessionData });
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ConcentrationTracker();
});
