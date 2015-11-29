window.addEventListener('load', (function() {
  var iEye = {
    /* the css we are going to inject */
    css:" html {-webkit-filter: invert(100%)!important;background-color: black!important;}" +
        " #theater-background {background-color:white;}" + // Fix for youtube theater mode
        " img {-webkit-filter: invert(100%)!important;} " +
        " iframe {-webkit-filter: invert(100%)!important;} " +
        " object {-webkit-filter: invert(100%)!important;} " +
        " video {-webkit-filter: invert(100%)!important;} " +
        " png {-webkit-filter: invert(100%)!important;} " +
        " * {color:#663355;} " +
        // Github red&green code review
        " .blob-num-deletion, .blob-code-deletion {-webkit-filter: invert(100%)!important;opacity:0.3;} " +
        " .blob-num-addition, .blob-code-addition {-webkit-filter: invert(100%)!important;opacity:0.3;} " +
        // Jira red&green code review
        " .added.modified.line {-webkit-filter: invert(100%)!important;} " +
        " .removed.modified.line {-webkit-filter: invert(100%)!important;}",

    uniqueStyle: "i_eye-aaaar",
    head: document.getElementsByTagName('head')[0],
    host: window.location.hostname,

    insertCSSIntoHead: function() {
      var style = document.getElementById(this.uniqueStyle);
      if(!style) {
        style = document.createElement('style');
        // injecting the css to the head
        style.type = 'text/css';
        style.id = this.uniqueStyle;
        style.appendChild(document.createTextNode(this.css));
        this.head.appendChild(style);
      } else {
        // Undo invert clicking the bookmarklet again
        style.remove();
      }
    },

    invertColor: function () {
      // Insert css into documents head
      this.insertCSSIntoHead(this.css);
    },

    init: function() {
      // Remove dark overlay from startDark
      if (document.getElementById("i-eye-blocker")) {
        document.getElementById("i-eye-blocker").parentNode.removeChild(document.getElementById("i-eye-blocker"));
      }

      // Autoload if we have changed this before.
      if (iEyeStorage.checkAutoload(this.host)) {
        this.invertColor();
      }

      // Listen for chrome events
      this.chromeInvertEvent();

      // Add hotkey listeners
      document.documentElement.addEventListener("keypress", function(event) {
        // Toggle invert when ctrl+q is pressed.
        if (event.charCode == iEyeStorage.getKeyCode("invert") && event.ctrlKey) {
          this.toggleInvert();
        }
      }.bind(this));

    },

    // Handle events coming
    chromeInvertEvent: function() {
      chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          switch (request.action) {
            case "invert-page":
              this.toggleInvert();
              break;
            case "exclude-page":
              this.invertColor();
              iEyeStorage.updateObject("exclude", this.host, request.value||window.location.pathname);
              break;
            case "reset":
              iEyeStorage.setDefaults();
              break;
            default:
              console.log("i-eye: Unhandled event: " + request.action);
          }
      }.bind(this));
    },

    toggleInvert: function() {
      this.invertColor();
      // Add this page to the autoload
      iEyeStorage.addOrRemove("autoChange", this.host);
    }
  };

  iEye.init();
}()));