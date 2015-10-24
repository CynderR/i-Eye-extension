window.addEventListener('load', (function() {
  var iEye = {
    /* the css we are going to inject */
    css:" html {-webkit-filter: invert(100%)!important;background-color: black!important;}" +
        " img {-webkit-filter: invert(100%)!important;} " +
        " object {-webkit-filter: invert(100%)!important;} " +
        " video {-webkit-filter: invert(100%)!important;} " +
        " png {-webkit-filter: invert(100%)!important;} " +
        " * {color:#663355;} " +
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
      // Check / load defaults
      if (!localStorage.keycodes) this.setDefaults();
      this.loadFromStorage();

      // Autoload if we have changed this before.
      this.checkAutoload(this.vars.autoChange);

      // Listen for chrome events
      this.chromeInvertEvent();

      // Add hotkey listeners
      document.documentElement.addEventListener("keypress", function(event) {
        // Toggle invert when ctrl+q is pressed.
        if (event.charCode == 17 && event.ctrlKey) {
          this.toggleInvert();
        }
      }.bind(this));

    },

    checkAutoload: function(autoloadList) {
      var url = window.location.pathname;
      this.regEscape = function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      };
      // Auto load sections
      for (var auto in autoloadList) {
        if (autoloadList[auto] === this.host) {
          // Check if in the exclude list
          for (var excludePage in this.vars.exclude[this.host]) {
            var regex = new RegExp("^" + this.regEscape(this.vars.exclude[this.host][excludePage]) );
            if (regex.test(url)) {
              return false;
            }
          }

          this.invertColor();
        }
      }
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
              this.vars.updateObject("exclude", this.host, request.value||window.location.pathname);
              break;
            case "reset":
              this.setDefaults();
              break;
            default:
              console.log("i-eye: Unhandled event: " + request.action);
          }
      }.bind(this));
    },

    toggleInvert: function() {
      this.invertColor();
      // Add this page to the autoload
      this.vars.addOrRemove("autoChange", this.host);
    },

    setDefaults: function() {
      // First run, set the localStorage defaults.
      localStorage.autoChange = JSON.stringify(["www.google.ca","chrome-ui://newtab", "chrome"]);
      /* Auto invert exceptions */
      localStorage.exclude = JSON.stringify({
        "www.google.ca": ["/maps/"]
      });
      localStorage.keycodes = JSON.stringify([81]);
    },

    loadFromStorage: function() {
      this.vars = {
        update: function(key, value) {
          this.vars[key] = value;
        }.bind(this),
        updateObject: function(varName, key, value) {
          if (typeof this.vars[varName][key] === "undefined" ) {
            this.vars[varName][key] = [];
          }
          if (this.vars[varName][key].indexOf(value) === -1) {
            this.vars[varName][key].push(value);
          } else {
            delete this.vars[varName][key];
          }
          localStorage[varName] = JSON.stringify(this.vars[varName]);

        }.bind(this),
        addOrRemove: function(key, value) {
          if (this.vars[key].indexOf(value) === -1) {
            this.vars[key].push(value);
          } else {
            this.vars[key].splice(this.vars[key].indexOf(value), 1);
          }
          localStorage[key] = JSON.stringify(this.vars[key]);
        }.bind(this)
      };
      this.vars.autoChange = JSON.parse(localStorage.autoChange);
      this.vars.keycodes   = JSON.parse(localStorage.keycodes);
      this.vars.exclude    = JSON.parse(localStorage.exclude);
    }
  };
  iEye.init();

}()));