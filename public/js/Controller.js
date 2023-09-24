/*
 * The Controller class is main controller of clientside.
 */
 
class Controller {
	static  creds = null;
	static  socket = null;
	static studentsList = null;
	static heartbeats=0;
	static heartbeatFunc=null;
	constructor() {
		
	}
	static isProcessing=false;
	
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
		console.log("r->" + JSON.stringify(r));
		Controller.roomsList = new Map(r);
		ViewBuilder.buildRoomsList(r);
		
		var s = await x.getRTStudentsList();
		Controller.studentsList = new Map(s);
		ViewBuilder.buildStudentsList(s);
		
		var tu = await x.getRTTempUserList();

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

	static sendCheckInFunc(e) {
		var i = ViewBuilder.getStudentId();
		if ( i == null ) {
			alert("Unknown Student");
			return;
		}
		var message = {};
		Controller.creds.note = "";
		Controller.creds.studentId = i;
		Controller.creds.func='scannedId';
//		Controller.creds.userName = ViewBuilder.getUserId();
		Controller.socket.send(JSON.stringify(Controller.creds));
		ViewBuilder.clearStudentId();
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
	/*
	 * This function will verify the FacultyId and the Location of 
	 * the person logging in. They can create a temporary faculty ID but
	 * they must select a valid location.
	 */
	static async loginAttempt(e) {
		console.log("in loginAttempt");
		var i = ViewBuilder.getUserId();
		var l = ViewBuilder.getLocation();
		
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
				console.log("MMMMISED->" + Controller.heartbeats );
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
				alert("Lost server connection.  Please login again.  If issues continue contact support.");
            }
        }, 5000);
   
	}
	
	static receiveMessage(message) {
		console.log("receving->" + message.data);
		var content = document.getElementById("ci-logs");

		var msg=JSON.parse(message.data);
		if ( msg.func =="signinsuccess" ) {
			content.innerHTML += "SUCCESS SIGNIN: " + msg.message  + '<br />';

		} else if ( msg.func == "successSendMessage" ) {
			content.innerHTML += "SUCCESS SEND: " + msg.message  + '<br />';

		} else if ( msg.func == "sendMessage" ) {
			content.innerHTML += "From: " + msg.userName + " ->" + msg.message  + '<br />';
		} else if ( msg.func == "scanConfirmIn" ) {
			var dt=new Date(msg.theDateTime);
			var dtS = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + " " + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
			content.innerHTML += "byUser: " + msg.byUser + " ->IN" + msg.studentId  + " dt->"  + dtS +  " id->" + msg.id+ '<br />';			
			ViewBuilder.inStudentToTable(msg.studentId,dtS,msg.id);
		} else if ( msg.func == "scanConfirmOut" ) {
			var dt=new Date(msg.theDateTime);
			var dtS = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + " " + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
			content.innerHTML += "byUser: " + msg.byUser + " ->OUT" + msg.studentId  + " id->" + msg.id + " dt->"  + dtS + '<br />';			
			ViewBuilder.outStudentToTable(msg.studentId, dtS);
		} else if ( msg.func == "studentList" ) {
			Controller.studentList = new Map(msg.message);
		} else if ( msg.func == "facultyList" ) {
//			Controller.facultyList = new Map(msg.message);
//			ViewBuilder.buildFacultyList(msg.message);
		} else if ( msg.func == "heartBeat" ) {
			console.log("heartBeat->" + JSON.stringify(msg));
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
	static async sendClose() {
		console.log("sending close");
		clearInterval(Controller.heartbeatFunc);
		Controller.creds.func="close";
		Controller.socket.send(JSON.stringify(Controller.creds));
		Controller.socket.close();
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
		var x = new Date();
		var y = x.getFullYear();
		var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
		var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
		var dtStr = y + "-" + m + "-" + d ;	
		console.log("date->" + dtStr);
		var res=await DataLoader.initializePostLogin(dtStr,l);
		for ( var i=0; i < res.length; i++ ) {
			console.log("loading->" + JSON.stringify(res[i]));
			ViewBuilder.inStudentToTable(res[i].studentId,res[i].checkIn,res[i].id);
			if ( res[i].checkOut != null ) {
				ViewBuilder.outStudentToTable(res[i].studentId, res[i].checkOut);
			}
		}
		document.getElementById("ci-open-test").classList.add("d-none");
		document.getElementById("ci-logged-in-header").classList.remove("d-none");
		document.getElementById("signin-tab-item").classList.add("d-none");
		document.getElementById("scan-tab-item").classList.remove("d-none");
		document.getElementById("report-tab-item").classList.remove("d-none");
		document.getElementById("ci-user-header").innerHTML=document.getElementById("ci_faculty_id").value;
		document.getElementById("ci-location-header").innerHTML=document.getElementById("ci_rooms_id").value;
		document.getElementById("location-checker-tab").click();
		

	}
}