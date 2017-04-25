/***********************************************************

				DOG TRACKER

************************************************************/

// Import required modules

var express = require('express');
var router  = express.Router();
var request = require('request');
var curl 	= require('curlrequest');
var multer  = require('multer');
var fs 		= require('fs');
var path	= require('path');
var geo 	= require('mapbox-geocoding');
var logger  = require('../logger');

var marker_position 

// Initializing pubnub 

var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-cab5bb0d-dfef-4115-ab0c-670977ede3fb",
    subscribe_key : "sub-c-0971ddba-19b8-11e7-aca9-02ee2ddab7fe"
});

// Initializing Mapbox

geo.setAccessToken('pk.eyJ1IjoiYXJhdmluZGMiLCJhIjoiOTBhNDM0ZWNmYTc3MDYzMjA0MjBmY2E5NGU3YmQ0MDYifQ.5s9Z-KPF9yvgT05nO12HOQ');

/***************************************************************************************
	Function      : pubnub subscribe
	Channel       : dogtracker_marker_position
	Description   : Subscribes to pubnub channel to receive marker positions on map
****************************************************************************************/

pubnub.subscribe({
    channel  : "dogtracker_marker_position",
    message : function(message) {
        // console.log( " > ", message );
        logger.debug("marker_position ==> ",message)
        marker_position = message;
    }
});	

/***************************************************************************************
	Function      : pubnub publish
	Channel       : dogtracker_req_resp
	Description   : Publishes message to pubnub channel 
****************************************************************************************/

function pubpublish(msg_to_send){
	
	pubnub.publish({
	    channel   : 'dogtracker_req_resp',
	    message   : msg_to_send,
	    callback  : function(e) { 
	        console.log( "SUCCESS!", e );
	    },
	    error     : function(e) { 
	        console.log( "FAILED! RETRY PUBLISH!", e );
	    }
	});
}

/***************************************************************************************
	Function      : Local storage of Uploaded image
	Module        : Multer (single file upload)
	Description   : receives the image ,renames it and stores in local storage 
****************************************************************************************/

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
    }
});

var upload = multer({ storage : storage}).single('userPhoto');

/***************************************************************************************
	Method        : GET
	Description   : receives the request and renders the homepae
****************************************************************************************/

router.get('/',function(request,response){
	response.status(200).render('homepage');
});

router.get('/uploadimage',function(request,response){
	response.status(200).redirect("/");
});

/***************************************************************************************
	Method        : GET
	Description   : Clears the pubnub key-value db through pubnub blocks 
****************************************************************************************/

router.get('/cleardb',function(request,response){
	var cleardb = {
			 	"messagetype": "req",
			 	"messagecode": "2"
			}
	pubpublish(cleardb)

	response.status(200).redirect("/");
});

/***************************************************************************************
	Method        : POST
	Description   : receives the image ,uploads it to object storage API ,and does the 
					reverse geocoding of co-ordinates to get the address of the location
****************************************************************************************/

router.post('/uploadimage',function(req,res,next){
	
	upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        else{
        	
        	logger.debug("Multer image Uploaded file == >",req.file)
        	var options = {
			    url: 'https://dal.objectstorage.open.softlayer.com/v1/AUTH_b7de27866f2e4e87862da9183a8983af/DogImages/'+req.file.filename,
			    headers:{ 
			    	'X-Auth-Token':'gAAAAABY_tqVO4cci4O0wgMoh_i6mNTgkbNpvktSS6pIXf7BHAvh4v7ns-4SJ-J_HUndv29lX_7AwIy8-iNRpKVdy046j47K50meyeKG0pTHLAZHq8W3PG8XG4gZufXCtSitPoTlJBrTtmm7BqdJp5LbmoIHfJJxtLnUMBOlZTGhs-AX-cx7YUw' 
			    }
			};

			var requestStream = request.put(options);
			var sendfile = fs.createReadStream('./public/uploads/'+req.file.filename).pipe(requestStream);
			requestStream.on('response', function (response) {
				
				logger.debug("Object storage response statusCode ==> ",response.statusCode)
				if(response.statusCode == 401){
					logger.debug("X-Auth-Token - expired")
					var authError = {
							 	"messagetype": "resp",
							 	"messagecode": "3"
							}
					pubpublish(authError)
					res.sendStatus(200)
				}else{
					logger.debug("Object storage response statusCode ==> ",response.statusCode)
					// Reverse geocode coordinates to address. 
					geo.reverseGeocode('mapbox.places', marker_position.lon, marker_position.lat, function (err, geoData) {
					    if(!err){
					    	console.log(geoData.features.length)
						    if(geoData.features.length == 0){
						    	var country = "Unknown Location"
						    }else{
							    var count = geoData.features.length - 1
							    console.log("count :",count)
							    var country = geoData.features[count].place_name
						    }
						    logger.debug("Reverse geocode response(address) ==> ",country)
						    console.log(country)
						    var loc = {
								 	"messagetype": "req",
								 	"messagecode": "1",
								 	"imageurl": "https://dal.objectstorage.open.softlayer.com/v1/AUTH_b7de27866f2e4e87862da9183a8983af/DogImages/"+req.file.filename,
								 	"geolocation": {"lat":marker_position.lat,"lon":marker_position.lon,"address":country}
								}
							pubpublish(loc)
							res.sendStatus(200);
					    }
					    else{
					    	var geocodeError = {
								 	"messagetype": "resp",
								 	"messagecode": "4"
								}
							pubpublish(geocodeError)
							res.sendStatus(200);
					    }
					    
					});
				}
			});	
		}
  	});
});

module.exports = router;