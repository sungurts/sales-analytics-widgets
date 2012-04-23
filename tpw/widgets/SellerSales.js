SellerSales = function () {
  var self = this;
  
  this.updateChart = function (currentTimeUnit) {
      var endpoint = this.config.endpoint, currentTerapeakProxy = this.tpProxy;

      this.jQuery.ajax({
          url: endpoint + '&timeUnit=' + currentTimeUnit + '&Terapeak-Proxy=' + currentTerapeakProxy,
          cache: false,
          dataType: 'jsonp',
          crossDomain: true,
          success: function (data) {
              var record = data.results[0];
              var results = record.values, rows = [], options, chart, chartData;
              self.jQuery.each(results, function (index, value) {
                  rows.push([String(value.key), value.value])
              });

              chartData = new google.visualization.DataTable();
              chartData.addColumn('string', 'Period');
              chartData.addColumn('number', '# of Sales');
              chartData.addRows(rows);

              options = {
                  title: record.title,
                  hAxis: {title: '', titleTextStyle: { color: 'black' }}
              };

              chart = new google.visualization.ColumnChart(document.getElementById('tpw-ss-chart'));
              chart.draw(chartData, options);
          }
      });
  }
  
  this.init = function (tpw, config) {
    this.TPW = tpw;
    this.jQuery = tpw.jQuery;
    this.config = config;
    this.config.endpoint = config.endpoint || 'http://sales-metrics.pub.met.dev.terapeak.net:8080/seller-sales?callback=?';
    this.tpProxy = config.tpProxy || 'gameaccessory';
    draw();
  }

  /* ---------------------------------------------------------------------------------------------------------------*/
  /* Private callbacks, initializers and utility functions                                                          */
  /* ---------------------------------------------------------------------------------------------------------------*/

  var draw = function () {
    self.jQuery(function () {
      var chartDelegate = function () {
          self.updateChart('DAY');
      };
      self.jQuery('#' + self.config.container).html('');
      self.jQuery('#' + self.config.container).append('<div id="tpw-ss-chart" style="float:left; width: 605px; height: 205px;"><img src="tpw/ajax-loader.gif"></div><div id="tpw-ss-chart-controls" style="float: left; width: 200px;"></div>');
      self.jQuery('#tpw-ss-chart-controls').append('<a href="#" data-unit="HOUR">Hour</a><br/><a href="#" data-unit="DAY">Day</a><br/><a href="#" data-unit="MONTH">Month</a><br/><a href="#" data-unit="YEAR">Year</a>');
      
      self.jQuery('#' + self.config.container + ' a').on('click', function (data) {
          self.updateChart($(this).data('unit'));
      });
      
      google.load('visualization', '1.0', {'packages':['corechart'], callback: chartDelegate});
    });
  }
};

_SellerSales = new SellerSales();