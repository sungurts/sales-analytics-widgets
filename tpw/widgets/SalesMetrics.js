SalesMetrics = function () {
  var TPW, config, tpl = {}, endpoint, tpProxy;
  tpl.styles = '<style type="text/css">\
  .tpw-summary-bar {\
    width: 460px;\
    min-height: 85px;\
    border: 1px solid #bbb;\
    border-radius: 5px;\
    font-family: sans-serif;\
    font-size: .75em;\
    color: #555;\
  }\
  .tpw-summary-bar div.tpw-sm-start, .tpw-summary-bar div.tpw-sm-loading { margin: 15px; }\
  .tpw-summary-bar div.tpw-sm-loading { text-align: center; }\
  .tpw-summary-bar form { margin: 0px; padding: 0px; }\
  .tpw-summary-bar div.tpw-sm-title-bar { display: block; position: relative; line-height: 35px; vertical-align: middle; padding-left: 20px;\
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
  .tpw-summary-bar div.tpw-sm-content { display: block; position: relative; }\
  .tpw-summary-bar div.tpw-sm-values {\
    position: relative;\
    margin: 5px;\
    background-color: #DCE8F7;\
    -webkit-border-radius: 5px;\
    -moz-border-radius: 5px;\
    border-radius: 5px;\
  }\
  .tpw-summary-bar .tpw-clear { display: block; clear: both; }\
  .tpw-summary-bar div.tpw-sm-values div { text-align: center; position: relative; float: left; margin: 10px; }\
</style>';
  tpl.noResults = 'No results';
  tpl.wrapper = Handlebars.compile('<div class="tpw-summary-bar"><div class="tpw-sm-title-bar">{{{title}}}</div><div class="tpw-sm-content">{{{content}}}</div><div class="tpw-clear"></div></div>');
  tpl.form = Handlebars.compile('<form id="tpw-sm-form">\
    Product: <input type="text" name="keyword" size="15" value="{{productValue}}">\
    Date Range: \
    <select name="dateOffset">\
      <option value="7">7 Days</option>\
      <option value="30">30 Days</option>\
      <option value="60">60 Days</option>\
      <option value="90">90 Days</option>\
    </select>\
    <input type="submit" name="tpw-sm-submit" value="GO">\
    </form>');
  tpl.start = '<div class="tpw-sm-start">Enter a search above...</div>';
  tpl.loading = '<div class="tpw-sm-loading"><img src="tpw/ajax-loader.gif" border="0"></div>';
  tpl.summaryBar = Handlebars.compile('<div class="tpw-sm-values">\
    <div><strong>Total Sales</strong><br>{{totalSalesUSD}}</div>\
    <div><strong>Avg. Price</strong><br>{{averagePriceOfItems}}</div>\
    <div><strong>Avg. Shipping</strong><br>{{averageShippingPriceOfItems}}</div>\
    <div><strong>Items Sold</strong><br>{{numItemsSold}}</div>\
    <div><strong>Total Shipping</strong><br>{{totalShippingCharges}}</div><span class="tpw-clear"></span></div>');

  this.init = function (tpw, config) {
    this.TPW = tpw;
    this.config = config;
    this.endpoint = config.endpoint || 'http://sales-metrics.pub.met.dev.terapeak.net:8080/sales-metrics';
    this.tpProxy = config.tpProxy || 'gameaccessory';
    this.draw();
  };
  
  this.draw = function () {
    var self = this;
    if (self.TPW.jQuery('#' + self.config.container)) {
      var htmlResult = tpl.wrapper({title: tpl.form({productValue: ''}), content: tpl.start});
      self.TPW.jQuery('#' + self.config.container).html(tpl.styles + htmlResult);
      self.TPW.jQuery('#tpw-sm-form').submit(function () { self.submitForm(this); return false; });
    } else {
      // container doesn't seem to exist...?
    }
  };
  
  this.drawResults = function (data) {
    var summaryBar = tpl.summaryBar({
      totalSalesUSD: data.results[0].totalSalesUSD,
      averagePriceOfItems: data.results[0].averagePriceOfItems,
      averageShippingPriceOfItems: data.results[0].averageShippingPriceOfItems,
      totalShippingCharges: data.results[0].totalShippingCharges,
      numItemsSold: data.results[0].numItemsSold
    });
    this.TPW.jQuery('.tpw-sm-content').html(summaryBar);
  };
  
  this.submitForm = function (formObj) {
    var self = this;
    var formData = this.TPW.jQuery(formObj).serializeArray();
    this.TPW.jQuery.each(formData, function (i, e) {
      if (typeof e.name !== 'undefined' && e.name == 'keyword') {
        e.value = e.value.split(' ');
      }
    });
    formData.push({name: 'Terapeak-Proxy', value: self.tpProxy});
    console.log(formData);
    this.TPW.jQuery('.tpw-sm-content').html(tpl.loading);
    this.TPW.jQuery.getJSON(this.endpoint + '?callback=?', formData, function (data, textStatus) {
      self.drawResults(data);
    });
  };
};

_SalesMetrics = new SalesMetrics();