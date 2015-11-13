// This prevents pages flashing white until they are loaded.

(function() {
  var host = window.location.hostname;
  // Only dim pages that were selected to be inverted.
  if (iEyeStorage.checkAutoload(host)) {
    var observer = new MutationObserver(function() {
      if (document.body) {
        var blocker = document.createElement('div');
        blocker.id = "i-eye-blocker";
        blocker.innerHTML = "<div onclick='document.getElementById(\"i-eye-blocker\").parentNode.removeChild(document.getElementById(\"i-eye-blocker\"))' style='position:fixed;top:0;left:0;height:100%;width:100%;background-color:black;opacity:0.95;z-index:1000;'></div>";
        document.body.appendChild(blocker);

        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {childList: true});
  }
})();
