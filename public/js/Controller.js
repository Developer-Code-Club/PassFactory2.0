/*
 * The Controller class is main controller of clientside.
 */
 
class Controller {
	static creds = null;
	static socket = null;
	static studentsList = null;
	static roomList = null;
	static heartbeats=0;
	static heartbeatFunc=null;
	static printConsole=false;
	static dualRoom=null;
	static startWithRoom=null; //for dual room preferences in room to start with 0 or 1.
	static playSound=null; //does user want to hear capacity sounds;
	static capacityHandler=null;  // one of values from modal. ignore, warn or block.
	
	constructor() {
		
	}
	static isProcessing=false;
	
	static isDualRoom() {
		if ( Controller.dualRoom == null ) {
			return false;
		}
		return true;
	}
	async initializeData() {
		var dateFor = document.getElementById("for-date").value;
		if ( dateFor.length > 0 ) {
			alert("processing for Date->" + dateFor);
		} else {
			alert("Invalid Date->" + dateFor + " Stopping initialize");
			return;
		}
	
		if ( Controller.isProcessing ) { 
			alert("already processing.  Please wait...");
			return;
		}
		Controller.isProcessing = true;
		console.log("in initializeData");
		var x = new DataLoader();
		var vb = new ViewBuilder();
		vb.setProcessingLoadOn();
		var ret = await x.initializeData(dateFor);
		
		
		vb.buildDataIntegrityTable(ret);
		vb.buildDataIntegrityCounts(ret);
		vb.setProcessingLoadOff();
		Controller.isProcessing = false;
		var ss = await x.getStudentData();
		vb.buildStudentDataView(ss);
		var xx = await x.getStudentBlockNames();
		vb.buildBlockTypeCountTab(xx);
		var pp = await x.getPasses();
		vb.buildPassesTab(pp);
		var dp = await x.getDecoratedPasses();
		vb.buildDecoratePassesTab(dp);
		
		window.onbeforeunload = Controller.closeIt;

	}
	static async closeIt(e) {
		e.preventDefault();
		if ( Controller.socket != null ) {
			await Controller.sendClose();
		}
		return null;
	}
	async initializeRTData() {
		
		if ( Controller.isProcessing ) { 
			alert("already processing.  Please wait...");
			return;
		}
		Controller.isProcessing = true;
		console.log("in initializertData");
		var x = new DataLoader();
		var vb = new ViewBuilder();
	
		Controller.isProcessing = false;

		var f = await x.getRTFacultyList();
		Controller.facultyList = new Map(f);
		ViewBuilder.buildFacultyList(f);
		
		var r = await x.getRTRoomsList();
		Controller.roomList = new Map();
		for ( var i=0; i< r.length; i++ ) {
			Controller.roomList.set(r[i].id, r[i]);
		}
		console.log("r->" + JSON.stringify(r));
		ViewBuilder.buildRoomsList(r);
		
		var s = await x.getRTStudentsList();
		Controller.studentsList = new Map(s);
		ViewBuilder.buildStudentsList(s);
		
		var tu = await x.getRTTempUserList();
		for ( var i=0; i < tu.length; i++ ) {
			Controller.facultyList.set(tu[i].id, tu[i]);
		}

		ViewBuilder.buildTempUserList(tu);

		Controller.isProcessing = false;


	}
	async emailPasses() {
		var dateFor = document.getElementById("for-date").value;
	
		if ( Controller.isProcessing ) { 
			alert("controller is processing.  Please wait...");
			return;
		}
		Controller.isProcessing = true;
		console.log("emailing!");
		var x = new DataLoader();
		var ret = await x.emailPasses();
		console.log("ret->" + JSON.stringify(ret));
	}
	async emailTestPasses() {
		var dateFor = document.getElementById("for-date").value;
	
		if ( Controller.isProcessing ) { 
			alert("controller is processing.  Please wait...");
			return;
		}
		Controller.isProcessing = true;
		console.log("emailing!");
		var x = new DataLoader();
		var ret = await x.emailTestPasses();
		console.log("ret->" + JSON.stringify(ret));
	}

