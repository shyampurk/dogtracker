# DogTracker UI Application

To run the client UI application , perform the following steps

## PREREQUISITES :

You will need PubNub, MapBox and IBM Object Storage API credentials for running the UI app. 

To get PubNub Keys , login to your pubnub account and click create a new app and get the keyset for this application.
        
        https://admin.pubnub.com/#/login
        
To get Mapbox Access Token , login to your mapbox account and select myaccess tokens link and click "create new token".
        
        https://www.mapbox.com/studio/account/tokens/

To get ObjectStorage API URL & X-Auth-Token ,follow this procedure in main [README](https://github.com/shyampurk/dogtracker/blob/master/README.md) section under the heading "Working with object storage api"
        
        Follow step 1 in that heading for getting API URL and X-Auth-Token 

### Steps to launch the App

#### STEP 1 : 
Download/fork the source code of this repository and update the keys at the application server side and client side
    
    ### Pubnub Keys: Change the PubNub key in the following files
    1. routes/routes.js --> line numbers 25,26
    2. public/javascript/src/main.js --> line numbers 10,11
    
    ### Mapbox AccessToken : Change the Mapbox AccessToken in the following files
    1. routes/routes.js --> line number 31
    2. public/javascript/src/main.js --> line number 16
    
    ### Object Storage API URL: Change the Object Storage API URL in the following file
    1. routes/routes.js --> line numbers 129,166
    
    ### Object Storage API X-Auth-Token: Change the Object Storage API X-Auth-Token in the following file
    1. routes/routes.js --> line number 131

#### STEP 2 : 
To RUN the server
    
1.This application require nodejs. To download and install nodejs on the hosting server, follow this link.
    
    https://nodejs.org/en/download/
    
2.Open the AppUI directory in terminal, install all the node package dependencies and run the node application as

    node dogtracker_server.js

3.Open the following link in your browser (assuming that you are running the Node.js on a local server)

    http://127.0.0.1:4010/
    
Alternatively you can host the application on a cloud server and access it via its IP Address.

### Clearing the application state

If you want to clear the previously uploaded dog images then send the following URL

        http://139.59.4.109:4010/cleardb
  
