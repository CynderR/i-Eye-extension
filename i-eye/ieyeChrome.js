
(function() {
  function btnListeners(btnIds) {
    for (var i in btnIds) {
      document.getElementById(btnIds[i]).addEventListener('click', btnClicked(btnIds[i], prepValue(btnIds[i])), false);
    }
  }

  function prepValue(btnId) {
    switch (btnId) {
      case "exclude-page":
        return document.getElementById("excludePath").value;
        break;
      default:
      return "";
    }
  }

  function btnClicked(btnId, value) {
    return function() {
      chrome.tabs.getSelected(null, function() {
        sendAction({action: btnId, value: value});
      }.bind(this));
    }
  }

  // Add events
  btnListeners(['invert-page', 'exclude-page', 'reset']);

  // trigger Chrome event
  function sendAction(action) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, action, function(response) {
      });
    });
  }
})();