	static async sendCheckInFunc(e) {
		alert("sendcheckinfunc");
		var i = ViewBuilder.getStudentId();
		if ( i == null ) {
			alert("Unknown Student");
			return;
		}
		var transitId = ViewBuilder.getTransitId(i);
		
console.log("Transit got->" + transitId);
		Controller.creds.id = transitId;
		
		/* Here we check to see if it is a dual room.  And, we need to check to see if the person
		 * is already checked in and this is actually a checkout. If it is, then any capacity 
		 * functions are not applicable.
		 */
		var isInRoom = ViewBuilder.checkIfStudentInRoom(i);
		if ( isInRoom ) {
			Controller.creds.location = isInRoom;
		} else if ( Controller.isDualRoom() ) {
			Controller.creds.location = Controller.dualRoom.getNextRoom(document.getElementById("boys-at").getAttribute("lav-count"),document.getElementById("girls-at").getAttribute("lav-count"),true);
		}
		Controller.creds.note = "";
		Controller.creds.studentId = i;
		Controller.creds.func='scannedId';
		//null transit means they are not checked in yet.
		//for non dual room, see if checkIfStudentInRoom works...
		
		if ( transitId == null ) {
			var overCapacity= await ViewBuilder.checkCapacityForPreferences();
			
			if ( overCapacity && Controller.playSound ) {
				var snd = new Audio("./audio/horn.wav");
				snd.play();
			}
			if ( overCapacity && Controller.capacityHandler == "ignore" ) {
				Controller.socket.send(JSON.stringify(Controller.creds));
				ViewBuilder.clearStudentId();
				return;
			} else if ( overCapacity && Controller.capacityHandler == "warn" ) {	
				$('#capacityConfirm').modal('show');			
				return;
			} else if ( overCapacity && Controller.capacityHandler == "block" ) {
				alert("Room is at capacity, please wait...");
				ViewBuilder.clearStudentId();
				return;
			} else {
				Controller.socket.send(JSON.stringify(Controller.creds));
				ViewBuilder.clearStudentId();
			}	
		} else {
			Controller.socket.send(JSON.stringify(Controller.creds));
			ViewBuilder.clearStudentId();
		}
	}
	static async capacityCancel(e) {
		$('#capacityConfirm').modal('hide');
		ViewBuilder.clearStudentId();
		return;
	}
	static async capacityContinue(e) {
		$('#capacityConfirm').modal('hide');
		Controller.socket.send(JSON.stringify(Controller.creds));
		ViewBuilder.clearStudentId();
		return;
	}
	static async flipCapacityCancel(e) {
		$('#flipCapacityConfirm').modal('hide');
		return;
	}
	static async flipCapacityConfirm(e) {
		$('#flipCapacityConfirm').modal('hide');
		var toRoom = document.getElementById("flipCapacityConfirm").getAttribute("toRoom");
		var transitId = document.getElementById("flipCapacityConfirm").getAttribute("transitId");
		await Controller.sendFlipRoom(transitId,toRoom);
		var sEl = document.getElementById("studentrow-" + transitId);
		var s = JSON.parse(sEl.getAttribute("student"));
		s.roomName = toRoom;
		sEl.setAttribute("student",JSON.stringify(s));
		document.getElementById("roomcollabel-" + transitId).innerHTML=toRoom;
		ViewBuilder.setRoomCapacity();	
		return;
	}
	static sendForceOutFunc(e) {
		var studentId=document.getElementById(e.srcElement.id).getAttribute("studentId");
		var id=document.getElementById(e.srcElement.id).getAttribute("transitId");
		var note = ViewBuilder.getNoteForTransit(id);

		var message = {};
		Controller.creds.note = note;
		Controller.creds.studentId = studentId;
		Controller.creds.id=id;
		Controller.creds.func='forceOut';
		Controller.socket.send(JSON.stringify(Controller.creds));
	}
	static sendGetStudentList() {
		Controller.creds.func='getStudentList';
		Controller.socket.send(JSON.stringify(Controller.creds));
	}
	static sendGetFacultyList() {
		Controller.creds.func='getFacultyList';
		Controller.socket.send(JSON.stringify(Controller.creds));
	}
	static sendGetDashboard() {
		Controller.creds.func='getDashboard';
		Controller.socket.send(JSON.stringify(Controller.creds));
	}
	/*
	 * This function will verify the FacultyId and the Location of 
	 * the person logging in. They can create a temporary faculty ID but
	 * they must select a valid location.
	 */
	static async loginAttempt(e) {
		console.log("in loginAttempt");
		var i = ViewBuilder.getUserId();
		var l = ViewBuilder.getLocation();
		var r=Controller.roomList.get(l);
		var isFaculty = ViewBuilder.isUserFaculty();
		var isTemp = ViewBuilder.isUserTemp();
		/* check location first. */
		if ( l == null ) {
			alert("You must select a valid location.");
			return;
		}
		if ( isFaculty == false &&  (document.getElementById("ci_faculty_id").value.length == 0) ) {
			alert("You must enter a login name." ) ;
			return;
		}
		var el = document.getElementById(e.srcElement.id);
		if ( i == null ) {
			var n=document.getElementById("ci_faculty_id").value;
			document.getElementById("unknown-name").innerHTML = n;
			$('#loginUnknownUser').modal('show');
			return;
		} else if ( i < 0 )  {
			console.log("temp juser->" + i);
			Controller.finalizeTempLogin(i,l);
		} else if  ( i > 0 ) {
			console.log("faculty->" + i);
			Controller.finalizeFacultyLogin(i,l);
			
		} else {
			alert("junknown");
		}
	}
	
