sales-analytics-widgets
=======================

Use below code to embed Sales Analytics Dashboard to your site.
-----------------------
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
    <script type="text/javascript" src="http://terapeak.github.com/sales-analytics-widgets/tpw/tpw-init.js"></script>
    <script type="text/javascript">
    _TPW.init();
    _TPW.load('SalesMetrics', {container: 'containerSalesMetrics', tpProxy: 'SELLER_NAME', apiKey: API_KEY});
    _TPW.load('SellerSales', {container: 'containerSellerSales', tpProxy: 'SELLER_NAME', apiKey: API_KEY});
    </script>
