TPW = function () {
  var self = this, tpl = {};
  
  this.init = function () {
    this.widgets = [];
    this.widgetsToLoad = [];
    this.widgetGroups = {};
    this.widgetCount = 0;
    this.reInitCount = 0;
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
      loadCss('css/jquery-ui-1.8.20.custom.css');
      loadCss('css/tpw.css');
      // will run once everything is loaded
      self.jQuery(self).bind('tpw-loaded', function () {
         initTemplates();
        // setup the group containers
        self.jQuery.each(self.widgetGroups, function (index, groupInfo) {
          self.jQuery(self).bind(groupInfo.groupId + 'WidgetInitDone', function (data) {
            self.reInitCount++;
            if (self.reInitCount >= self.widgetGroups[groupInfo.groupId].widgets.length) {
              self.jQuery('#' + groupInfo.container + ' .tpw-group-form .tpw-submit').removeAttr('disabled');
            }
          });
          self.jQuery('#' + groupInfo.container).html(tpl.styles + tpl.groupWrapper({
            title: tpl.groupForm({keyword: ''}),
            content: ''
          }));
          console.log(self.jQuery('#' + groupInfo.container + ' .tpw-btn-group'));
          self.jQuery('#' + groupInfo.container + ' .tpw-btn-group').buttonset();
          self.jQuery('#' + groupInfo.container + ' .tpw-group-form').submit(function (eventObj) {
            self.reInitCount = 0;
            self.jQuery(this).find('.tpw-submit').attr('disabled', 'disabled');
            var formElements = {};
            self.jQuery.each(self.jQuery(this).serializeArray(), function (formIndex, formElement) {
              formElements[formElement.name] = formElement.value;
            });
            self.jQuery.each(self.widgetGroups[index].widgets, function (i, widget) {
              var newConfig = widget.config;
              newConfig.keyword = formElements.keyword;
              newConfig.dateOffset = formElements.dateOffset;
              widget.init(self, newConfig);
            });
            return false;
          });
        });
        // load the widgets that are waiting to be initialized
        self.jQuery(self.widgetsToLoad).each(function (index, widgetInfo) {
          self.load(widgetInfo.js, widgetInfo.options);
        });
      });
      loadScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js', function () {
        loadScript('libs/jshashtable-2.1.js', function () {
          loadScript('libs/jquery.numberformatter-1.2.3.min.js', function () {
            loadScript('libs/date.min.js', function () {
              loadScript('libs/jquery.jsonp-2.3.0.min.js', function () {
                loadScript('libs/handlebars.min.js', function () {
                  registerHandlebarHelpers();
                  loadScript('https://www.google.com/jsapi', function () {
                    self.loaded = true;
                    self.jQuery(self).trigger('tpw-loaded', {});
                  });
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
      
      if (typeof config.groupId !== 'undefined') {
        var newDivId = config.groupId + 'Widget' + self.widgetCount;
        self.widgetCount++;
        self.jQuery('#' + self.widgetGroups[config.groupId].container + ' .tpw-group-content')
          .append('<div class="tpw-grouped-widget" id="' + newDivId + '"></div>');
      }
      
      loadScript('widgets/' + js + '.js', function () {
        if (typeof config.groupId !== 'undefined') {
          window['_' + js].init(self, {container: newDivId, displayInputs: false, formSubmitEvent: config.groupId + 'FormSubmit', initCompleteEvent: config.groupId + 'WidgetInitDone'});
          self.widgetGroups[config.groupId].widgets.push(window['_' + js]);
        } else if (typeof config.container !== 'undefined') {
          window['_' + js].init(self, config);
        } else {
          throw 'No container or widget group provided.';
        }
        self.widgets.push(window['_' + js]);
      });
    } else {
      self.widgetsToLoad.push({js: js, options: options});
    }
  };
  
  this.createGroup = function (groupId, options) {
    self.widgetGroups[groupId] = {groupId: groupId, container: options.container, widgets: []};
  }
  
  this.data = function (key, value) {
    if (typeof value === 'undefined') {
      return self.jQuery(self).data(key);
    } else {
      self.jQuery(self).data(key, value);
    }
  }
  
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
  
  var loadCss = function (css) {
    self.jQuery("<link/>", {
       rel: "stylesheet",
       type: "text/css",
       href: self.path + css
    }).appendTo("head");
  }
  
  var registerHandlebarHelpers = function () {
    Handlebars.registerHelper('formatCurrency', function (number) {
      return '$' + self.jQuery.formatNumber(number.toString(), {format:"#,##0.00", locale:"us"});
    });
  }
  
  
  
  var initTemplates = function () {
    // template cannot be initialized until handlebars has loaded
    tpl.groupWrapper = Handlebars.compile('<div class="tpw-group-container">\
        <div class="tpw-group-title-bar">\
          {{{title}}}\
        </div>\
        <div class="tpw-group-content">\
          {{{content}}}\
        </div>\
        <div class="tpw-clear"></div>\
      </div>');
    tpl.groupForm = Handlebars.compile('<form class="tpw-group-form">\
      Keywords: <input type="text" name="keyword" size="15" value="{{keyword}}">\
      Date Range:\
      <div class="tpw-btn-group" data-toggle="buttons-radio" style="float: right;">\
        <input type="radio" name="dateOffset" id="1" value="1"><label for="1">1 Day</label>\
        <input type="radio" name="dateOffset" id="7" value="7" checked="checked"><label for="7">7 Days</label>\
        <input type="radio" name="dateOffset" id="30" value="30"><label for="30">30 Days</label>\
        <input type="radio" name="dateOffset" id="365" value="365"><label for="365">365 Days</label>\
      </div>\
      <select name="dateOffset" class="dateOffset">\
        <option value="1">Last Day</option>\
        <option value="7" selected>Last 7 Days</option>\
        <option value="30">Last 30 Days</option>\
        <option value="365">Last Year</option>\
      </select>\
      <input type="submit" name="tpw-submit" class="tpw-submit" value="GO">\
    </form>');
    tpl.styles = '<style type="text/css">\
    .tpw-grouped-widget {\
      margin: 5px;\
      float: left;\
      display: inline-block;\
    }\
    </style>';
  }
};

var _TPW = new TPW();
var pageScriptTags = document.getElementsByTagName("script"), tpwSrc = pageScriptTags[pageScriptTags.length-1].src;
_TPW.path = tpwSrc.substr(0, tpwSrc.indexOf('tpw-init.js'));