	/* 
	 * Finalize Login comes after we confirm username and location are what we want to go with for login.
	 */
	static finalizeFacultyLogin(user,loc) {
		console.log("b4 setWS");
		Controller.setWSLogin(user,loc);
		console.log("after setWS");
		ViewBuilder.openScanning();
		Controller.buildScreenPostLogin(loc);
	}
	static finalizeTempLogin(user,loc) {
		Controller.setWSLogin(user,loc);
		ViewBuilder.openScanning();
		Controller.buildScreenPostLogin(loc);
	}
	static setWSLogin(user, loc) {
		console.log("In setWSLogin -> " + Controller.socket);
		var server="ws://localhost:1337";
		if ( Controller.socket != null ) {
			Controller.sendClose();
			alert("Closed existing Connection");
		}
		Controller.socket = new WebSocket(server);
		Controller.socket.onopen = function () {
			Controller.creds={func:'signin',userName:user, tempUser:user,location:loc};
			Controller.creds.user = user;
			Controller.creds.location = loc;
			Controller.socket.send(JSON.stringify(Controller.creds));
		};
		Controller.socket.onmessage = Controller.receiveMessage;
		Controller.socket.onerror = function (error) {
			alert('WebSocket error: ' + error);
			return;
		};
		var heartbeat_msg="heartBeat";
			Controller.heartbeatFunc = setInterval(function() {
            try {
                Controller.heartbeats++;
				Controller.consoleHeart("MMMMISED->" + Controller.heartbeats );
                if (Controller.heartbeats >= 3)
                    throw new Error("Too many missed heartbeats.");
                Controller.socket.send(JSON.stringify({ func:heartbeat_msg}));
            } catch(e) {
                clearInterval(Controller.heartbeatFunc);
                Controller.heartbeatFunc = null;
				Controller.heartbeats = 0;
                console.warn("Closing connection. Reason: " + e.message);
				if ( Controller.socket != null ) {
					Controller.socket.close();
				}
				ViewBuilder.signOutCleanUp();
				alert("Lost server connection.  Please login again.  If issues continue contact support.");
            }
        }, 5000);
   
	}
	static consoleHeart(msq) {
		if ( Controller.printConsole ) {
			console.log(msg);
		}
	}
	static flipClicked=false;
	static async sendFlipRoomFunc(e) {
		if ( Controller.flipClicked == true ) { alert("double"); return; }
		Controller.flipClicked=true;
		var transitId = document.getElementById(e.srcElement.id).getAttribute("transitId");
		document.getElementById("roomcol-" + transitId).style.color="lightGrey";
		var inOrOut=document.getElementById(e.srcElement.id).parentNode.parentNode.parentNode.id
		var studentId = document.getElementById(e.srcElement.id).getAttribute("studentId");
		var rowEl = document.getElementById("studentrow-" + transitId);
		var s = JSON.parse(rowEl.getAttribute("student"));
		var fromRoom = s.roomName;
		var toRoom;
		var toRoomEl;
		
		if ( Controller.dualRoom.room1 == fromRoom ) {
			toRoom = Controller.dualRoom.room2;
			toRoomEl = document.getElementById("girls-at");
		} else {
			toRoom = Controller.dualRoom.room1;
			toRoomEl = document.getElementById("boys-at");
		}
		if ( inOrOut == "ci-out-rows" ) {
			await Controller.sendFlipRoom(transitId,toRoom);
			document.getElementById("roomcollabel-" + transitId).innerHTML=toRoom;
			//just flip it.
		} else {
			//make sure we can flip into a room with capacity.	
			var boysAtEl = document.getElementById("boys-at");
			var girlsAtEl = document.getElementById("girls-at");
			var capacity1 = boysAtEl.getAttribute("capacity");
			var count1= boysAtEl.getAttribute("lav-count");
			var capacity2 = girlsAtEl.getAttribute("capacity");
			var count2= girlsAtEl.getAttribute("lav-count");
			var toCapacity = toRoomEl.getAttribute("capacity");
			var toCount= toRoomEl.getAttribute("lav-count");
		
			if ( toCount < toCapacity ) {
				//go ahead and make switch.
				await Controller.sendFlipRoom(transitId,toRoom);
				var sEl = document.getElementById("studentrow-" + transitId);
				var s = JSON.parse(sEl.getAttribute("student"));
				s.roomName = toRoom;
				sEl.setAttribute("student",JSON.stringify(s));
				document.getElementById("roomcollabel-" + transitId).innerHTML=toRoom;
				ViewBuilder.setRoomCapacity();
				//update room counts
			} else {
				if ( Controller.capacityHandler == "ignore" ) {
					//go ahead and make switch
					await flipCapacityConfirm(null);
					await Controller.sendFlipRoom(transitId,toRoom);
					var sEl = document.getElementById("studentrow-" + transitId);
					var s = JSON.parse(sEl.getAttribute("student"));
					s.roomName = toRoom;
					sEl.setAttribute("student",JSON.stringify(s));
					document.getElementById("roomcollabel-" + transitId).innerHTML=toRoom;
					ViewBuilder.setRoomCapacity();	
				} else if ( Controller.capacityHandler == "warn" ) {
					var x = document.getElementById("flipCapacityConfirm");
					x.setAttribute("transitId",transitId);
					x.setAttribute("toRoom",toRoom);
					$('#flipCapacityConfirm').modal('show');
				} else {  //block switch.
					//block switch.
					alert("sorry, destination room is at capacity and your preferences don't allow switch when room is at capacity.  If needed, switch after checkout and leave a note.");
				}
			}
		}
		Controller.flipClicked=false;
		document.getElementById("roomcol-" + transitId).style.color="black";

	}
	static receiveMessage(message) {

		
		var content = document.getElementById("ci-logs");


		var msg=JSON.parse(message.data);
		if ( msg.func == "heartBeat" ) {
			Controller.consoleHeart("heatbeat->" + message.data);
		} else {
			console.log("receving->" + message.data);
		}
		
		if ( msg.func =="signinsuccess" ) {
			content.innerHTML += "SUCCESS SIGNIN: " + msg.message  + '<br />';
			console.log("*********going to update dashboard");
			Controller.refreshDashboard();

		} else if ( msg.func == "successSendMessage" ) {
			content.innerHTML += "SUCCESS SEND: " + msg.message  + '<br />';

		} else if ( msg.func == "sendMessage" ) {
			content.innerHTML += "From: " + msg.userName + " ->" + msg.message  + '<br />';
		} else if ( msg.func == "scanConfirmIn" ) {
			var s = Controller.studentsList.get(parseInt(msg.studentId));
			var dt=new Date(msg.theDateTime);
			var dtS = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + " " + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
			content.innerHTML += "byUser: " + msg.byUser + " ->IN" + msg.studentId  + " dt->"  + dtS +  " id->" + msg.id+ '<br />';			
			ViewBuilder.inStudentToTable(msg.studentId,dtS,msg.id,msg.location);
			
			console.log("*********going to update dashboard");
			Controller.refreshDashboard();
		} else if ( msg.func == "scanConfirmOut" ) {
			var dt=new Date(msg.theDateTime);
			var dtS = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + " " + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
			content.innerHTML += "byUser: " + msg.byUser + " ->OUT" + msg.studentId  + " id->" + msg.id + " dt->"  + dtS + '<br />';			
			ViewBuilder.outStudentToTable(msg.studentId, msg.id,dtS);

			console.log("*********going to update dashboard");
			Controller.refreshDashboard();
		} else if ( msg.func == "flipRoom" ) {
			var dt=new Date(msg.theDateTime);
			var dtS = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + " " + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
			content.innerHTML += "byUser: " + msg.byUser + " ->FlipRoom" + msg.studentId  + " id->" + msg.id + " msg->"  + JSON.stringify(msg) + '<br />';			
			ViewBuilder.flipRoomMsgReceived(msg.id,msg.location);
			console.log("*********going to update dashboard");
			Controller.refreshDashboard();
		} else if ( msg.func == "studentList" ) {
			Controller.studentList = new Map(msg.message);
		} else if ( msg.func == "facultyList" ) {
//			Controller.facultyList = new Map(msg.message);
//			ViewBuilder.buildFacultyList(msg.message);
		} else if ( msg.func == "dashboard" ) {
			Controller.buildDashboard(msg);
		} else if ( msg.func == "dashboardsignin") {
			Controller.updateSignIn(msg);
		} else if ( msg.func == "dashboardsignout") {
			Controller.removeUser(msg.user);
		}  else if ( msg.func == "updateNote" ) {
		} 
		
		else if ( msg.func == "dashboardscanin") {
			alert("inside recivemessage - dashboard scanin");
			Controller.updateScanIn(msg);
			Controller.refreshDashboard();
		} 
		  else if (msg.func == "dashboardWEBSOCKET1"){
			alert("ANCDEF");
		  }
		 
		else if ( msg.func == "updateNote" ) {
			var dt=new Date(msg.theDateTime);
			var dtS = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + " " + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
			content.innerHTML += "byUser: " + msg.byUser + " ->note" + msg.studentId  + " id->" + msg.id + " dt->"  + dtS + '<br />';						
			ViewBuilder.updateNoteMsgReceived(msg.id, msg.note);
		} else if ( msg.func == "heartBeat" ) {
			//console.log("heartBeat->" + JSON.stringify(msg));
			Controller.heartbeats--;
		} else {
			content.innerHTML += "Unknown message->"  + JSON.stringify(msg) + '<br>';
		}
	}

