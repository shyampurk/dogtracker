export default (request) => { 
    // Required modules
    const db = require('kvstore'); // Database module
    const xhr = require('xhr'); // xmlHTTP request module
    
    // Variables for functional purpose 
    var queryDogBreed = null;
    var queryDogScore = 0;
    var kvstoreKEY = "dog-image-tracker";
    var message_dict = [];
    var proceed = false;

    // api key for the visual recognition api
    var api_key = 'd8e5e6b8c43ec6a074c632962cd51b584f4d19fb';
    
     /*
        Name - dbget
        Description - Function used to get the database data 
        Parameters - None                  
    */
    function dbget()
    {
          return db.get(kvstoreKEY).then((database_value)=>{
                if(database_value){
                    request.dbval = database_value;     
                }
                else{
                    request.dbval = null;   
                }
            
            return request;
        });
    }
    
    // Checking for operation selected in the UI
    // 0 - Reload the UI page operation
    if(request.message.messagecode === "0"){
            return dbget().then((x)=>{
                request.message.dbval = x.dbval;
                request.message.messagetype = "resp";
                return request;
            });
            
    }
    // Checking for operation selected in the UI
    // 1 - Find Dog breed operation
    else if(request.message.messagecode === "1"){

        var ImageURL = request.message.imageurl;
        var geolocation = request.message.geolocation;

        // URL for the visual recognition api
        const url = ('https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key='+api_key+'&url='+ImageURL+'&version=2016-05-19');

        // xhr url fetch call
        return xhr.fetch(url).then((url_fetched_data) =>{
                var fetched_message_body = JSON.parse(url_fetched_data.body);
                
                // checking for the conditions  
                // 1 - given the wrong url
                // 2 - given image which exceed the size limit
                if (fetched_message_body.images[0].hasOwnProperty("classifiers")){
                    var classes = fetched_message_body.images[0].classifiers[0].classes;
                        
                        // checking for the condition to verify only the dog images and ignore other images
                        for (var k=0;k<classes.length;k++){
                            if (classes[k].class == "dog"){
                                proceed = true;
                            } 
                        }

                        // enters only for the dog images 
                        if (proceed === true){
                            // iterating through the results 
                            for (var i=0;i<classes.length;i++){
                            // checking for the exact result    
                            if (classes[i].hasOwnProperty("type_hierarchy")){
                                // checking for the highest score of the results we got
                                if (classes[i].score > queryDogScore){
                                    queryDogScore = classes[i].score;
                                    
                                    // condition to avoid the dog suffix in the return result 
                                    var queryDogBreedtemp = classes[i].class;
                                    var queryDogBreedsplit = queryDogBreedtemp.split(" ");
                                    if (queryDogBreedsplit.length>1){
                                        queryDogBreed = "";
                                    
                                        for (var j=0;j<queryDogBreedsplit.length-1;j++){
                                            queryDogBreed += queryDogBreedsplit[j]+" ";
                                        }
                                        console.log("Inside the forloop",i,queryDogScore,queryDogBreed);
                                    }
                                    else{
                                        queryDogBreed = queryDogBreedtemp;
                                    }
                                } // high score check ends here

                                else{
                                    // high score check else part
                                    console.log("else part",i,classes[i].score,classes[i].class);
                                }
                            } //exact result check ends here
                        } // for loop ends here

                        // forming the response message for the Find Dog Breed operation
                        request.message = {"messagecode":"1","messagetype":"resp","queryDogBreed":queryDogBreed,"geolocation":geolocation,"imageurl":ImageURL};
                        
                        // condition to store the dog data when the breed is known
                        if (queryDogBreed !== null)
                            {
                                    // fetching the previously stored data from database
                                    dbget().then((x)=>{
                                    var fetcheddbval = [];
                                    if (x.dbval!==null){
                                        for (var j=0;j<x.dbval.length;j++){                                    
                                        fetcheddbval = fetcheddbval.concat([x.dbval[j]]);
                                    }
                                    // adding the new images data to the fetched data
                                    message_dict = fetcheddbval.concat([{"url":ImageURL,"breed":queryDogBreed,"geolocation":geolocation}]);
                                    // pushing data to the database
                                    db.set(kvstoreKEY,message_dict);
                                
                                    }
                                    else{
                                        // when there is no data in the database
                                        var message_dict = [{"url":ImageURL,"breed":queryDogBreed,"geolocation":geolocation}];
                                        // pushing data to the database    
                                        db.set(kvstoreKEY,message_dict);
                                
                                    }
                                }); // db fetch call ends here

                            }    
                                
                        
                        } // only for dog images condition ends here.
                    else
                        {
                            // only for dog images else part 
                            console.log("UNKNOWN DOG BREED")
                            request.message = {"messagecode":"1","messagetype":"resp","queryDogBreed":queryDogBreed,"geolocation":geolocation,"imageurl":ImageURL};
                        }


                    return request;                                    
                    } // wrong url,size exceed condition ends here

                else
                {
                    // wrong url,size exceed condition else part                    
                    request.message = {"queryDogBreed":queryDogBreed,"error":fetched_message_body.images[0]};
                    return request;
            
                }   
        }).catch((err) => {
        // handle request failure
        console.log("THE API CALL ERROR --> ",err);
        request.message = {"queryDogBreed":queryDogBreed,"error":"error"};
        return request.ok();
        });

    }
    // Checking for operation selected in the UI
    // 2 - Clear the Database
    else if(request.message.messagecode === "2"){
        db.removeItem(kvstoreKEY);
        return request.ok();
    }

    return request.ok();
   

     
};

