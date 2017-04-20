var pubnub = PUBNUB({
    publish_key   : "pub-c-cab5bb0d-dfef-4115-ab0c-670977ede3fb",
    subscribe_key : "sub-c-0971ddba-19b8-11e7-aca9-02ee2ddab7fe"
});

L.mapbox.accessToken = 'pk.eyJ1IjoiYXJhdmluZGMiLCJhIjoiOTBhNDM0ZWNmYTc3MDYzMjA0MjBmY2E5NGU3YmQ0MDYifQ.5s9Z-KPF9yvgT05nO12HOQ';

var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([39.8622325,-8.7855566], 2);

var geojson = []
var popup = L.popup();

$(window).load(function () {
	var channel = 'dogtracker';
	var message = {
					"messagetype": "req",
					"messagecode": "0",
					"imageurl":""
				}
	pubPublish(channel,message)
});

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
	var channel = 'send-position';
	var message = {"lat":e.latlng.lat.toString(),"lon":e.latlng.lng.toString()}
	
	console.log(message)
	pubPublish(channel,message)
}



pubnub.subscribe({
    channel  : "dogtracker",
    message : function(message) {
    	console.log(message);
    	var myLayer = L.mapbox.featureLayer().addTo(map);
	
    	if (message.messagecode == 1) {
    		console.log("dog breed: ",(message.queryDogBreed).length)
    		if ((message.queryDogBreed).length == 0) {
    			console.log("Could'nt find dog breed ")
    			alert("Could'nt find dog breed, Try again")
    		}else{

		    	geojson.push({
			        type: 'Feature',
			        geometry: {
			          type: 'Point',
			          coordinates: [message.geolocation.lon, message.geolocation.lat]
			        },
			        properties: {
			            // title: message.queryDogBreed,
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
	    }else if(message.messagecode == 0){
	    	
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
				          // title: message.queryDogBreed,
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