	static messageInputFunc(e) {
		console.log("messageInputFunc" + document.getElementById(e.srcElement.id).value);

	}
	static sendTestFunc(e) {
		console.log("sendTestFunc->" + document.getElementById(e.srcElement.id).value); 
		var message=document.getElementById("message-text").value;
		Controller.creds.func='sendMessage';
		Controller.creds.message=message;
		Controller.creds.toUserName=ViewBuilder.getUserId();
		console.log("SENDING->" + JSON.stringify(creds));
		Controller.socket.send(JSON.stringify(creds));
	}
	static async sendNoteUpdate(transitId,studentId,note) {
		Controller.creds.func="updateNote";
		Controller.creds.studentId=studentId;
		Controller.creds.id=transitId;
		Controller.creds.note=note;
		Controller.socket.send(JSON.stringify(Controller.creds));
	}
	static async sendFlipRoom(transitId,toRoom) {
		Controller.creds.func="flipRoom";
		Controller.creds.id=transitId;
		Controller.creds.location=toRoom;
		Controller.socket.send(JSON.stringify(Controller.creds));
	}
	static async sendClose() {
		console.log("sending close");
		clearInterval(Controller.heartbeatFunc);
		Controller.creds.func="close";
		Controller.socket.send(JSON.stringify(Controller.creds));
		Controller.socket.close();
		ViewBuilder.clearDashboard();
		ViewBuilder.signOutCleanUp();
		Controller.socket = null;    
	}
	/*
	 * Here are callback from the login process.  They are called from login modals.
	 */
	static cancelUnknownLogin(e) {
		$('#loginUnknownUser').modal('hide');
	}
	static async createTempLogin(e) {
		$('#loginUnknownUser').modal('hide');
		var n=document.getElementById("ci_faculty_id").value;
		var l = ViewBuilder.getLocation();
		if ( l == null ) {
			alert("You must select a valid location.");
			return;
		}
		var rr=await DataLoader.addRTTempUser(n);
		console.log("ret->"  + JSON.stringify(rr));

		document.getElementById("ci_faculty_id").value = rr.name;
		Controller.finalizeTempLogin(0-rr.id,l);
		Controller.buildScreenPostLogin(l);
	}

