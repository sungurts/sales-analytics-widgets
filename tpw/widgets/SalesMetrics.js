SalesMetrics = function () {
  var tpl = {}, self = this;
  tpl.styles = '<style type="text/css">\
  .tpw-summary-bar {\
    width: 500px;\
    min-height: 90px;\
    border: 1px solid #bbb;\
    border-radius: 5px;\
    font-family: sans-serif;\
    font-size: .75em;\
    color: #555;\
  }\
  .tpw-summary-bar div.tpw-message, .tpw-summary-bar div.tpw-loading { margin: 15px; }\
  .tpw-summary-bar div.tpw-loading { text-align: center; }\
  .tpw-summary-bar form { margin: 0px; padding: 0px; }\
  .tpw-summary-bar div.tpw-title-bar-inputs, .tpw-summary-bar div.tpw-title-bar {\
    display: block;\
    position: relative;\
    line-height: 35px;\
    vertical-align: middle;\
    padding-left: 20px;\
    background-image: linear-gradient(bottom, #D1D1D1 8%, #fafafa 77%);\
    background-image: -o-linear-gradient(bottom, #D1D1D1 8%, #fafafa 77%);\
    background-image: -moz-linear-gradient(bottom, #D1D1D1 8%, #fafafa 77%);\
    background-image: -webkit-linear-gradient(bottom, #D1D1D1 8%, #fafafa 77%);\
    background-image: -ms-linear-gradient(bottom, #D1D1D1 8%, #fafafa 77%);\
    background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0.08, #D1D1D1), color-stop(0.77, #fafafa));\
    -webkit-border-top-left-radius: 5px;\
    -webkit-border-top-right-radius: 5px;\
    -moz-border-radius-topleft: 5px;\
    -moz-border-radius-topright: 5px;\
    border-top-left-radius: 5px;\
    border-top-right-radius: 5px;\
  }\
  .tpw-summary-bar div.tpw-title-bar {\
    line-height: 20px;\
    background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwOTNkMCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwNjk5NyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==");\
    background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #0093d0), color-stop(100%, #006997));\
    background: -webkit-linear-gradient(#0093d0, #006997);\
    background: -moz-linear-gradient(#0093d0, #006997);\
    background: -o-linear-gradient(#0093d0, #006997);\
    background: -ms-linear-gradient(#0093d0, #006997);\
    background: linear-gradient(#0093d0, #006997);\
    background-color: #0093d0;\
    color: white;\
    text-shadow: 1px 1px 1px #006997;\
  }\
  .tpw-summary-bar div.tpw-content { display: block; position: relative; }\
  .tpw-summary-bar div.tpw-values {\
    position: relative;\
    margin: 5px;\
    background-color: #DCE8F7;\
    -webkit-border-radius: 5px;\
    -moz-border-radius: 5px;\
    border-radius: 5px;\
  }\
  .tpw-summary-bar .tpw-clear { display: block; clear: both; }\
  .tpw-summary-bar div.tpw-values div { text-align: center; position: relative; float: left; margin: 10px; }\
</style>';
  tpl.noResults = '<div class="tpw-message">No results.</div>';
  tpl.error = '<div class="tpw-message">An unexpected error has occurred.</div>';
  tpl.timeout = '<div class="tpw-message">The request has timed out.</div>';
  tpl.wrapper = Handlebars.compile('<div class="tpw-summary-bar">\
    <div class="tpw-title-bar{{#if inputs}}-inputs{{/if}}">{{{title}}}</div>\
    <div class="tpw-content">{{{content}}}</div>\
  <div class="tpw-clear"></div></div>');
  tpl.form = Handlebars.compile('<form class="tpw-form">\
    {{#if invisible}}\
      <input type="hidden" name="keyword" value="{{keyword}}">\
      <input type="hidden" name="dateOffset" class="dateOffset" value="{{dateOffset}}">\
    {{else}}\
      Product: <input type="text" name="keyword" size="15" value="{{keyword}}">\
      Date Range: \
      <select name="dateOffset">\
        <option value="1">Last Day</option>\
        <option value="7">Last 7 Days</option>\
        <option value="30">Last 30 Days</option>\
        <option value="60">Last 60 Days</option>\
        <option value="90">Last 90 Days</option>\
      </select>\
      <input type="submit" name="tpw-submit" class="tpw-submit" value="GO">\
    {{/if}}\
    </form>');
  tpl.start = '<div class="tpw-message">Enter a search above...</div>';
  tpl.loading = Handlebars.compile('<div class="tpw-loading"><img src="{{path}}ajax-loader.gif" border="0"></div>');
  tpl.summaryBar = Handlebars.compile('<div class="tpw-values">\
    <div><strong>Total Sales</strong><br>{{formatCurrency totalSalesUSD}}</div>\
    <div><strong>Avg. Price</strong><br>{{formatCurrency averagePriceOfItems}}</div>\
    <div><strong>Avg. Shipping</strong><br>{{formatCurrency averageShippingPriceOfItems}}</div>\
    <div><strong>Items Sold</strong><br>{{numItemsSold}}</div>\
    <div><strong>Total Shipping</strong><br>{{formatCurrency totalShippingCharges}}</div><span class="tpw-clear"></span></div>');

  this.init = function (tpw, config) {
    this.TPW = tpw;
    this.jQuery = jQuery;
    this.config = config;
    this.config.widgetName = this.config.widgetName || 'Sales Metrics';
    this.config.formSubmitEvent = config.formSubmitEvent || 'salesMetricsEvent';
    this.config.initCompleteEvent = config.initCompleteEvent || 'sellerSalesWidgetInitDone';
    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint || 'http://terapeak.api.mashery.com/v1/sales-metrics';
    this.tpProxy = config.tpProxy;
    this.keyword = config.keyword || '';
    this.dateOffset = config.dateOffset || 7;
    draw();
  };
  
  
  var draw = function () {
    if (self.jQuery('#' + self.config.container)) {
      var displayInputs = (typeof self.config.displayInputs === 'undefined' || self.config.displayInputs === true);
      var titleBar;
      if (displayInputs) {
        titleBar = tpl.form({keyword: self.keyword, dateOffset: self.dateOffset});
      } else {
        titleBar = self.config.widgetName + tpl.form({invisible: true, keyword: self.keyword, dateOffset: self.dateOffset});
      }
      var htmlResult = tpl.wrapper({
        title: titleBar,
        inputs: displayInputs,
        content: tpl.start
      });
      self.jQuery('#' + self.config.container).html(tpl.styles + htmlResult);
      
      self.jQuery(self.TPW).unbind(self.config.formSubmitEvent);
      self.jQuery(self.TPW).bind(self.config.formSubmitEvent, function (eventObj, form) {
        submitForm(form);
      });
      if (displayInputs) {
        getForm().submit(function () {
          self.jQuery(self.TPW).trigger(self.config.formSubmitEvent, getForm());
          return false;
        });
      } else {
        self.jQuery(self.TPW).trigger(self.config.formSubmitEvent, getForm());
      }
    } else {
      // container doesn't seem to exist...?
    }
  };
  
  var drawResults = function (data) {
    var summaryBar = tpl.summaryBar({
      totalSalesUSD: data.results[0].totalSalesUSD,
      averagePriceOfItems: data.results[0].averagePriceOfItems,
      averageShippingPriceOfItems: data.results[0].averageShippingPriceOfItems,
      totalShippingCharges: data.results[0].totalShippingCharges,
      numItemsSold: data.results[0].numItemsSold
    });
    setContent(summaryBar);
  };
  
  var submitForm = function (formObj) {
    var formData = self.jQuery(formObj).serializeArray();
    var formDataString = '';
    self.jQuery.each(formData, function (i, e) {
      if (typeof e.name !== 'undefined' && e.name == 'keyword' && e.value.indexOf(' ') > -1) {
        e.value = self.jQuery.trim(e.value);
        var keywordSplit = e.value.split(' ');
        self.jQuery.each(keywordSplit, function(keywordIndex, subValue) {
          formDataString += '&' + e.name + '=' + subValue;
        });
      } else {
        formDataString += '&' + e.name + '=' + e.value;
      }
    });
    self.jQuery.jsonp({
      cache: true,
      beforeSend: function () {
        setContent(tpl.loading({path: self.TPW.path}));
        disableSubmitButton();
      },
      url: self.endpoint + '?callback=?&Terapeak-Proxy=' + self.tpProxy + '&api_key=' + self.apiKey + formDataString,
      complete: function (xOptions, textStatus) {
        if (textStatus == 'error') {
          setContent(tpl.error);
        } else if (textStatus == 'timeout') {
          setContent(tpl.timeout);
        }
        enableSubmitButton();
        self.jQuery(self.TPW).trigger(self.config.initCompleteEvent);
      },
      success: function (data, textStatus) {
        if (data.results.length) {
          drawResults(data);
        } else {
          setContent(tpl.noResults);
        }
      }
    });
  }
  
  var setContent = function (content) {
    self.jQuery('#' + self.config.container + ' .tpw-content').html(content);
  };
  
  var getForm = function () {
    return jQuery('#' + self.config.container + ' .tpw-form');
  };
  
  var disableSubmitButton = function () {
    self.jQuery('#' + self.config.container + ' .tpw-submit').attr('disabled', 'disabled');
  };
  
  var enableSubmitButton = function () {
    self.jQuery('#' + self.config.container + ' .tpw-submit').removeAttr('disabled');
  };
};

var _SalesMetrics = new SalesMetrics();
