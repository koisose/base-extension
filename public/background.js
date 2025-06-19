// Background script for Quick Notes Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Quick Notes extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // The popup will open automatically, no need to handle this
});

// Optional: Add keyboard shortcut handling
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-quick-notes') {
    chrome.action.openPopup();
  }
});