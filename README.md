# dogtracker
Image Classification for dog breeds using Watson Visual Recognition Service

# Watson Visual Recognition api

Step 1 : Login to the Bluemix account with the valid credentials, and goto Catalog.<br>
Step 2 : Select the Visual Recognition service under the Watson Services.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/Visualrecognition/vr1.png)
Step 3 : Give the service name and scroll down the page,select the Free plan, you can see more about pricing there in that page, and click on the "create" button.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/Visualrecognition/vr2.png)
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/Visualrecognition/vr3.png)
Step 4 : Once you create the service it will redirect you the homepage of the service. There click on the "Service Credentials" to get the apikey to access the visual recognition api.
![alt-tag](https://github.com/shyampurk/dogtracker/blob/master/screenshots/Visualrecognition/vr4.png)

Step 5 : Goto the [program](https://github.com/shyampurk/dogtracker/blob/master/Block/main.js) and enter the apikey that you got from "step4" in the following lines<br>
	apikey - line number 14 <br>


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

Once the object storage api is created we have to follow few steps 
1) Authenticating with Keystone,<br> 
	[Link](https://console.ng.bluemix.net/docs/services/ObjectStorage/os_authenticate.html)
	


	2) Constructing Your URL <br>
	3) Configuring the Swift CLI <br>

	
