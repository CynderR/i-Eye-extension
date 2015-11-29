
var iEyeStorage = {
  data: {},

  loadStorage: function() {
    this.update = function(varName, value) {
      this.data[varName] = value;
    }.bind(this);

    this.updateObject = function(varName, key, value) {
      if (typeof this.data[varName][key] === "undefined" ) {
        this.data[varName][key] = [];
      }
      if (this.data[varName][key].indexOf(value) === -1) {
        this.data[varName][key].push(value);
      } else {
        delete this.data[varName][key];
      }
      localStorage[varName] = JSON.stringify(this.data[varName]);

    }.bind(this);

    this.addOrRemove = function(varName, value) {
      if (this.data[varName].indexOf(value) === -1) {
        this.data[varName].push(value);
      } else {
        this.data[varName].splice(this.data[varName].indexOf(value), 1);
      }
      localStorage[varName] = JSON.stringify(this.data[varName]);
    }.bind(this);

    // If defaults are not set, then set them.
    if (localStorage.autoChange === undefined) {
      this.setDefaults();
    }

  },

  checkAutoload: function(host) {
    var url = window.location.pathname;
    this.regEscape = function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    // Auto load sections
    for (var auto in this.data.autoChange) {
      if (this.data.autoChange[auto] === host) {
        // Check if in the exclude list
        for (var excludePage in this.data.exclude[host]) {
          var regex = new RegExp("^" + this.regEscape(this.data.exclude[host][excludePage]) );
          if (regex.test(url)) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },

  getKeyCode: function(codeName) {
    return this.data.keycodes[codeName];
  },

  setDefaults: function() {
    // First run, set the localStorage defaults.
    localStorage.autoChange = JSON.stringify(["www.google.ca","chrome-ui://newtab", "chrome"]);
    /* Auto invert exceptions */
    localStorage.exclude = JSON.stringify({
      "www.google.ca": ["/maps/"]
    });
    localStorage.keycodes = JSON.stringify({
      "invert": 17
    });
  }
};

iEyeStorage.data.autoChange = localStorage.autoChange ? JSON.parse(localStorage.autoChange) : [];
iEyeStorage.data.keycodes   = localStorage.keycodes   ? JSON.parse(localStorage.keycodes)   : {};
iEyeStorage.data.exclude    = localStorage.exclude    ? JSON.parse(localStorage.exclude)    : {};

iEyeStorage.loadStorage();