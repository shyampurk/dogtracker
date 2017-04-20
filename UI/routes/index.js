var express = require('express');
var router  = express.Router();
var request = require('request');
var curl 	= require('curlrequest');
var multer  = require('multer');
var fs 		= require('fs');
var path	= require('path');
var geo 	= require('mapbox-geocoding');

var submsg 

var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-cab5bb0d-dfef-4115-ab0c-670977ede3fb",
    subscribe_key : "sub-c-0971ddba-19b8-11e7-aca9-02ee2ddab7fe"
});

geo.setAccessToken('pk.eyJ1IjoiYXJhdmluZGMiLCJhIjoiOTBhNDM0ZWNmYTc3MDYzMjA0MjBmY2E5NGU3YmQ0MDYifQ.5s9Z-KPF9yvgT05nO12HOQ');

pubnub.subscribe({
    channel  : "send-position",
    message : function(message) {
        console.log( " > ", message );
        submsg = message;
    }
});	

function pubpublish(loc){
	
	pubnub.publish({
	    channel   : 'dogtracker',
	    message   : loc,
	    callback  : function(e) { 
	        console.log( "SUCCESS!", e );
	    },
	    error     : function(e) { 
	        console.log( "FAILED! RETRY PUBLISH!", e );
	    }
	});
}
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
    }
});

var upload = multer({ storage : storage}).single('userPhoto');

router.get('/',function(request,response){
	response.status(200).render('homepage');
});

router.get('/uploadimage',function(request,response){
	response.status(200).render('homepage');
});

router.get('/cleardb',function(request,response){
	var cleardb = {
			 	"messagetype": "req",
			 	"messagecode": "2"
			}
	pubpublish(cleardb)

	response.status(200).redirect("/");
});

router.post('/uploadimage',function(req,res,next){
	
	upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        else{
        	console.log(req.file.filename)
        	console.log(req.file.path)
        	console.log(req.file)

        	var options = {
			    url: 'https://dal.objectstorage.open.softlayer.com/v1/AUTH_b7de27866f2e4e87862da9183a8983af/DogImages/'+req.file.filename,
			    headers:{ 
			    	'X-Auth-Token':'gAAAAABY-LWgCRKsPXdGaVDB2g_Tl6K1HgqoYmT1JuYm6tEyYfnXIY0V4zpVZ7TVktSQrwuYnAWuxyfWNm74co4upipYh_-iJxvFyzonucrcJ3XCvA3xRZAaVoktSw8eJZcdY5E5CR9L-ZOQrZ_FNqPKiNzCKiiRgxpjOS8UDF7d0JvfIwQfovc' 
			    }
			};

			var requestStream = request.put(options);
			var sendfile = fs.createReadStream('./public/uploads/'+req.file.filename).pipe(requestStream);
			requestStream.on('response', function (response) {
				console.log(response.statusCode) 
				console.log(response.headers['content-type'])
				if(response.statusCode == 401){
					console.log("X-Auth-Token - expired")
					
					res.sendStatus(401)
				}else{
					console.log("success : ",submsg)

					// Reverse geocode coordinates to address. 
					geo.reverseGeocode('mapbox.places', submsg.lon, submsg.lat, function (err, geoData) {
					    console.log(geoData);
					});
					
					var loc = {
							 	"messagetype": "req",
							 	"messagecode": "1",
							 	"imageurl": "https://dal.objectstorage.open.softlayer.com/v1/AUTH_b7de27866f2e4e87862da9183a8983af/DogImages/"+req.file.filename,
							 	"geolocation": submsg
							}
					pubpublish(loc)

					// console.log(sendfile)
					res.sendStatus(200);
				}
			});	
		}
  	});
});

module.exports = router;