	static async buildScreenPostLogin(l) {
		console.log("in build screen post login");
		$('#ci-rows').empty();
		$('#ci-out-rows').empty();
		var x = new Date();
		var y = x.getFullYear();
		var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
		var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
		var dtStr = y + "-" + m + "-" + d ;	
		console.log("date->" + dtStr);
		
		//set report default date
		document.getElementById("ci_rep_date").value = dtStr;
		var boysAt=document.getElementById("boys-at");
		var girlsAt=document.getElementById("girls-at");
		boysAt.innerHTML="0";
		girlsAt.innerHTML="0";
		boysAt.setAttribute("lav-count",0);
		girlsAt.setAttribute("lav-count",0);
		var room=Controller.roomList.get(l);
		if ( room.type == "LAV-DUAL" ) {
			Controller.dualRoom = new DualRoom(room.id,room.dualRoomId);
			boysAt.setAttribute("capacity",Controller.dualRoom.room1Capacity);
			girlsAt.setAttribute("capacity",Controller.dualRoom.room2Capacity);
			document.getElementById("boys-capacity").innerHTML=Controller.dualRoom.room1 + "(" + Controller.dualRoom.room1Capacity + "):";
			document.getElementById("girls-capacity").innerHTML=Controller.dualRoom.room2 + "(" + Controller.dualRoom.room2Capacity + "):";

			var res=await DataLoader.initializePostLogin(dtStr,Controller.dualRoom.room1);
			for ( var i=0; i < res.length; i++ ) {
				console.log("loading->" + JSON.stringify(res[i]));
				ViewBuilder.inStudentToTable(res[i].studentId,res[i].checkIn,res[i].id,res[i].location);
				if ( res[i].checkOut != null ) {
					ViewBuilder.outStudentToTable(res[i].studentId, res[i].id, res[i].checkOut);
				}
			}
			var res=await DataLoader.initializePostLogin(dtStr,Controller.dualRoom.room2);
			for ( var i=0; i < res.length; i++ ) {
				console.log("loading->" + JSON.stringify(res[i]));
				ViewBuilder.inStudentToTable(res[i].studentId,res[i].checkIn,res[i].id,res[i].location);
				if ( res[i].checkOut != null ) {
					ViewBuilder.outStudentToTable(res[i].studentId, res[i].id, res[i].checkOut);
				}
			}
		} else {
			Controller.dualRoom = null;
			boysAt.setAttribute("capacity",room.maleCapacity);
			girlsAt.setAttribute("capacity",room.femaleCapacity);
			document.getElementById("boys-capacity").innerHTML="Boys(" + room.maleCapacity + "):";
			document.getElementById("girls-capacity").innerHTML="Girls(" + room.femaleCapacity + "):";
			var res=await DataLoader.initializePostLogin(dtStr,l);
			for ( var i=0; i < res.length; i++ ) {
				console.log("loading->" + JSON.stringify(res[i]));
				ViewBuilder.inStudentToTable(res[i].studentId,res[i].checkIn,res[i].id,res[i].location);
				if ( res[i].checkOut != null ) {
					ViewBuilder.outStudentToTable(res[i].studentId, res[i].id, res[i].checkOut);
				}
			}
		}
		
		

		document.getElementById("ci-open-test").classList.add("d-none");
		document.getElementById("ci-logged-in-header").classList.remove("d-none");
		document.getElementById("signin-tab-item").classList.add("d-none");
		document.getElementById("scan-tab-item").classList.remove("d-none");
		document.getElementById("report-tab-item").classList.remove("d-none");
		document.getElementById("dashboard-tab-item").classList.remove("d-none");
		document.getElementById("ci-user-header").innerHTML=document.getElementById("ci_faculty_id").value;
		document.getElementById("ci-location-header").innerHTML=document.getElementById("ci_rooms_id").value;
		document.getElementById("location-checker-tab").click();
	
		
		
		if ( Controller.isDualRoom() ) {
			document.getElementById("std-room-in-header").classList.add("d-none");
			document.getElementById("dual-room-in-header").classList.remove("d-none");
			document.getElementById("std-room-out-header").classList.add("d-none");
			document.getElementById("dual-room-out-header").classList.remove("d-none");
			ViewBuilder.dualRoomSetup();
		}
	}

