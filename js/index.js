/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var pubnub; 
var app = {
    // Application Constructor
    initialize: function() {
		
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
			document.addEventListener('deviceready', this.onDeviceReady, false);
		} else {
			 $(document).ready(this.onDeviceReady);  
		}
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
//		pubnub = PubNub.init({
//             subscribe_key: 'sub-c-d334a178-524f-11e5-85f6-0619f8945a4f',
//			 publish_key: 'pub-c-5d8d07ec-2eae-44fb-a1e4-3dad885924d8',
//			 ssl: true
//        });
        app.receivedEvent('deviceready');
		var pushNotification = window.plugins.pushNotification;

		pushNotification.register(
			successHandler, 
			errorHandler, 
			{
				'senderID':'514092552715',
				'ecb':'onNotificationGCM' // callback function
			}
		);
		function successHandler(result) {
			console.log('Success: '+ result);
		};
		
		function errorHandler(error) {
			console.log('Error: '+ error);
		};
		function onNotificationGCM(e) {
			switch(e.event){
				case 'registered':
					if (e.regid.length > 0){
						deviceRegistered(e.regid);
					}
				break;

				case 'message':
					if (e.foreground){
						// When the app is running foreground. 
						alert('The room temperature is set too high')
					}
				break;

				case 'error':
					console.log('Error: ' + e.msg);
				break;

				default:
				  console.log('An unknown event was received');
				  break;
			}
		};
		// Publish the channel name and regid to PubNub
		function deviceRegistered(regid) {
			channel = regid.substr(regid.length - 8).toLowerCase();
		 
			var c = document.querySelector('.channel');
			c.innerHTML = 'Your Device ID: <strong>' + channel + '</strong>';
			c.classList.remove('blink'); 
		 
			pubnub.publish({
				channel: channel,
				message: {
					regid: regid
				}
			});
		 
			pubnub.subscribe({
				channel: channel,
				callback: function(m) {
					console.log(m);
					t.classList.remove('gears');
					if(m.setting) {
						t.textContent = m.setting + '°';
					}
				}
			});  
		}
			
	},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();