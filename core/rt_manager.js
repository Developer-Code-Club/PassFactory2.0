/*
 * A RTManager represents the real time manger for 
 * exchanges via sockets on the server side.
 */
const RTMessage = require('./rt_message');
const SchoolFactory = require('./school_factory');


class RTManager {
	
	//this is the hashmap which is storing all the students locally
	static userMap=new Map();
	static theTransitHandler=null;
	static roomMap=new Map();
	static schoolFactory=null;
	
	constructor(port) {
		this.port=port;
		this.theTransitHandler=null;
	}	
	async initialize() {
		console.log("In RTManager.initialize");
		if ( RTManager.schoolFactory == null ) {
			var x = new Date();
			var y = x.getFullYear();
			var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
			var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
			var dtStr = y + "-" + m + "-" + d ;	
			console.log("x->" + x + " dtStr->" + dtStr);
			RTManager.schoolFactory = new SchoolFactory();
			console.log("new school factory constructed");
			await RTManager.schoolFactory.initialize(dtStr);
			console.log("school factory done");
		}
		//WEBSOCKETS START
		console.log("setting up websockets");
		var server = require('websocket').server, http = require('http');
		console.log("loaded websocket server");
		var socket = new server({  
			httpServer: http.createServer().listen(this.port)
		});
		console.log("web socket server created");
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
			
			
			/*
			* On Message Event Handler.
			*/
			connection.on('message',async function(message) {
				console.log("userCount->" + RTManager.userMap.size);
				// console.log(RTManager.userMap);
				var a = Array.from(RTManager.userMap);
				for ( var i=0; i < a.length; i++ ) {
					console.log("user->" + a[i][0]);
				}
				//console.log("got message->" + message.utf8Data );
				var msg = new RTMessage();
				try {
					msg.initialize(JSON.parse(message.utf8Data));
				} catch (e) {
					console.log("ERROR:" + e.message);
				}
				if ( msg.func != "heartBeat" ) {
					console.log("got message->" + message.utf8Data );
				}
				if ( msg.func == "signin" ) {
					connection.lastUsedTimeStamp=new Date();
					if ( msg.userName != null ) {							//only sign in if username is there.
						console.log("in signin->" + JSON.stringify(msg));
						var userAt = RTManager.userMap.get(msg.userName);	//find the user to see if signed in already.
						if ( userAt == null ) {	//user not signed in.
							/* create new connection */
							connection.myuser=msg.userName;
							RTManager.userMap.set(msg.userName,connection);
							connection.send(JSON.stringify( { func: 'signinsuccess' , message: 'hello ' + msg.userName + ", we will set you up for location " + msg.location }));
							console.log("LOOKING FOR->" + msg.location);
							var theRoom = RTManager.schoolFactory.theRoomHandler.theRooms.get(msg.location);
							console.log("ROOOOM->" + JSON.stringify(theRoom));
							if ( theRoom.dualRoomId != null ) {
								var drl = RTManager.roomMap.get(theRoom.dualRoomId);
								if (drl == null ) {
									RTManager.roomMap.set(theRoom.dualRoomId,[ msg.userName]);
								} else {
									drl.push(msg.userName);
									RTManager.roomMap.set(theRoom.dualRoomId,drl);
								}
							}
							//can see the teachers
							//rtmananger
							var roomList = RTManager.roomMap.get(msg.location);
							if ( roomList == null ) {
								RTManager.roomMap.set(msg.location,[ msg.userName ]);
							} else {
								roomList.push(msg.userName);
								RTManager.roomMap.set(msg.location,roomList);
							}
console.log("added user->" + " ->" + connection.myuser);
						} else {	//user was already signed in.
console.log("found user->" + msg.userName);
							connection.myuser=msg.userName;
							RTManager.removeUserFromMemory(connection.myuser);
							RTManager.userMap.set(msg.userName,connection);
							connection.send(JSON.stringify( { func: 'signinsuccess' , message: 'hello reloggin ' + msg.userName + ", we will set you up for location " + msg.location }));
							var theRooms = Array.from(RTManager.roomMap);
							console.log("ALL ROOMS->" + JSON.stringify(theRooms));
							for ( var i=0; i < theRooms.length; i++ ) {
								console.log("working on->" + JSON.stringify(theRooms[i]));
								for ( var ii=0; ii < theRooms[i].length; ii++ ) {
									if ( theRooms[i][1][ii] == msg.userName )  {
										if ( theRooms[i][0] == msg.location ) {
											console.log("ROOM IS SAME");
											break; //room is same.
										} else { //room differs
											console.log("popping from room->" + theRooms[i][0]);
											console.log("before->" + theRooms[i][1]);
											theRooms[i][1].splice(ii,1);
											RTManager.roomMap.set(theRooms[i][0],theRooms[i][1]);
											console.log("roomlist is now->" + JSON.stringify(theRooms[i]));
											// now push new room.
											var roomList = RTManager.roomMap.get(msg.location);
											if ( roomList == null ) {
												RTManager.roomMap.set(msg.location,[ msg.userName ]);
											} else {
												roomList.push(msg.userName);
												RTManager.roomMap.set(msg.location,roomList);
											}
											break;
										}
									}
								}
							}						
						} 
					} else {
						console.log("EMPTY USERNAME->" + JSON.stringify(msg));
					}
				} else if ( msg.func == "sendMessage" ) {
					connection.lastUsedTimeStamp=new Date();
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
					connection.lastUsedTimeStamp=new Date();
					try {

						//look at this
						console.log("in scannedId with->" + JSON.stringify(msg));
						var ret = await RTManager.theTransitHandler.processMessage(msg);

						var roomList = RTManager.roomMap.get(msg.location);
//						console.log("roomlist->" + JSON.stringify(roomList));
//						console.log("RIZE->" + RTManager.roomMap.size);
						if ( roomList != null && roomList.length > 0 ) {
							for ( var i=0; i < roomList.length; i++ ) {
								var toUser = RTManager.userMap.get(roomList[i]);
								console.log("sending->" + JSON.stringify(ret));
								toUser.send(JSON.stringify(ret));
							}
						} else {
							console.log("ERROR: 1something wrong with this msg->" + JSON.stringify(msg));
						}
					} catch (e) {
						console.log(e);
					}
				} else if ( msg.func == "forceOut" ) {
					connection.lastUsedTimeStamp=new Date();
					console.log("in forceOut with->" + JSON.stringify(msg));
					var ret = await RTManager.theTransitHandler.forceOut(msg);
					var roomList = RTManager.roomMap.get(msg.location);
					if ( roomList != null && roomList.length > 0 ) {
						for ( var i=0; i < roomList.length; i++ ) {
							var toUser = RTManager.userMap.get(roomList[i]);
							toUser.send(JSON.stringify(ret));
						}
					} else {
						console.log("ERROR: 2something wrong with this msg->" + JSON.stringify(msg));
					}
				} else if ( msg.func == "getStudentList" ) {
					connection.lastUsedTimeStamp=new Date();
					console.log("in getStudentList with->" + JSON.stringify(msg));
					var userAt = RTManager.userMap.get(msg.userName);
					var ret = Array.from(RTManager.schoolFactory.theStudentHandler.theStudents);
					if ( userAt != null ) {
						console.log("sending->" + JSON.stringify(ret));
						msg.func="studentList";
						msg.message=ret;
						userAt.send(JSON.stringify(msg));
					} else {
						console.log("ERROR: 3something wrong with this msg->" + JSON.stringify(msg));
					}
				} else if ( msg.func == "getFacultyList" ) {
					connection.lastUsedTimeStamp=new Date();
					console.log("in getFacultyList with->" + JSON.stringify(msg));
					var userAt = RTManager.userMap.get(msg.userName);
					var ret = Array.from(RTManager.schoolFactory.theFacultyHandler.theFaculty);
					if ( userAt != null ) {
						console.log("sending->" + JSON.stringify(ret));
						msg.func="facultyList";
						msg.message=ret;
						userAt.send(JSON.stringify(msg));
					} else {
						console.log("ERROR: 4something wrong with this msg->" + JSON.stringify(msg));
					}
				} else if ( msg.func == "updateNote" ) {
					console.log("updating notes->" + JSON.stringify(msg));
					var ret = await RTManager.theTransitHandler.updateNote(msg);
					var roomList = RTManager.roomMap.get(msg.location);
					if ( roomList != null && roomList.length > 0 ) {
						for ( var i=0; i < roomList.length; i++ ) {
							var toUser = RTManager.userMap.get(roomList[i]);
							toUser.send(JSON.stringify(ret));
						}
					} else {
						console.log("ERROR: 5something wrong with this msg->" + JSON.stringify(msg));
					}
				} else if ( msg.func == "flipRoom" ) {
					console.log("flipping room ->" + JSON.stringify(msg));
					var ret = await RTManager.theTransitHandler.flipRoom(msg);
					var roomList = RTManager.roomMap.get(msg.location);
					if ( roomList != null && roomList.length > 0 ) {
						for ( var i=0; i < roomList.length; i++ ) {
							var toUser = RTManager.userMap.get(roomList[i]);
							toUser.send(JSON.stringify(ret));
						}
					} else {
						console.log("ERROR: 5something wrong with this msg->" + JSON.stringify(msg));
					}
				} else if ( msg.func == "heartBeat" ) {
					connection.send(JSON.stringify({ func:'heartBeat', type:'pong'}));
					//console.log("heartbeat->" + JSON.stringify(msg));
				} else if ( msg.func == "close" ) {
					connection.close();
					console.log("closing->" + JSON.stringify(msg));	
				} else { 
					connection.send("Sorry, I don't understand what you are asking for.");
				}	
			});
			/*
			* On Close Event Handler
			*/
			connection.on('close', async function(x) {
				RTManager.removeUserFromMemory(connection.myuser);
				console.log('connection closed->' + JSON.stringify(x) + " ->" + connection.myuser + " ->" + connection.foo);
			});
		});	
		RTManager.startConnectionCleanupProcess();
		console.log("Leaving INitialize RTManger.");
	}
	static startConnectionCleanupProcess() {
		var x = setInterval(function() { RTManager.checkConnections(); },50000);
	}
	static checkConnections() {
		var now=new Date();
		for (let [key, value] of RTManager.userMap) {
			var diff = (now - value.lastUsedTimeStamp)/1000;
			console.log("checkConnection->" + now + " ->" + value.lastUsedTimeStamp + " ->" + diff);
		}
	}
	setTransitHandler(t) { 
		if (RTManager.theTransitHandler == null ) {
			RTManager.theTransitHandler = t;
		}
	}
	static removeUserFromMemory(userName) {
		RTManager.userMap.delete(userName);
		var theRooms = Array.from(RTManager.roomMap);
		//given dual rooms, this looks through all rooms.
		for ( var i=0; i < theRooms.length; i++ ) {
			for ( var ii=0; ii < theRooms[i][1].length; ii++ ) {
				if ( theRooms[i][1][ii] == userName )  {
					console.log("deleting->" + JSON.stringify(theRooms[i]));
					theRooms[i][1].splice(ii,1);
					console.log("roomlistnow->" + JSON.stringify(theRooms[i][1]));
					RTManager.roomMap.set(theRooms[i][0],theRooms[i][1]);
				}
			}
		}
	}
}
module.exports = RTManager;