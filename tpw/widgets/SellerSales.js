SellerSales = function () {
  var self = this, tpl = {};

  tpl.styles = [
    '<style type="text/css">',
    '  .tpw-ss-chart {',
    '    float:left;',
    '    width: 455px;',
    '    height: 205px;',
    '  }',
    '  .tpw-ss-chart-controls {',
    '    float:left;',
    '    width: 200px;',
    '  }',
    '  .tpw-summary-bar {',
    '    width: 460px;',
    '    min-height: 85px;',
    '    border: 1px solid #bbb;',
    '    border-radius: 5px;',
    '    font-family: sans-serif;',
    '    font-size: .75em;',
    '    color: #555;',
    '  }',
    '  .tpw-summary-bar div.tpw-ss-message, .tpw-summary-bar div.tpw-ss-loading { margin: 15px; }',
    '  .tpw-summary-bar div.tpw-ss-loading { text-align: center; }',
    '  .tpw-summary-bar form { margin: 0px; padding: 0px; }',
    '  .tpw-summary-bar div.tpw-ss-title-bar {',
    '    display: block;',
    '    position: relative;',
    '    line-height: 35px;',
    '    vertical-align: middle;',
    '    padding-left: 20px;',
    '    background-image: linear-gradient(bottom, #D1D1D1 8%, #fafafa 77%);',
    '    background-image: -o-linear-gradient(bottom, #D1D1D1 8%, #fafafa 77%);',
    '    background-image: -moz-linear-gradient(bottom, #D1D1D1 8%, #fafafa 77%);',
    '    background-image: -webkit-linear-gradient(bottom, #D1D1D1 8%, #fafafa 77%);',
    '    background-image: -ms-linear-gradient(bottom, #D1D1D1 8%, #fafafa 77%);',
    '    background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0.08, #D1D1D1), color-stop(0.77, #fafafa));',
    '    -webkit-border-top-left-radius: 5px;',
    '    -webkit-border-top-right-radius: 5px;',
    '    -moz-border-radius-topleft: 5px;',
    '    -moz-border-radius-topright: 5px;',
    '    border-top-left-radius: 5px;',
    '    border-top-right-radius: 5px;',
    '  }',
    '</style>'
  ].join('\n');

  tpl.noResults = '<div class="tpw-ss-message">No results.</div>';
  tpl.wrapper = Handlebars.compile([
    '<div class="tpw-summary-bar">',
    '  <div class="tpw-ss-title-bar">',
    '    {{{title}}}',
    '  </div>',
    '  <div class="tpw-ss-content">',
    '    {{{content}}}',
    '  </div>',
    '  <div class="tpw-clear"></div>',
    '</div>'
  ].join('\n'));

  tpl.form = Handlebars.compile([
    '<form id="tpw-ss-form">',
    '  Keywords: <input type="text" name="keywords" size="15" value="{{keywordValue}}">',
    '  Date Range:',
    '  <select name="timeUnit">',
    '    <option value="HOUR">Last Hour</option>',
    '    <option value="DAY" selected>Last Day</option>',
    '    <option value="MONTH">Last 30 Days</option>',
    '    <option value="YEAR">Last Year</option>',
    '  </select>',
    '  <input type="submit" name="tpw-ss-submit" value="GO">',
    '</form>'
  ].join('\n'));


  tpl.start = '<div class="tpw-ss-message">Enter a search above...</div>';
  tpl.loading = '<div class="tpw-ss-loading"><img src="tpw/ajax-loader.gif" border="0"></div>';
  tpl.chartPanel = Handlebars.compile([
    '<div class="tpw-ss-chart">',
    '  <img src="tpw/ajax-loader.gif">',
    '</div>'
  ].join('\n'));

  this.drawChart = function (data) {
    var record = data.results[0], results = record.values, rows = [], options, chart, chartData;
    self.jQuery.each(results, function (index, value) {
      rows.push([String(value.key), value.value])
    });

    chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Period');
    chartData.addColumn('number', '# of Sales');
    chartData.addRows(rows);

    options = {
      title:record.title,
      hAxis:{title:'', titleTextStyle:{ color:'black' }}
    };

    self.jQuery('.tpw-ss-content').html('<div class="tpw-ss-chart" id="tpw-ss-chart">asdfasdf</div>');
    chart = new google.visualization.ColumnChart(document.getElementById('tpw-ss-chart'));
    chart.draw(chartData, options);
  };

  this.init = function (tpw, config) {
    this.TPW = tpw;
    this.jQuery = tpw.jQuery;
    this.config = config;
    this.endpoint = config.endpoint || 'http://haproxy.pub.met.dev.terapeak.net/seller-sales';
    this.tpProxy = config.tpProxy || 'gameaccessory';
    draw();
  };

  /* ---------------------------------------------------------------------------------------------------------------*/
  /* Private callbacks, initializers and utility functions                                                          */
  /* ---------------------------------------------------------------------------------------------------------------*/

  var draw = function () {
    if (self.jQuery('#' + self.config.container)) {
      var htmlResult = tpl.wrapper({title:tpl.form({keywordValue:''}), content: null});
      self.jQuery('#' + self.config.container).html(tpl.styles + htmlResult);

      self.jQuery('#tpw-ss-form').submit(function () {
        submitForm(this);
        return false;
      });
    } else {
      // container doesn't seem to exist...?
    }

    self.jQuery(function () {
      var chartDelegate = function () {
        self.jQuery('#tpw-ss-form').submit();
      };
      google.load('visualization', '1.0', {'packages':['corechart'], callback:chartDelegate});
    });
  };

  var submitForm = function (formObj) {
    var formData = self.jQuery(formObj).serializeArray();
    self.jQuery.each(formData, function (i, e) {
      if (typeof e.name !== 'undefined' && e.name == 'keyword') {
        e.value = e.value.split(' ');
      }
    });

    self.jQuery('.tpw-ss-content').html(tpl.loading);
    self.jQuery.getJSON(
      self.endpoint + '?callback=?&Terapeak-Proxy=' + self.tpProxy,
      formData,
      function (data, textStatus) {
        if (data.results.length) {
          self.drawChart(data);
        } else {
          self.jQuery('.tpw-ss-content').html(tpl.noResults);
        }
      }
    );
  };
};

_SellerSales = new SellerSales();