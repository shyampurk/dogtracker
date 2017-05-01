# Dog Tracker
Image Classification for identifying dog breeds using Watson Visual Recognition Service and PubNub BLOCKS

# Watson Visual Recognition api

Step 1 : Login to the Bluemix account with the valid credentials, and goto Catalog.<br>
Step 2 : Select the Visual Recognition service under the Watson Services.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/Visualrecognition/vr1.png)
Step 3 : Give the service name and scroll down the page,select the Free plan (you can see more about pricing options in that page) and click on the "create" button.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/Visualrecognition/vr2.png)
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/Visualrecognition/vr3.png)
Step 4 : Once you create the service, it will redirect you to the homepage of the service. There, click on the "Service Credentials" to get the apikey to access the visual recognition api. Make a note of this API key.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/Visualrecognition/vr4.png)

Step 5 : Goto the [program](https://github.com/shyampurk/dogtracker/blob/master/Block/main.js) and enter the apikey that you got from "step4" in the following lines<br>
	apikey - line number 16 <br>


# Object Storage api

Step 1 : Login to the Bluemix account with the valid credentials, and goto Catalog.<br>
Step 2 : Select the Object Storage service under the Storage Services.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/objectstorage/ob1.png)
Step 3 : Give the service name and scroll down the page,select the Free plan, you can see more about pricing there in that page, and click on the "create" button.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/objectstorage/ob2.png)
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/objectstorage/ob3.png)
Step 4 : Once you create the service it will redirect you the homepage of the service. There click on the "Service Credentials", Store all the values there in the credentials.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/objectstorage/ob4.png)
Step 5 : To create a container goto "Manage" from the menu and click on the "Select Action" drop down menu and select the "Create Container".
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/objectstorage/ob5.png)
Step 6 : Give a name for the container.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/objectstorage/ob6.png)
The container to store the images is created.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/objectstorage/ob7.png)



[here](https://console.ng.bluemix.net/docs/services/ObjectStorage/os_authenticate.html) is the docs link to explore the object storage api

# Working with object storage api

Once the object storage api is created we have to follow few steps to upload and access the images in the object storage.

## Step 1 : Authenticating with Keystone,
To interact with the service, you must authenticate your Object Storage instance with Keystone to obtain your URL
Follow this  [Link](https://console.ng.bluemix.net/docs/services/ObjectStorage/os_authenticate.html) to do the process.
You have to give your credentials to get authentication process done, this process will give you.

	a) the "X-Subject-Token", it is the authentication token.
	b) URL for the object storage service.

Please save these details.
	
### Note : 
	The "X-Subject-Token" we got it in this step is the authentication required to upload the images in the object storage.
	To create the "X-Subject-Token" we have to do this step when we required.
	
	
## Step 2 : Constructing Your URL 

You got the URL for the object storage service in the above step, to access your image your URL should particularly point the container and the image.
Follow this [Link](https://console.ng.bluemix.net/docs/services/ObjectStorage/os_constructing.html) to do the process.
You will get the full URL to acces the image stored in the object storage.


## Step 3 : Configuring the Swift CLI 
To make the images accessible publicly we need to make the container public.
Follow this [Link](https://console.ng.bluemix.net/docs/services/ObjectStorage/os_configuring.html) to install swift client
After successfully done the above procedure Run the following command to make the container public
### Command :	
		swift post -r '.r:*,.rlistings' "containername".
		
### Example :
		swift post -r '.r:*,.rlistings' DogImages 
		

Now You got your Authentication Token, and URL to access the image, and we made the container publicly accessible.Now you can upload the images to the container and check those uploaded images by using the images URL.
