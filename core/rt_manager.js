/*
 * A RTManager represents the real time manger for 
 * exchanges via sockets on the server side.
 */
const RTMessage = require('./rt_message');


class RTManager {
	
	static userCounter=1;
	static userMap=new Map();
	static theTransitHandler=null;
	static roomMap=new Map();
	
	constructor(port) {
		this.port=port;
		this.theTransitHandler=null;
	}	
	async initialize() {
		//WEBSOCKETS START
		var server = require('websocket').server, http = require('http');
		var socket = new server({  
			httpServer: http.createServer().listen(this.port)
		});
		socket.on('request',async function(request) {
			var connection = request.accept(null, request.origin);
			console.log("made connection->" + connection.constructor.name);
			console.log("connection.closeDescription->" + connection.closeDescription);
			console.log("connection.closeReasonCode->" + connection.closeReasonCode);
			console.log("connection.protocol->" + connection.protocol);
			console.log("connection.extensions->" + connection.extensions);
			console.log("connection.remoteAddress->" + connection.remoteAddress);
			console.log("connection.webSocketVersion->" + connection.webSocketVersion);
			console.log("connection.connected->" + connection.connected);
			connection.userCounter=RTManager.userCounter;
			RTManager.userCounter++;
			
			/*
			* On Message Event Handler.
			*/
			connection.on('message',async function(message) {
				console.log("userCount->" + connection.userCounter);
				console.log("got message->" + message.utf8Data );
				var msg = new RTMessage();
				try {
					msg.initialize(JSON.parse(message.utf8Data));
				} catch (e) {
					console.log("ERROR:" + e.message);
				}
				
				if ( msg.func == "signin") {
					var userAt = RTManager.userMap.get(msg.userName);
					if ( userAt != null ) {
						RTManager.userMap.delete(msg.userName);
						console.log("reregistering " + msg.userName);
						var theRooms = Array.from(RTManager.roomMap);
						for ( var i=0; i < theRooms.length; i++ ) {
							for ( var ii=0; ii < theRooms[i].length; ii++ ) {
								if ( theRooms[i][1][ii] == msg.userName )  {
									console.log("popping from room->" + theRooms[i][0]);
									console.log("before->" + theRooms[i][1]);
									theRooms[i][1].splice(ii,1);
									RTManager.roomMap.set(theRooms[i][0],theRooms[i][1]);
								}
							}
						}
					}
					connection.myuser=msg.userName;
					RTManager.userMap.set(msg.userName,connection);
					console.log("siginging in->" + JSON.stringify(msg));
					connection.send(JSON.stringify( { func: 'signinsuccess' , message: 'hello ' + msg.userName + ", we will set you up for location " + msg.location }));

					console.log("sent");
					console.log("size is->" + RTManager.userMap.size);
					var roomList = RTManager.roomMap.get(msg.location);
					if ( roomList == null ) {
						RTManager.roomMap.set(msg.location,[ msg.userName ]);
					} else {
						roomList.push(msg.userName);
						RTManager.roomMap.set(msg.location,roomList);
					}
				} else if ( msg.func == "sendMessage" ) {
					console.log("insendmessage ->" + msg.toUserName);
					var toUser = RTManager.userMap.get(msg.toUserName);
					console.log("sizeuu->" + RTManager.userMap.size);
					console.log("got user");
					if ( toUser == null ) {
						console.log("it is null");
						connection.send("can't find->" + msg.toUserName ) ;
					} else {
						console.log("sending...");
						toUser.send(JSON.stringify(msg));
						connection.send( JSON.stringify({func:"successSendMessage", message: "message was sent to->" + msg.toUserName}));
					}
				} else if ( msg.func == "scannedId" ) {
					console.log("in scannedId with->" + JSON.stringify(msg));
					var ret = await RTManager.theTransitHandler.processMessage(msg);
					var roomList = RTManager.roomMap.get(msg.location);
					console.log("roomlist->" + JSON.stringify(roomList));
					if ( roomList != null && roomList.length > 0 ) {
						for ( var i=0; i < roomList.length; i++ ) {
							var toUser = RTManager.userMap.get(roomList[i]);
							console.log("sending->" + JSON.stringify(ret));
							toUser.send(JSON.stringify(ret));
						}
					} else {
						console.log("ERROR: something wrong with this msg->" + JSON.stringify(msg));
					}
				} else { 
					connection.send("Sorry, I don't understand what you are asking for.");
				}	
			});
			/*
			* On Close Event Handler
			*/
			connection.on('close', async function(connection) {
				console.log('connection closed->' + JSON.stringify(connection));
			});
		});	
	}
	setTransitHandler(t) { 
		if (RTManager.theTransitHandler == null ) {
			RTManager.theTransitHandler = t;
		}
	}
}
module.exports = RTManager;