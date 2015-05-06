var express = require("express");
var app     = express();
var path    = require("path");
var bodyParser = require('body-parser');
var http = require('http');
var request = require('request');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/test', function(req, res){
	var httpInner = require('https');
	var responseData;
	var optionsInner = {
   	host: "wdaniels-test.apigee.net",
      path: "/group4finalprojectbetter/getBannedList",
      method: "GET"
	};

	var requestInner = httpInner.request(optionsInner, function (resp) {
   	resp.on('data', function(data){
      	responseData += data.toString();
      });
      resp.on('end', function(){
			responseData = responseData.replace('undefined','');
      	var msg = JSON.parse(responseData);
			//console.log(msg[0].ip);
			console.log(msg);
			//(JSON.stringify(responseData, null, 4));

			var marker = new Array();
			marker.push(msg);

			console.log(marker[0]);
		
			var htmlData = "<html><head><title>Payment Failed</title><link rel='stylesheet' type='text/css' href='/public/stylesheets/grid.css'><link rel='stylesheet' type='text/css' href='/public/stylesheets/style.css'><script src='https://maps.googleapis.com/maps/api/js'></script><script>function initialize() {var genMarkers = function() {var markers = "+JSON.stringify(marker)+"[0];return markers;};var mapCanvas = document.getElementById('map-canvas');var mapOptions = {center: new google.maps.LatLng(0,0),zoom: 2,mapTypeId: google.maps.MapTypeId.ROADMAP};var map = new google.maps.Map(mapCanvas, mapOptions);var markers = genMarkers();for(var index in markers) {console.log(JSON.stringify(markers[index]['ip']));var long = markers[index]['longitude'];var marker = new google.maps.Marker({position: new google.maps.LatLng(markers[index]['latitude'], markers[index]['longitude']),map: map/*,title: markers[index]['ip']*/});}}google.maps.event.addDomListener(window, 'load', initialize);</script></head><body id='banned-body'><div class='grid grid-pad' id ='Index Page'><div class='col-1-1'><div class= 'content' id ='banned'><h1>BANNED!</h1><h2>Sorry! We do not accept money from communist scum!</h2><div id='map-canvas'></div></div></div><div class='col-1-2'><a href = '/'>Home</a></div></div></div></body></html>";
      	res.send(htmlData);
});
	});
   requestInner.end();

});

app.post('/payment', function(request, res){

	var post_data = "<litleOnlineRequest version='8.10' xmlns='http://www.litle.com/schema' merchantId='default'><authentication><user>JoesStore</user><password>JoeyIsTheBest</password></authentication><authorization id='ididid' reportGroup='rtpGrp' customerId='12345'>orderId>1</orderId><amount>1000</amount><orderSource>ecommerce</orderSource><card><type>MC</type><number>5454545454545454</number><expDate>1112</expDate><cardValidationNum>123</cardValidationNum></card></authorization></litleOnlineRequest>";

	var post_options = {
      		host: 'wdaniels-test.apigee.net',
      		port: '80',
      		path: '/group4finalprojectbetter/payus',
      		method: 'POST',
      		headers: {
          		'Content-Type': 'text/xml',
          		'Content-Length': post_data.length
      		}
  	};	
	
	var post_req = http.request(post_options, function(resp) {
      		
		resp.setEncoding('utf8');
      		//console.log(resp);	
		resp.on('data', function (chunk) {
			
        		console.log('Response: ' + chunk);
			var msg = chunk.toString();
			if((msg == "I'm sorry, this country isn't allowed to access our payment server.")||(msg == "I'm sorry, this IP address has been banned permanently, please contact the admins for more information")){
				//res.send(chunk);
				res.sendFile(path.join(__dirname+'/failure.html'));
			}
			else{
				res.sendFile(path.join(__dirname+'/success.html'));
				//res.send('Payment Successful')
			}
      });
	});

	post_req.write(post_data);
	post_req.end();
});
	
app.use("/public/stylesheets", express.static(__dirname + '/public/stylesheets'));
app.use("/public/images", express.static(__dirname + '/public/images'));
app.listen(3000);
