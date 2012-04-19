TPW = function () {
  var jQuery, Handlebars, loaded = false;
  
  this.jQuery = function () {
    return jQuery;
  };
  
  this.init = function () {
    var self = this;
    
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
      $.getScript('http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0.beta2/handlebars.min.js', function () {
        self.loaded = true;
      });
    }));
  };
  
  this.load = function (js, options) {
    var self = this;
    if (this.loaded) {
      var config = options || {};
      self.jQuery.getScript('tpw/widgets/' + js + '.js', function () {
        window['_' + js].init(self, config);
      });
    } else {
      setTimeout(function () { self.load(js, options); }, 50);
    }
  };
};

_TPW = new TPW();