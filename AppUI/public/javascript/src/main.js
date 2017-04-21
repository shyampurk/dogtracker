/***********************************************************

				DOG TRACKER

************************************************************/

// Initializing pubnub

var pubnub = PUBNUB({
    publish_key   : "pub-c-cab5bb0d-dfef-4115-ab0c-670977ede3fb",
    subscribe_key : "sub-c-0971ddba-19b8-11e7-aca9-02ee2ddab7fe"
});

// Initializing Mapbox

L.mapbox.accessToken = 'pk.eyJ1IjoiYXJhdmluZGMiLCJhIjoiOTBhNDM0ZWNmYTc3MDYzMjA0MjBmY2E5NGU3YmQ0MDYifQ.5s9Z-KPF9yvgT05nO12HOQ';

// Initializing map with default view

var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([39.8622325,-8.7855566], 2);

var geojson = []
var popup = L.popup();

/***************************************************************************************
	Function      : page load/reload
	Channel       : dogtracker_req_resp
	Description   : Publishes to pubnub channel to receive all dog breeds from db
****************************************************************************************/

$(window).load(function () {
	var channel = 'dogtracker_req_resp';
	var message = {
					"messagetype": "req",
					"messagecode": "0"
				}
	pubPublish(channel,message)
});

/***************************************************************************************
	Function      : onMapClick
	Channel       : dogtracker_marker_position
	Description   : Publishes lat/lon position to server through this pubnub channel and
					opens the popup for uploading image to server 
****************************************************************************************/

function onMapClick(e){
	popup
		.setLatLng(e.latlng)
		.setContent('<strong>Current position : '+e.latlng.toString() +'</strong><br/><br/>'+
			'<form id="uploadForm" action="/uploadimage" enctype="multipart/form-data" method="POST" target="uploader_iframe">'+
			'<input type="file" name="userPhoto" /><br/><br/>'+
			'<div class="buttonHolder"><input id="submitImage" type="submit" value="Upload Image" name="submit" disabled></div>'+
			'</form>'+
			'<iframe id="uploader_iframe" name="uploader_iframe" style="display: none;"></iframe>')
		.openOn(map);

	$('input:file').change(
            function(){
                if ($(this).val()) {
                    $('input:submit').attr('disabled',false); 
                } 
            }
        );
	var channel = 'dogtracker_marker_position';
	var message = {"lat":e.latlng.lat.toString(),"lon":e.latlng.lng.toString()}
	
	console.log(message)
	pubPublish(channel,message)
}

/***************************************************************************************
	Function      : pubnub subscribe
	Channel       : dogtracker_req_resp
	Description   : Subscribes to pubnub channel to receive marker positions on map
****************************************************************************************/

pubnub.subscribe({
    channel  : "dogtracker_req_resp",
    message : function(message) {
    	console.log(message);
    	var myLayer = L.mapbox.featureLayer().addTo(map);
	
    	if (message.messagecode == 1 && message.messagetype == "resp") {
    		if (message.queryDogBreed == null) {
    			console.log("Unknown Dog Breed")
    			alert("Unknown Dog Breed, Try again")
    		}else{

		    	geojson.push({
			        type: 'Feature',
			        geometry: {
			          type: 'Point',
			          coordinates: [message.geolocation.lon, message.geolocation.lat]
			        },
			        properties: {
			            title: 'Location :'+message.geolocation.address,
			            description: message.queryDogBreed ,
			            image: message.imageurl,
			            icon: {
				            iconUrl: message.imageurl,
				            iconSize: [50, 50], 
				            className: 'dot'
				        }
			        }
			    })
			}
			popup.remove();
	    }else if(message.messagecode == 0 && message.messagetype == "resp"){
	    	
	    	if(message.dbval != null){

	    		var i = 0;
	    		console.log(message.dbval.length)
		    	for(i = 0 ; i < message.dbval.length ; i++){
		    		
			    	geojson.push({
				        type: 'Feature',
				        geometry: {
				          type: 'Point',
				          coordinates: [message.dbval[i].geolocation.lon, message.dbval[i].geolocation.lat]
				        }
				        ,
				        properties: {
				          title: 'Location :'+message.dbval[i].geolocation.address,
				          description: message.dbval[i].breed ,
				          image: message.dbval[i].url,
				          icon: {
				            iconUrl: message.dbval[i].url,
				            iconSize: [50, 50],
				            className: 'dot'
				          }
				        }
				    })
				}
			}else if(message.messagecode == 3 && message.messagetype == "resp"){
				console.log("X-Auth-Token Expired")
				alert("X-Auth-Token Expired ");
			}else if(message.messagecode == 4 && message.messagetype == "resp"){
				console.log("GeoCoding Error")
				alert("GeoCoding Error , Try again !!!");
			}else{
				console.log("db null")
				alert("Database value is NULL , Try uploading images !!!");
			}
	    }
		
		myLayer.on('layeradd', function(e) {
		    var marker = e.layer,
		        feature = marker.feature;
		    var m = L.divIcon({

	            className: 'container',
	            iconSize: [20,20],
	            html :  '<div class="maindiv">'+
				            '<div class="Imgdiv">'+
				                '<img class="Img-div" src="'+feature.properties.image+'" />'+
				            '</div>'+
				            '<div class="text-div">'+feature.properties.description+'</div>'+
						'</div>',
	            popupAnchor: [0,-20]
	        });
		    marker.setIcon(m);
		});
		myLayer.setGeoJSON(geojson);
    }
});

map.on('click', onMapClick); 

/***************************************************************************************
	Function      : pubnub publish
	Channel       : dogtracker_req_resp and dogtracker_marker_position
	Description   : Publishes message to pubnub channel 
****************************************************************************************/

function pubPublish(channel,message){
	pubnub.publish({
	    channel   : channel,
	    message   : message,
	    callback  : function(e) { 
	        console.log( "SUCCESS!", e );
	    },
	    error     : function(e) { 
	        console.log( "FAILED! RETRY PUBLISH!", e );
	    }
	});
}; 