	static async refreshDashboard(){
		Controller.buildDashboardARNAV(false)
	}

	static async buildDashboardARNAV(toggle) {

		Controller.creds.func='dashboardWEBSOCKET1';

		if(toggle){
			ViewBuilder.toggleDashboard();
			$("#table-animation").hide();

		}

		if($("#ci-dash-area").hasClass("d-none")) return false;


		var x = new Date();
		var y = x.getFullYear();
		var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
		var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
		var dtStr = y + "-" + m + "-" + d ;	
		
		

		console.log("in build dashboard func");

		//$("#ci-dash-status").hide('slow', function(){ $("#ci-dash-status").find("tr:gt(0)").remove(); });
		//$("#ci-dash-status").find("tr:gt(0)").remove();

		///$("#table-animation").hide();
		//$("#table-animation").show('slow');
		
		//$("#ci-dash-status").find("tr:gt(0)").remove();
		

		var locations = Controller.roomList;

		for (let [key, value] of locations) {
			//key = location
			//console.log(key + " = " + value);
			var loc = key;
			var maleCapacity = value.maleCapacity;
			var femaleCapacity = value.femaleCapacity;
			var maleOccupancy = 0;
			var femaleOccupancy = 0;

			var occupidStat=await DataLoader.initializePostLogin(dtStr,loc);

			const facultyId = [];
			const facultyNames = [];

			for(var i = 0; i < occupidStat.length; i++){
				//use this if multiple users
				if(!facultyId.includes(occupidStat[i].byUser)){
					facultyId.push(occupidStat[i].byUser);
					facultyNames.push(await Controller.getFacultyName(occupidStat[i].byUser));
				}
				

				if(occupidStat[i].checkOut==undefined){
					var studentGender = Controller.studentsList.get(occupidStat[i].studentId).gender;
					if(studentGender == 'M'){
						maleOccupancy++;
					}
					else{
						femaleOccupancy++;
					}
				}
			}

			// console.log(facultyId);
			// console.log(facultyNames);
			
			
			// try {
			// 	facultyId = occupidStat[0].byUser;
			// 	teachername = await Controller.getFacultyName(facultyId);
			// } catch (error) {
			// 	teachername = "No Faculty";
			// }


			// if(occupidStat[0].byUser != undefined || occupidStat[0].byUser != null){
			// 	facultyId = occupidStat[0].byUser;
			// }
	

			
			ViewBuilder.setUpDashboard(loc, maleOccupancy, femaleOccupancy, facultyNames, loc, maleCapacity, femaleCapacity);
			
		}
			$("#table-animation").show('slow');
		
	}

	static async getFacultyName(id){
		var x = new DataLoader();
		var f = await x.getRTFacultyList();

		var list = f.filter(e=>e[0]==id);
		var facultyName=id;
		if (list.length!=0)
			facultyName= list[0][1].name;
			
		return facultyName;
	}

	static async dualRoomConfigCancel(e) {
		await ViewBuilder.dualRoomConfigCancel();
	}
	static dualRoomConfigContinue(e) {
		ViewBuilder.dualRoomConfigContinue();
	}



