document.addEventListener('DOMContentLoaded', async () => {
  const actionButton = document.getElementById('actionButton');

  // Load and display info about active code sections
  const result = await chrome.storage.sync.get(['optionsCode', 'contentCode', 'swCode']);
  console.log('Active code sections:');
  if (result.optionsCode) console.log('- Options code active');
  if (result.contentCode) console.log('- Content code active');
  if (result.swCode) console.log('- Service worker code active');

  actionButton.addEventListener('click', async () => {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send a message to the content script
    chrome.tabs.sendMessage(tab.id, { action: 'buttonClicked' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError);
        return;
      }
      console.log('Response from content script:', response);
    });

    // Example: Store data in chrome.storage
    chrome.storage.sync.set({ lastClicked: new Date().toISOString() }, () => {
      console.log('Data saved to storage');
    });
  });

  // Example: Retrieve data from chrome.storage
  chrome.storage.sync.get(['lastClicked'], (result) => {
    if (result.lastClicked) {
      console.log('Last clicked:', result.lastClicked);
    }
  });

  // Open settings page
  const openSettingsButton = document.getElementById('openSettings');
  openSettingsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
