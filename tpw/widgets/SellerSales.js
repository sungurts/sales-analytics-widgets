SellerSales = function () {
  var self = this, tpl = {}, defaults;

  defaults = {
    'HOUR': {
      format: 'HH:mm',
      title: 'Per Minute Seller Sales (last hour)'
    },
    'DAY': {
      format: 'HH:mm',
      title: 'Per Hour Seller Sales (last day)'
    },
    'MONTH': {
      format: 'MMM-dd',
      title: 'Per Day Seller Sales (last month)'
    },
    'YEAR': {
      format: 'yyyy-MMM',
      title: 'Per Month Seller Sales (last year)'
    }
  };

  tpl.styles = '<style type="text/css">\
    .tpw-chart {\
      float:left;\
      width: 455px;\
      height: 205px;\
    }\
    .tpw-chart-controls {\
      float:left;\
      width: 200px;\
    }\
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
  </style>';

  tpl.error = '<div class="tpw-message">An unexpected error has occurred.</div>';
  tpl.noResults = '<div class="tpw-message">No results.</div>';
  tpl.wrapper = Handlebars.compile('<div class="tpw-summary-bar">\
      <div class="tpw-title-bar{{#if inputs}}-inputs{{/if}}">\
        {{{title}}}\
      </div>\
      <div class="tpw-content">\
        {{{content}}}\
      </div>\
      <div class="tpw-clear"></div>\
    </div>');

  tpl.form = Handlebars.compile('<form class="tpw-form">\
      {{#if invisible}}\
      <input type="hidden" name="keyword" value="{{keywordValue}}">\
      <input type="hidden" name="timeUnit" value="">\
      {{else}}\
      Keywords: <input type="text" name="keyword" size="15" value="{{keywordValue}}">\
      Date Range:\
      <select name="timeUnit" class="time-unit">\
        <option value="HOUR">Last Hour</option>\
        <option value="DAY" selected>Last Day</option>\
        <option value="MONTH">Last 30 Days</option>\
        <option value="YEAR">Last Year</option>\
      </select>\
      <input type="submit" name="tpw-submit" class="tpw-submit" value="GO">\
      {{/if}}\
    </form>');


  tpl.start = '<div class="tpw-message">Enter a search above...</div>';
  tpl.loading = '<div class="tpw-loading"><img src="tpw/ajax-loader.gif" border="0"></div>';
  tpl.chartPanel = Handlebars.compile('<div class="tpw-chart">\
      <img src="tpw/ajax-loader.gif">\
    </div>');

  this.drawChart = function (data, timeUnit) {
    var record = data.results[0], results = record.values, rows = [], options, chart, chartData;
    self.jQuery.each(results, function (index, value) {
      var dateString = Date.parse(value.key).toString('dd MMM yyyy HH:mm:ss') + ' GMT';
      var date = new Date(dateString).toString(defaults[timeUnit].format);
      rows.push([String(date), value.value]);
    });

    chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Period');
    chartData.addColumn('number', '# of Sales');
    chartData.addRows(rows);

    options = {
      title:defaults[timeUnit].title,
      hAxis:{title:'', titleTextStyle:{ color:'black' }}
    };

    setContent('<div class="tpw-chart" id="' + self.config.container + '-tpw-chart"></div>');
    chart = new google.visualization.ColumnChart(document.getElementById(self.config.container + '-tpw-chart'));
    chart.draw(chartData, options);
  };

  this.init = function (tpw, config) {
    this.TPW = tpw;
    this.jQuery = tpw.jQuery;
    this.config = config;
    this.config.widgetName = this.config.widgetName || 'Seller Sales';
    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint || 'http://terapeak.api.mashery.com/v1/seller-sales';
    this.tpProxy = config.tpProxy;
    draw();
  };

  /* ---------------------------------------------------------------------------------------------------------------*/
  /* Private callbacks, initializers and utility functions                                                          */
  /* ---------------------------------------------------------------------------------------------------------------*/

  var draw = function () {
    if (self.jQuery('#' + self.config.container)) {
      var displayInputs = (typeof self.config.displayInputs === 'undefined' || self.config.displayInputs === true);
      var titleBar;
      if (displayInputs) {
        titleBar = tpl.form({keywordValue: ''});
      } else {
        titleBar = self.config.widgetName + tpl.form({invisible: true});
      }
      var htmlResult = tpl.wrapper({
        title: titleBar,
        inputs: displayInputs,
        content: null
      });
      self.jQuery('#' + self.config.container).html(tpl.styles + htmlResult);
      
      if (displayInputs) {
//         getForm().submit(function () {
//           submitForm(this);
//           return false;
//         });
      } else {
        self.jQuery('#' + self.config.container).bind(self.config.group + 'FormSubmit', function() {
          console.log('event fired!');
//           submitForm(
        });
      }
    } else {
      // container doesn't seem to exist...?
    }

    self.jQuery(function () {
      var chartDelegate = function () {
        getForm().submit();
      };
      google.load('visualization', '1.0', {'packages':['corechart'], callback:chartDelegate});
    });
  };

  var submitForm = function (formObj) {
    var formData = self.jQuery(formObj).serializeArray(), formDataString = '';
    self.jQuery.each(formData, function (i, e) {
      if (typeof e.name !== 'undefined' && e.name == 'keyword' && e.value.indexOf(' ') > -1) {
        e.value = self.jQuery.trim(e.value);
        var keywordSplit = e.value.split(' ');
        self.jQuery.each(keywordSplit, function (keywordIndex, subValue) {
          formDataString += '&' + e.name + '=' + subValue;
        });
      } else {
        formDataString += '&' + e.name + '=' + e.value;
      }
    });

    self.jQuery.jsonp({
      beforeSend: function () {
        setContent(tpl.loading);
        self.jQuery('#' + self.config.container + ' .tpw-submit').attr('disabled', 'disabled');
      },
      url: self.endpoint + '?callback=?&Terapeak-Proxy=' + self.tpProxy + '&api_key=' + self.apiKey + formDataString,
      complete: function (xOptions, textStatus) {
        if (textStatus !== 'success') {
          setContent(tpl.error);
        }
        self.jQuery('#' + self.config.container + ' .tpw-submit').removeAttr('disabled');
      },
      success: function (data, textStatus) {
        if (data.results.length) {
          self.drawChart(data, $('#' + self.config.container + ' .tpw-form .time-unit').val());
        } else {
          setContent(tpl.noResults);
        }
      }
    });
  };
  
  var setContent = function (content) {
    self.jQuery('#' + self.config.container + ' .tpw-content').html(content);
  };
  
  var getForm = function () {
    return jQuery('#' + self.config.container + ' .tpw-form');
  };
};

var _SellerSales = new SellerSales();