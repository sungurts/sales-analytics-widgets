SalesMetrics = function () {
  var TPW, config, tpl = {};
  tpl.styles = '<style type="text/css">.tpw-summary-bar { text-align: center; } .tpw-summary-bar div { position: relative; display: inline-block; float: left; margin: 10px; } </style>';
  tpl.summaryBar = '<div class="tpw-summary-bar">\
    <form id="">\
    \
    <div><strong>Total Sales USD</strong><br>{{totalSalesUSD}}</div>\
    <div><strong>Average Price of Items</strong><br> {{averagePriceOfItems}}</div>\
    <div><strong>Average Shipping Price of Items</strong><br> {{averageShippingPriceOfItems}}</div>\
    <div><strong>Total Shipping Charges</strong><br> {{totalShippingCharges}}</div>\
    <div><strong>Number of Items Sold</strong><br> {{numItemsSold}}</div></div>';

  this.init = function (tpw, config) {
    this.TPW = tpw;
    this.config = config;
    this.draw();
  };
  
  this.draw = function () {
    var self = this;
    if (self.TPW.jQuery('#' + self.config.container)) {
      var compiledTemplate = Handlebars.compile(tpl.summaryBar);
      self.TPW.jQuery.getJSON('tpw/widgets/SalesMetrics.json', function (data) {
        var htmlResult = compiledTemplate({
          totalSalesUSD: data.results[0].totalSalesUSD,
          averagePriceOfItems: data.results[0].averagePriceOfItems,
          averageShippingPriceOfItems: data.results[0].averageShippingPriceOfItems,
          totalShippingCharges: data.results[0].totalShippingCharges,
          numItemsSold: data.results[0].numItemsSold
        });
        self.TPW.jQuery('#' + self.config.container).html(tpl.styles + htmlResult);
      });
    } else {
      // container doesn't seem to exist...?
    }
  };
  
  this.submitForm = function () {
    console.log('submitting form...');
  };
};

_SalesMetrics = new SalesMetrics();