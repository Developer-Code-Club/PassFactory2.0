/*
 * The Controller class is main controller of clientside.
 */
 
class Controller {
	static  creds = null;
	static  socket = null;
	
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

	}
	async initializeRTData() {
		
		if ( Controller.isProcessing ) { 
			alert("already processing.  Please wait...");
			return;
		}
		Controller.isProcessing = true;
		console.log("in initializeData");
		var x = new DataLoader();
		var vb = new ViewBuilder();
	
		Controller.isProcessing = false;

		var f = await x.getRTFacultyList();
		console.log("f->" + JSON.stringify(f));
		Controller.facultyList = new Map(f);
		ViewBuilder.buildFacultyList(f);
		
		var r = await x.getRTRoomsList();
		console.log("r->" + JSON.stringify(r));
		Controller.roomsList = new Map(r);
		ViewBuilder.buildRoomsList(r);
		
		var s = await x.getRTStudentsList();
		console.log("s->" + JSON.stringify(s));
		Controller.studentsList = new Map(s);
		ViewBuilder.buildStudentsList(s);
		
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
/* old version.
	static sendCheckInFunc(e) {
		console.log("sendCheckInFunc->" + document.getElementById(e.srcElement.id).value);
		var ciNote=document.getElementById("ci-note").value;
		var ciStudentId=document.getElementById("ci-student-id").value;
		var ciLocation=document.getElementById("ci-location").value;
		var ciUserName=document.getElementById("ci-user-name").value;
		var message = {};
		Controller.creds.note = ciNote;
		Controller.creds.studentId = ciStudentId;
		Controller.creds.location = ciLocation;
		Controller.creds.userName = ciUserName;
		Controller.creds.func='scannedId';
		Controller.socket.send(JSON.stringify(Controller.creds));
	}
*/
	static sendCheckInFunc(e) {
		//console.log("sendCheckInFunc->" + document.getElementById(e.srcElement.id).value);
//		var ciNote=document.getElementById("notes").value;
//		var ciStudentId=document.getElementById("idNum").value;
//		var ciLocation=document.getElementById("roomNum").value;
//		document.getElementById("flname").value=Controller.studentList.get(parseInt(ciStudentId)).name;	
		var i = ViewBuilder.getStudentId();

		var message = {};
//		Controller.creds.note = ciNote;
		Controller.creds.studentId = i;
		Controller.creds.func='scannedId';
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
	
	static openTestFunc(e) {
		var i = ViewBuilder.getFacultyId();
		var l = ViewBuilder.getLocation();
		
		alert("opening->" + i + " ->" + l);
//		var server="ws://localhost:1337";
		var server="ws://192.168.11.135:1337";
		Controller.socket = new WebSocket(server);
		Controller.socket.onopen = function () {
			var sel = document.getElementById("ci_faculty_id")
			var id = i;
	//		alert(id);
			Controller.creds={func:'signin', userName:i,location:l};
			Controller.socket.send(JSON.stringify(Controller.creds));
	
		};
		Controller.socket.onmessage = Controller.receiveMessage;
		Controller.socket.onerror = function (error) {
			console.log('WebSocket error: ' + error);
		};
	}
	static receiveMessage(message) {
		console.log("receving->" + message.data);
		var content = document.getElementById("location-checker-content");

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
			content.innerHTML += "byUser: " + msg.byUser + " ->IN" + msg.studentId  + " dt->"  + dtS + '<br />';			
			ViewBuilder.inStudentToTable(msg.studentId,dtS);
		} else if ( msg.func == "scanConfirmOut" ) {
			var dt=new Date(msg.theDateTime);
			var dtS = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + " " + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
			content.innerHTML += "byUser: " + msg.byUser + " ->OUT" + msg.studentId  + " dt->"  + dtS + '<br />';			
			ViewBuilder.outStudentToTable(msg.studentId, dtS);
		} else if ( msg.func == "studentList" ) {
			Controller.studentList = new Map(msg.message);
		} else if ( msg.func == "facultyList" ) {
//			Controller.facultyList = new Map(msg.message);
//			ViewBuilder.buildFacultyList(msg.message);
		} else {
			content.innerHTML += "Unknown message->"  + JSON.stringify(msg) + '<br>';
		}
	}
	static myFunction(e) {
		alert("init");
	}
	static closeTestFunc(e) {
		console.log("in close test func");
		Controller.socket.send (JSON.stringify({ func: 'close'} )) ;
		Controller.socket.close(3021);
	}
	static messageInputFunc(e) {
		console.log("messageInputFunc" + document.getElementById(e.srcElement.id).value);

	}
	static sendTestFunc(e) {
		console.log("sendTestFunc->" + document.getElementById(e.srcElement.id).value);
		var message=document.getElementById("message-text").value;
		Controller.creds.func='sendMessage';
		Controller.creds.message=message;
		Controller.creds.toUserName=document.getElementById("to-user").value;
		console.log("SENDING->" + JSON.stringify(creds));
		Controller.socket.send(JSON.stringify(creds));
	}
}