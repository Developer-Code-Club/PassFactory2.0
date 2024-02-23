/*
 * A RTManager represents the real time manger for 
 * exchanges via sockets on the server side.
 */
const RTMessage = require('./rt_message');
const SchoolFactory = require('./school_factory');
const DataLoader = require('./data_loader');

class RTManager {
	
	//this is the hashmap which is storing all the students locally
	static userCounter=0;
	static userMap=new Map();
	static tempUsers=[];
	static theTransitHandler=null;
	static roomMap=new Map();
	static schoolFactory=null;
	static dashboardUsers= [];
	
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
			RTManager.userCounter++;
			
			/*
			* On Message Event Handler.
			*/
			connection.on('message',async function(message) {
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
						
							//can see the teachers
							//rtmananger
							var roomList = RTManager.roomMap.get(msg.location);
							if ( roomList == null ) {
								RTManager.roomMap.set(msg.location,[ msg.userName ]);
							} else {
								roomList.push(msg.userName);
								RTManager.roomMap.set(msg.location,roomList);
							}
							//mcole: refreshing the users dashboard.
							await RTManager.refreshUsersDashboard();
							
						} else {	//user was already signed in.
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
						//mcole: refreshing the users dashboard.
						await RTManager.refreshUsersDashboard();						
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

						console.log("in scannedId with->" + JSON.stringify(msg));
						var ret = await RTManager.theTransitHandler.processMessage(msg);

						var roomList = RTManager.roomMap.get(msg.location);
						
						if ( roomList != null && roomList.length > 0 ) {
							for ( var i=0; i < roomList.length; i++ ) {
								var toUser = RTManager.userMap.get(roomList[i]);
								console.log("sending->" + JSON.stringify(ret));
								toUser.send(JSON.stringify(ret));
							}
						} else {
							console.log("ERROR: something wrong with this msg->" + JSON.stringify(msg));
						}
						//mcole: refreshing the users dashboard.
						await RTManager.refreshUsersDashboard();
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
						console.log("ERROR: something wrong with this msg->" + JSON.stringify(msg));
					}
					//mcole: refreshing the users dashboard.
					await RTManager.refreshUsersDashboard();
				} else if ( msg.func == "getStudentList" ) {
					//mcole: no setup func. 
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
						console.log("ERROR: something wrong with this msg->" + JSON.stringify(msg));
					}
				} else if ( msg.func == "getFacultyList" ) {
					connection.lastUsedTimeStamp=new Date();
					console.log("in getFacultyList with->" + JSON.stringify(msg));
					var userAt = RTManager.userMap.get(msg.userName);
					var ret = Array.from(RTManager.schoolFactory.theFacultyHandler.theFaculty);
					if ( userAt != null ) {
						msg.func="facultyList";
						msg.message=ret;
						userAt.send(JSON.stringify(msg));
					} else {
						console.log("ERROR: something wrong with this msg->" + JSON.stringify(msg));
					}
				} else if ( msg.func == "updateNote" ) {
					var ret = await RTManager.theTransitHandler.updateNote(msg);
					var roomList = RTManager.roomMap.get(msg.location);
					if ( roomList != null && roomList.length > 0 ) {
						for ( var i=0; i < roomList.length; i++ ) {
							var toUser = RTManager.userMap.get(roomList[i]);
							toUser.send(JSON.stringify(ret));
						}
					} else {
						console.log("ERROR: something wrong with this msg->" + JSON.stringify(msg));
					}
				} else if ( msg.func == "getDashboard" ) {
					var userAt = RTManager.userMap.get(msg.userName);
					
					RTManager.dashboardUsers.push(userAt);
					userAt.send(JSON.stringify(await RTManager.getDashboardData()));
				} else if ( msg.func == "heartBeat" ) { 
					connection.send(JSON.stringify({ func:'heartBeat', type:'pong'}));
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
				await RTManager.refreshUsersDashboard();
			});
		});	
		RTManager.tempUsers=DataLoader.getTempUserData();
		RTManager.startConnectionCleanupProcess();
	}
	/*
	 * get the dashboard data.  The first call gets from db and stringifies once.
	 * then loop and send to all users.
	 */

	//sending the data to all the dashboard people
	static async refreshUsersDashboard() {
		if ( RTManager.dashboardUsers.length > 0 ) {
			var db = JSON.stringify(await RTManager.getDashboardData());
			for(let userAt of RTManager.dashboardUsers) {
				userAt.send(db);
			}
		}
	}
	//retruning the data structure for the 
	static async getDashboardData() { 
		var r = await Array.from(RTManager.schoolFactory.theRoomHandler.theRooms.values()).filter(room => room.type === 'LAV-STD' || room.type === 'LAV-DUAL');
		var rooms = JSON.parse(JSON.stringify(r));
		var retRoomMap=new Map();
		for ( var i=0; i < rooms.length; i++ ) {
			rooms[i].maleCount=0;
			rooms[i].femaleCount=0;
			rooms[i].totalCount=0;
			rooms[i].users=[];
			retRoomMap.set(rooms[i].num, rooms[i]);
		}

		var roomSum = await DataLoader.getOpenTransitsForStudents();
		for ( var i=0; i < roomSum.length; i++ ) {
			var s = RTManager.schoolFactory.theStudentHandler.theStudents.get(roomSum[i].studentId);
			var rttl = retRoomMap.get(roomSum[i].room);
			if ( rttl != null ) {
				if ( s.gender == "M" ) {
					rttl.maleCount++;

				} else {
					rttl.femaleCount++;

				}
				rttl.totalCount++;

				retRoomMap.set(roomSum[i].room, rttl);
			} else {
				console.log("ERRRRRRRRPOR room not found->" + roomSum[i].room);
			}
		}
		
		var users = await Array.from(RTManager.roomMap);
		for ( var i=0; i < users.length; i++ ) {
			var ret=retRoomMap.get(users[i][0]);
			if ( ret != null ) {
				ret.users=users[i][1];
			} else {
				console.log("ERRROR room not found for users->" + users[i][0]);
			}
		}
		var response = {
			func: 'dashboard',
			roomSummary: await Array.from(retRoomMap.values())
		};
		return response;
	}
	static startConnectionCleanupProcess() {
		var x = setInterval(function() { RTManager.checkConnections(); },5000);
	}
	static checkConnections() {
		var now=new Date();
		for (let [key, value] of RTManager.userMap) {
			var diff = (now - value.lastUsedTimeStamp)/1000;
			//console.log("checkConnection->" + now + " ->" + value.lastUsedTimeStamp + " ->" + diff);
		}
	}
	setTransitHandler(t) { 
		if (RTManager.theTransitHandler == null ) {
			RTManager.theTransitHandler = t;
		}
	}
	static removeUserFromMemory(userName) {
		RTManager.userMap.delete(userName);
		RTManager.userCount--;
		var theRooms = Array.from(RTManager.roomMap);
		for ( var i=0; i < theRooms.length; i++ ) {
			for ( var ii=0; ii < theRooms[i].length; ii++ ) {
				/* assumes user only in 1 room. */
				if ( theRooms[i][1][ii] == userName )  {
					console.log("deleting->" + JSON.stringify(theRooms[i]));
					theRooms[i][1].splice(ii,1);
					console.log("roomlistnow->" + JSON.stringify(theRooms[i][1]));
					RTManager.roomMap.set(theRooms[i][0],theRooms[i][1]);
					break;
				}
			}
		}
		for(var i=0; i < RTManager.dashboardUsers.length; i++ ) {
			if ( userName == RTManager.dashboardUsers[i].myuser ) {
				var n = RTManager.dashboardUsers.splice(i,1);
				RTManager.dashboardUsers = n;
				break;
			}
		}
	}
}
module.exports = RTManager;