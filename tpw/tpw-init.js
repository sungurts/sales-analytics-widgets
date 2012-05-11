TPW = function () {
  var self = this, path;
  this.init = function () {
    this.widgets = [];
    (function (e, a, g, h, f, c, b, d) {
        if (!(f = e.jQuery) || g > f.fn.jquery || h(f)) {
            c = a.createElement("script");
            c.type = "text/javascript";
            c.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + g + "/jquery.min.js";
            c.onload = c.onreadystatechange = function () {
                if (!b && (!(d = this.readyState) || d === "loaded" || d === "complete")) {
                    h((f = e.jQuery).noConflict(1), b = 1);
                    f(c).remove();
                }
            };
            a.getElementsByTagName('head')[0].appendChild(c);
        }
    }(window, document, "1.7.2", function ($, L) {
      self.jQuery = $;
      loadScript('libs/jshashtable-2.1.js', function () {
        loadScript('libs/jquery.numberformatter-1.2.3.min.js', function () {
          loadScript('http://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js', function () {
            loadScript('libs/jquery.jsonp-2.3.0.min.js', function () {
              loadScript('http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0.beta2/handlebars.min.js', function () {
                registerHandlebarHelpers();
                loadScript('https://www.google.com/jsapi', function () {
                  self.loaded = true;
                });
              });
            });
          });
        });
      });
    }));
  };
  
  this.load = function (js, options) {
    if (this.loaded) {
      var config = options || {};
      loadScript('widgets/' + js + '.js', function () {
        window['_' + js].init(self, config);
        self.widgets.push(window['_' + js]);
      });
    } else {
      setTimeout(function () { self.load(js, options); }, 50);
    }
  };
  
  var loadScript = function (script, callback) {
    var c = document.createElement("script");
    c.type = "text/javascript";
    if (script.substr(0, 4) == 'http') {
      c.src = script;
    } else {
      c.src = self.path + script;
    }
    c.onload = c.onreadystatechange = function () {
      if (!(d = this.readyState) || d === "loaded" || d === "complete") {
        if (typeof callback === 'function') {
          callback();
        }
      }
    };
    document.getElementsByTagName('head')[0].appendChild(c);
  }
  
  var registerHandlebarHelpers = function () {
    Handlebars.registerHelper('formatCurrency', function (number) {
      return '$' + self.jQuery.formatNumber(number.toString(), {format:"#,##0.00", locale:"us"});
    });
  }
};

var _TPW = new TPW();
var pageScriptTags = document.getElementsByTagName("script"), tpwSrc = pageScriptTags[pageScriptTags.length-1].src;
_TPW.path = tpwSrc.substr(0, tpwSrc.indexOf('tpw-init.js'));