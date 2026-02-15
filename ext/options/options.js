import Sval from '../lib/sval.js';

const interpreter = new Sval({
    ecmaVer: 'latest',
    sourceType: 'module',
    sandBox: false,
});

// Storage keys for each code section
const STORAGE_KEYS = {
  options: 'optionsCode',
  content: 'contentCode',
  sw: 'swCode'
};

// Elements
const optionsCodeArea = document.getElementById('optionsCode');
const contentCodeArea = document.getElementById('contentCode');
const swCodeArea = document.getElementById('swCode');
const saveButton = document.getElementById('saveButton');
const clearButton = document.getElementById('clearButton');
const runOptionsButton = document.getElementById('runOptionsButton');
const statusDiv = document.getElementById('status');

// Load saved code when page opens
document.addEventListener('DOMContentLoaded', loadAllCode);

// Save button handler
saveButton.addEventListener('click', saveAllCode);

// Clear button handler
clearButton.addEventListener('click', clearAllCode);

// Run options code button
runOptionsButton.addEventListener('click', runOptionsCode);

// Auto-save on blur
optionsCodeArea.addEventListener('blur', saveAllCode);
contentCodeArea.addEventListener('blur', saveAllCode);
swCodeArea.addEventListener('blur', saveAllCode);

// Load all code from storage
async function loadAllCode() {
  try {
    const result = await chrome.storage.sync.get(Object.values(STORAGE_KEYS));
    
    if (result[STORAGE_KEYS.options]) {
      optionsCodeArea.value = result[STORAGE_KEYS.options];
    }
    if (result[STORAGE_KEYS.content]) {
      contentCodeArea.value = result[STORAGE_KEYS.content];
    }
    if (result[STORAGE_KEYS.sw]) {
      swCodeArea.value = result[STORAGE_KEYS.sw];
    }
    
    // Auto-run options code on load
    if (result[STORAGE_KEYS.options]) {
      runOptionsCode();
    }
    
    showStatus('Code loaded', 'success');
  } catch (error) {
    console.error('Error loading code:', error);
    showStatus('Error loading code', 'error');
  }
}

// Save all code to storage
async function saveAllCode() {
  const optionsCode = optionsCodeArea.value;
  const contentCode = contentCodeArea.value;
  const swCode = swCodeArea.value;
  
  try {
    await chrome.storage.sync.set({
      [STORAGE_KEYS.options]: optionsCode,
      [STORAGE_KEYS.content]: contentCode,
      [STORAGE_KEYS.sw]: swCode
    });
    
    showStatus('All code saved successfully!', 'success');
    
    // Notify all parts of the extension that code has been updated
    chrome.runtime.sendMessage({ 
      action: 'codeUpdated',
      optionsCode,
      contentCode,
      swCode
    }).catch(() => {
      // Ignore errors if no listeners
    });
    
  } catch (error) {
    console.error('Error saving code:', error);
    showStatus('Error saving code', 'error');
  }
}

// Clear all code
async function clearAllCode() {
  if (confirm('Are you sure you want to clear all code?')) {
    optionsCodeArea.value = '';
    contentCodeArea.value = '';
    swCodeArea.value = '';
    await saveAllCode();
  }
}

// Run options code immediately
function runOptionsCode() {
  const code = optionsCodeArea.value;
  if (!code.trim()) {
    showStatus('No code to run', 'error');
    return;
  }
  
  try {
    interpreter.run(code);
    showStatus('Options code executed', 'success');
  } catch (error) {
    console.error('Error running options code:', error);
    showStatus('Error: ' + error.message, 'error');
  }
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  
  // Clear status after 3 seconds
  setTimeout(() => {
    statusDiv.textContent = '';
    statusDiv.className = 'status';
  }, 3000);
}

// Listen for storage changes from other parts of the extension
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes[STORAGE_KEYS.options]) {
      optionsCodeArea.value = changes[STORAGE_KEYS.options].newValue || '';
    }
    if (changes[STORAGE_KEYS.content]) {
      contentCodeArea.value = changes[STORAGE_KEYS.content].newValue || '';
    }
    if (changes[STORAGE_KEYS.sw]) {
      swCodeArea.value = changes[STORAGE_KEYS.sw].newValue || '';
    }
  }
});

