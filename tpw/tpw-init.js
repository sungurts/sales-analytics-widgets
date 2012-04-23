TPW = function () {
  var self = this;
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
      loadScript('tpw/libs/jshashtable-2.1.js', function () {
        loadScript('tpw/libs/jquery.numberformatter-1.2.3.min.js', function () {
          loadScript('http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0.beta2/handlebars.min.js', function () {
            registerHandlebarHelpers();
            self.loaded = true;
          });
        });
      });
    }));
  }
  
  this.load = function (js, options) {
    if (this.loaded) {
      var config = options || {};
      loadScript('tpw/widgets/' + js + '.js', function () {
        window['_' + js].init(self, config);
        self.widgets.push(window['_' + js]);
      });
    } else {
      setTimeout(function () { self.load(js, options); }, 50);
    }
  }
  
  var loadScript = function (script, callback) {
    var c = document.createElement("script");
    c.type = "text/javascript";
    c.src = script;
    c.onload = function () {
      if (typeof callback === 'function') {
        callback();
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

_TPW = new TPW();