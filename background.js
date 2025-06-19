// Background script for Quick Notes Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Quick Notes extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create({
    url: 'popup.html',
    type: 'popup',
    width: 500,
    height: 700,
    focused: true
  });
});

// Optional: Add keyboard shortcut handling
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-quick-notes') {
    chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 500,
      height: 700,
      focused: true
    });
  }
});