	static async buildDashboard(msg) {
		alert("Builddashboard");
		var x = new Date();
		var y = x.getFullYear();
		var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
		var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
		var dtStr = y + "-" + m + "-" + d ;	
		try {
			var facultyList = await Controller.getFacultyNames(msg.users);
			var rooms = msg.rooms;
			var ids = msg.users;
			for (const [key, value] of rooms.entries()) {
				var location = value.num, femaleOccupancy = 0, maleOccupancy = 0, capacity = value.capacity, status;
				var l = await DataLoader.initializePostLogin(dtStr,value.num);
				var maleCapacity = value.maleCapacity;
				var femaleCapacity = value.femaleCapacity;
				var user = ids.find(user => user[0] === value.num);

				var occupidStat=await DataLoader.initializePostLogin(dtStr,key);

				const facultyId = [];
				const facultyNames = [];
				
				for(var i = 0; i < occupidStat.length; i++){
					//use this if multiple users
					if(!facultyId.includes(occupidStat[i].byUser)){
						facultyId.push(occupidStat[i].byUser);
						facultyNames.push(await Controller.getFacultyName(occupidStat[i].byUser));
					}
				}


				for(let t of l) {
					if(t.checkOut) {
						continue;
					} 
					if(Controller.studentsList.get(t.studentId).gender == "M") {
						maleOccupancy++;
					} else {
						femaleOccupancy++;
					}
				}
				if(user) {
					user = facultyList.get(user[1]);
					status = "Active";
				} else {
				    user = 'None';
					status = "Empty";
				}

				var test = DataLoader.initializePostLogin(dtStr,'mid_campus');


				ViewBuilder.addLocation(location, femaleOccupancy, maleOccupancy, capacity, user, status);
				ViewBuilder.setUpDashboard(location,maleOccupancy, femaleOccupancy, facultyNames, location, maleCapacity, femaleCapacity);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}



	static async buildDashboardJI(msg) {
		alert("JI");
		var x = new Date();
		var y = x.getFullYear();
		var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
		var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
		var dtStr = y + "-" + m + "-" + d ;	
		try {
			var fm = await Controller.getFacultyNames(msg.users);
			var rooms = msg.rooms;
			var ids = msg.users;
			for (const [key, value] of rooms.entries()) {
				var n = value.num, f = 0, m = 0, c = value.capacity, status;
				var l = await DataLoader.initializePostLogin(dtStr,value.num);
				for(let t of l) {
					if(t.checkOut) {
						continue;
					} 
					if(Controller.studentsList.get(t.studentId).gender == "M") {
						m++;
					} else {
						f++;
					}
				}
				var user = ids.find(user => user[0] === value.num);
				if(user) {
					user = fm.get(user[1]);
					status = "Active";
				} else {
				    user = 'None';
					status = "Empty";
				}
				ViewBuilder.addLocation(n, f, m, c, user, status);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	static async updateSignIn(msg) {
		var f = await Controller.getFacultyName(msg.id);
		ViewBuilder.newSignIn(f, msg.room);
	}


	static updateScanIn(msg) {
		
		var l = msg.location;
		var t = msg.type;
		var student = Controller.studentsList.get(msg.id);
		if(t === "scanConfirmOut") {
			Controller.refreshDashboard();
			ViewBuilder.dbScanIn(l, student.gender, false);
		} else {
			Controller.refreshDashboard();
			ViewBuilder.dbScanIn(l, student.gender, true);
		}
	}
	
	static async getFacultyNames(ids) {
		var d = new DataLoader();
		var f = await d.getRTFacultyList();
		var facultyMap = new Map();
		for(let id of ids) {
			let n = id[1];
			var list = f.filter(e => e[0] == n);
        	var facultyName = id;
        	if (list.length != 0) {
            	facultyName = list[0][1].name;
        	}
        	facultyMap.set(n, facultyName);
		}
		return facultyMap;
	}

	static async getFacultyName(id){
		var x = new DataLoader();
		var f = await x.getRTFacultyList();

		var list = f.filter(e=>e[0]==id);
		var facultyName=id;
		if (list.length!=0)
			facultyName= list[0][1].name;
			
		return facultyName;
	}



	static async buildDashboard(msg) {
		alert("Builddashboard");
		var x = new Date();
		var y = x.getFullYear();
		var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
		var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
		var dtStr = y + "-" + m + "-" + d ;	
		try {
			var facultyList = await Controller.getFacultyNames(msg.users);
			var rooms = msg.rooms;
			var ids = msg.users;
			for (const [key, value] of rooms.entries()) {
				var location = value.num, femaleOccupancy = 0, maleOccupancy = 0, capacity = value.capacity, status;
				var l = await DataLoader.initializePostLogin(dtStr,value.num);
				var maleCapacity = value.maleCapacity;
				var femaleCapacity = value.femaleCapacity;
				var user = ids.find(user => user[0] === value.num);

				var occupidStat=await DataLoader.initializePostLogin(dtStr,key);

				const facultyId = [];
				const facultyNames = [];
				
				for(var i = 0; i < occupidStat.length; i++){
					//use this if multiple users
					if(!facultyId.includes(occupidStat[i].byUser)){
						facultyId.push(occupidStat[i].byUser);
						facultyNames.push(await Controller.getFacultyName(occupidStat[i].byUser));
					}
				}


				for(let t of l) {
					if(t.checkOut) {
						continue;
					} 
					if(Controller.studentsList.get(t.studentId).gender == "M") {
						maleOccupancy++;
					} else {
						femaleOccupancy++;
					}
				}
				if(user) {
					user = facultyList.get(user[1]);
					status = "Active";
				} else {
				    user = 'None';
					status = "Empty";
				}

				var test = DataLoader.initializePostLogin(dtStr,'mid_campus');


				ViewBuilder.addLocation(location, femaleOccupancy, maleOccupancy, capacity, user, status);
				ViewBuilder.setUpDashboard(location,maleOccupancy, femaleOccupancy, facultyNames, location, maleCapacity, femaleCapacity);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}



	static async buildDashboardJI(msg) {
		alert("JI");
		var x = new Date();
		var y = x.getFullYear();
		var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
		var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
		var dtStr = y + "-" + m + "-" + d ;	
		try {
			var fm = await Controller.getFacultyNames(msg.users);
			var rooms = msg.rooms;
			var ids = msg.users;
			for (const [key, value] of rooms.entries()) {
				var n = value.num, f = 0, m = 0, c = value.capacity, status;
				var l = await DataLoader.initializePostLogin(dtStr,value.num);
				for(let t of l) {
					if(t.checkOut) {
						continue;
					} 
					if(Controller.studentsList.get(t.studentId).gender == "M") {
						m++;
					} else {
						f++;
					}
				}
				var user = ids.find(user => user[0] === value.num);
				if(user) {
					user = fm.get(user[1]);
					status = "Active";
				} else {
				    user = 'None';
					status = "Empty";
				}
				ViewBuilder.addLocation(n, f, m, c, user, status);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	static async updateSignIn(msg) {
		var f = await Controller.getFacultyName(msg.id);
		ViewBuilder.newSignIn(f, msg.room);
	}


	static updateScanIn(msg) {
		
		var l = msg.location;
		var t = msg.type;
		var student = Controller.studentsList.get(msg.id);
		if(t === "scanConfirmOut") {
			Controller.refreshDashboard();
			ViewBuilder.dbScanIn(l, student.gender, false);
		} else {
			Controller.refreshDashboard();
			ViewBuilder.dbScanIn(l, student.gender, true);
		}
	}
	
	static async getFacultyNames(ids) {
		var d = new DataLoader();
		var f = await d.getRTFacultyList();
		var facultyMap = new Map();
		for(let id of ids) {
			let n = id[1];
			var list = f.filter(e => e[0] == n);
        	var facultyName = id;
        	if (list.length != 0) {
            	facultyName = list[0][1].name;
        	}
        	facultyMap.set(n, facultyName);
		}
		return facultyMap;
	}

	static async getFacultyName(id){
		var x = new DataLoader();
		var f = await x.getRTFacultyList();

		var list = f.filter(e=>e[0]==id);
		var facultyName=id;
		if (list.length!=0)
			facultyName= list[0][1].name;
			
		return facultyName;
	}

	static async buildDashboard(msg) {
		var x = new Date();
		var y = x.getFullYear();
		var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
		var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
		var dtStr = y + "-" + m + "-" + d ;	
		try {
			var fm = await Controller.getFacultyNames(msg.users);
			var rooms = msg.rooms;
			var ids = msg.users;
			for (const [key, value] of rooms.entries()) {
				var n = value.num, f = 0, m = 0, c = value.capacity, status;
				var l = await DataLoader.initializePostLogin(dtStr,value.num);
				for(let t of l) {
					if(t.checkOut) {
						continue;
					} 
					if(Controller.studentsList.get(t.studentId).gender == "M") {
						m++;
					} else {
						f++;
					}
				}
				var user = ids.find(user => user[0] === value.num);
				if(user) {
					user = fm.get(user[1]);
					status = "Active";
				} else {
				    user = 'None';
					status = "Empty";
				}
				ViewBuilder.addLocation(n, f, m, c, user, status);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	static async updateSignIn(msg) {
		var f = await Controller.getFacultyName(msg.id);
		ViewBuilder.newSignIn(f, msg.room);
	}


	static updateScanIn(msg) {
		var l = msg.location;
		var t = msg.type;
		var student = Controller.studentsList.get(msg.id);
		if(t === "scanConfirmOut") {
			ViewBuilder.dbScanIn(l, student.gender, false);
		} else {
			ViewBuilder.dbScanIn(l, student.gender, true);
		}
	}
	
	static async getFacultyNames(ids) {
		var d = new DataLoader();
		var f = await d.getRTFacultyList();
		var facultyMap = new Map();
		for(let id of ids) {
			let n = id[1];
			var list = f.filter(e => e[0] == n);
        	var facultyName = id;
        	if (list.length != 0) {
            	facultyName = list[0][1].name;
        	}
        	facultyMap.set(n, facultyName);
		}
		return facultyMap;
	}

	static async getFacultyName(id){
		var x = new DataLoader();
		var f = await x.getRTFacultyList();

		var list = f.filter(e=>e[0]==id);
		var facultyName=id;
		if (list.length!=0)
			facultyName= list[0][1].name;
			
		return facultyName;
	}
}