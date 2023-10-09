/*
 * The ViewBuilder screen builder.
 */
 
class ViewBuilder {
	
	constructor() {
	}
	
	
	async setProcessingLoadOn() { 
		$('#integrity-tab-body').empty();
		$('#integrity-tab-totals').empty();
		document.getElementById("integrity-processing").classList.remove("d-none");
		$('#student-tab-body').empty();
		$('#block-type-tab-body').empty();
		$('#passes-tab-body').empty();
		$('#db-tab-body').empty();
	}

	async setProcessingLoadOff() { 
		document.getElementById("integrity-processing").classList.add("d-none");
	}
	async buildDataIntegrityTable(integrityIssues) {	
		$('#integrity-tab-body').empty();
		var tab = document.getElementById("integrity-tab-body");
		for (var i=0; i < integrityIssues.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=integrityIssues[i].level;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=integrityIssues[i].objectType;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=integrityIssues[i].method;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=integrityIssues[i].description;
			tr.appendChild(td);
		}
	}
	buildStudentDataView(studentData) {
		$('#student-tab-body').empty();
		var tab = document.getElementById("student-tab-body");
		for (var i=0; i < studentData.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=studentData[i].id;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=studentData[i].name;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=studentData[i].email;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=studentData[i].theSchedule.blockCount;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=JSON.stringify(studentData[i].theSchedule);;
			tr.appendChild(td);
		}
	}
	buildPassesTab(passesData) {
		$('#passes-tab-body').empty();
		var tab = document.getElementById("passes-tab-body");
		for (var i=0; i < passesData.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=passesData[i].id;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=passesData[i].studentId;
			tr.appendChild(td);
			var s="N";
			if ( passesData[i].student != null ) { s="Y";}
			td = document.createElement("td");
			td.innerHTML=s;
			tr.appendChild(td);
			var fb="N";
			if ( passesData[i].fromBlock != null ) { fb="Y";}
			td = document.createElement("td");
			td.innerHTML=fb;
			tr.appendChild(td);
			td = document.createElement("td");
			var dt = new Date(passesData[i].dateTime);
			td.innerHTML=dt.toLocaleString();
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=passesData[i].note;
			tr.appendChild(td);
		}
	}
	buildDecoratePassesTab(passesData) {
		$('#db-tab-body').empty();
		var tab = document.getElementById("dp-tab-body");
		for (var i=0; i < passesData.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=passesData[i].student.id;
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=passesData[i].student.name;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=passesData[i].student.email;
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=passesData[i].homeRoomNumber;
			tr.appendChild(td);
			
			td = document.createElement("td");
			if ( passesData[i].homeRoomTeacher != null ) {
				td.innerHTML=passesData[i].homeRoomTeacher.name;
			} else {
				td.innerHTML="";
			}
			tr.appendChild(td);
			td = document.createElement("td");
					if ( passesData[i].homeRoomTeacher != null ) {
				td.innerHTML=passesData[i].homeRoomTeacher.email;
			} else {
				td.innerHTML="";
			}
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=passesData[i].fromRoomNumber;
			tr.appendChild(td);
			td = document.createElement("td");
			if ( passesData[i].fromRoomTeacher != null ) {
				td.innerHTML=passesData[i].fromRoomTeacher.name;
			} else {
				td.innerHTML="";
			}
			tr.appendChild(td);
			
			td = document.createElement("td");
					if ( passesData[i].fromRoomTeacher != null ) {
				td.innerHTML=passesData[i].fromRoomTeacher.email;
			} else {
				td.innerHTML="";
			}
			tr.appendChild(td);
			
			td = document.createElement("td");		
			var dt = new Date(passesData[i].dateTime);
			td.innerHTML=dt.toLocaleString();
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=passesData[i].note;
			tr.appendChild(td);
		}
	}
	buildBlockTypeCountTab(blockTypeCounts) {
		$('#block-type-tab-body').empty();
		var tab = document.getElementById("block-type-tab-body");
		for (var i=0; i < blockTypeCounts.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=blockTypeCounts[i][0];
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=blockTypeCounts[i][1];
			tr.appendChild(td);
		}
	}
	buildDataIntegrityCounts(integrityIssues) {
		var oCount = new Map();
		for ( var i=0; i < integrityIssues.length; i++ ) {
			var at = oCount.get(integrityIssues[i].objectType);
			if ( at == null ) {
				var mCount= new Map();
				mCount.set(integrityIssues[i].method,1);
				oCount.set(integrityIssues[i].objectType,mCount);
			} else {
				var mCount = at.get(integrityIssues[i].method);
				if ( mCount == null ) {
					at.set(integrityIssues[i].method,1);
				} else {
					at.set(integrityIssues[i].method, mCount+1);
				}
			}
		}
		var vv = Array.from(oCount.keys());
		var vv2 = Array.from(oCount.values());
		var vv3=[];
		for ( var i=0; i < vv.length; i++ ) {
			var mMapA=Array.from(vv2[i]);
			for (var ii=0; ii< mMapA.length; ii++ ) {	
				vv3.push([vv[i],mMapA[ii][0], mMapA[ii][1]]);
			}
		}
		$('#integrity-tab-totals').empty();
		var tab = document.getElementById("integrity-tab-totals");
		for (var i=0; i < vv3.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=vv3[i][0];
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=vv3[i][1];
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=vv3[i][2];
			tr.appendChild(td);
		}
	}
	addStudent(studentId,timeEnter) {
		var tab = document.getElementById("ci-rows");
		var tr = document.createElement("tr");
		tab.appendChild(tr);
		var td = document.createElement("td");
		td.innerHTML=studentId;
		tr.appendChild(td);
		
		td = document.createElement("td");
		td.innerHTML=timeEnter;
		tr.appendChild(td);
		
		td = document.createElement("td");
		td.innerHTML="Fix Later";
		tr.appendChild(td);
	}
	static buildFacultyList(list) {
		var dl = document.getElementById("ci_faculty_list");
		for ( var i=0; i < list.length; i++ ) {
			if ( list[i][1].id == null || list[i][1].id.length == 0 ) {
				console.log("SKIPPING FACULTY->" + JSON.stringify(list[i][1]));
			} else {
				var o = document.createElement("option");
				o.value = list[i][1].name
				o.setAttribute("facultyId",list[i][1].id);
				o.id = "faculty-" + list[i][1].id;
				o.rr = list[i][1].id
				dl.appendChild(o);
			}
		}
	}
	static buildTempUserList(list) {
		/* SHORT TERM HACK TO ADD TEMP USERS TO DROPDOWN */
		var dl = document.getElementById("ci_faculty_list");
		for ( var i=0; i < list.length; i++ ) {
			var o = document.createElement("option");
			o.value = list[i].name
			o.setAttribute("tempUserId",list[i].id);
			o.id = "temp-user-" + list[i].id;
			o.rr = 0 - list[i].id
			dl.appendChild(o);
		}
	}
	static buildRoomsList(list) {
		var dl = document.getElementById("ci_rooms_list");
		var drl = document.getElementById("ci_rep_rooms_list");
		for ( var i=0; i < list.length; i++ ) {
			var o = document.createElement("option");
			o.value = list[i].id
			o.setAttribute("roomId",list[i].id);
			o.setAttribute("room",JSON.stringify(list[i]));
			o.id = "rooms-" + list[i].id;
			o.rr = list[i].id;
			dl.appendChild(o);
			var o2 = document.createElement("option");
			o2.value = list[i].id
			o2.setAttribute("roomId",list[i].id);
			o2.setAttribute("room",JSON.stringify(list[i]));
			o2.id = "rep-rooms-" + list[i].id;
			o2.rr = list[i].id;
			drl.appendChild(o2);
		}
	}
	static buildStudentsList(list) {
		var dl = document.getElementById("ci_students_list");
		for ( var i=0; i < list.length; i++ ) {
			var o = document.createElement("option");
			o.value = list[i][1].name
			o.setAttribute("studentId",list[i][1].id);
			o.id = "students-" + list[i][1].id;
			o.rr = list[i][1].id;
			dl.appendChild(o);
		}
	}
	
	static is_valid_datalist_value(idDataList, inputValue) {
		var option = document.querySelector("#" + idDataList + " option[value='" + inputValue + "']");
		if ( option == null ) { return null; }
		console.log("ooooo->" + option.getAttribute("tempUserId") + " ->" + option.getAttribute("facultyId"));
		return option.rr;
	}
	/* 
	 * First it assumes field is a student number from scan.  If not it sees if it is a name.
	 *
	 */
	static getStudentId() {
		
		var studentId = document.getElementById("ci_students_id").value;
		if ( studentId == null ) {
			return null;
		}
		if ( Controller.studentsList.get(parseInt(studentId)) != null ) {
			return studentId;
		}
		var x = ViewBuilder.is_valid_datalist_value('ci_students_list', document.getElementById('ci_students_id').value);		
		return x;
	}
	static clearStudentId() {
		document.getElementById("ci_students_id").value="";
	}
	static getNoteForTransit(id) {
		var iNote=document.getElementById("note-input-" + id);
		if ( iNote != null ) { 
			return iNote.value;
		}
		return "";
	}
	static getFacultyId() {
		var x = ViewBuilder.is_valid_datalist_value('ci_faculty_list', document.getElementById('ci_faculty_id').value);		
		return x;
	}
	static getUserId() {
		var inputValue = document.getElementById('ci_faculty_id').value;
		console.log("inputValue->" + inputValue);
		var option = document.querySelector("#" + 'ci_faculty_list' + " option[value='" + inputValue + "']");
		if ( option == null ) { return null; }
		console.log("ooooo->" + option.rr + "->" + option.getAttribute("tempUserId") + " ->" + option.getAttribute("facultyId"));
		return option.rr;
	}
	static isUserTemp() {
		var inputValue = document.getElementById('ci_faculty_id').value;
		var option = document.querySelector("#" + 'ci_faculty_list' + " option[value='" + inputValue + "']");
		if ( option == null ) { return null; }
		if ( option.getAttribute("tempUserId") != null ) {
			return true;
		}
		return false;
	}
	static isUserFaculty() {
		var inputValue = document.getElementById('ci_faculty_id').value;
		var option = document.querySelector("#" + 'ci_faculty_list' + " option[value='" + inputValue + "']");
		if ( option == null ) { return false; }
		if ( option.getAttribute("facultyId") != null ) {
			return true;
		}
		return false;
	}
	static signOutCleanUp() { 
		document.getElementById("ci-logged-in-header").classList.add("d-none");
		document.getElementById("ci-open-test").classList.remove("d-none");
		document.getElementById("ci_faculty_id").value="";
		document.getElementById("ci_rooms_id").value="";
		document.getElementById("signin-tab-item").classList.remove("d-none");
		document.getElementById("scan-tab-item").classList.add("d-none");
		document.getElementById("report-tab-item").classList.add("d-none");
		document.getElementById("ci-user-header").innerHTML="";
		document.getElementById("ci-location-header").innerHTML="";
		document.getElementById("std-room-in-header").classList.remove("d-none");
		document.getElementById("dual-room-in-header").classList.add("d-none");
		document.getElementById("std-room-out-header").classList.remove("d-none");
		document.getElementById("dual-room-out-header").classList.add("d-none");
		
		document.getElementById("signin-tab").click();
		
	}
		
	
	static getTempUserId(name) {
		var x = ViewBuilder.is_valid_datalist_value('ci_temp_user_list', name);		
		return x;
	}
	static getRepLocation() {
		var x = ViewBuilder.is_valid_datalist_value('ci_rep_rooms_list', document.getElementById('ci_rep_rooms_id').value);		
		return x;
	}
	static getLocation() {
		var x = ViewBuilder.is_valid_datalist_value('ci_rooms_list', document.getElementById('ci_rooms_id').value);		
		return x;
	}
	static checkRoomCapacity(gender) {
		var rows=document.getElementById("ci-rows");
		var mCount=0;
		var fCount=0;
		for ( var i=0; i < rows.children.length; i++ ) {
			console.log("id=-->" + rows.children[i].id);
			var s=rows.children[i].getAttribute("student");
			if ( s.gender == "M" ) { mCount ++; } else { fCount++; }
		}
	}
	static checkIfStudentInRoom(studentId) {
		var rows=document.getElementById("ci-rows");
		for ( var i=0; i < rows.children.length; i++ ) {
			var s=JSON.parse(rows.children[i].getAttribute("student"));
			console.log("comparing->" + JSON.stringify(s) + " ->>" + studentId);
			if ( s.studentId == studentId ) { return s.roomName;}
		}
		return null;
	}
	
	static getTransitId(studentId) {
		var rows=document.getElementById("ci-rows");
		console.log("ROWSSSSSS->" + rows.children.length);
		for ( var i=0; i < rows.children.length; i++ ) {
			var s = rows.children[i].getAttribute("student");
			var transitId=null;
			if ( s != null ) { 
				s = JSON.parse(s);
				if ( s.studentId == studentId ) {
					transitId = s.transitId;
					console.log("RETURNING->" + transitId);
					return transitId;
				}
			}
		}
		return null;
	}
	
	static setRoomCapacity() {
		var room1Ct=0;
		var room2Ct=0;
		// Loop through students in room and count them per room.
		// if DualRoom use room1.  If gender use M vs F

		var rows=document.getElementById("ci-rows");
		for ( var i=0; i < rows.children.length; i++ ) {
			var s=JSON.parse(rows.children[i].getAttribute("student"));
			console.log("SSSSSs->" + JSON.stringify(s));
			if ( Controller.isDualRoom() ) {
				if ( s.roomName == Controller.dualRoom.room1 ) {
					room1Ct++;
				} else {
					room2Ct++;
				}	
			} else {
				if ( s.gender == "M" ) {
					room1Ct++;
				} else {
					room2Ct++;
				}
			}
		}
	
		var room1Lav = document.getElementById("boys-at");
		var room2Lav = document.getElementById("girls-at");
		
		var r1Cap=parseInt(room1Lav.getAttribute("capacity"));
		var r2Cap=parseInt(room2Lav.getAttribute("capacity"));
		
		if ( room1Ct < r1Cap ) {
			room1Lav.classList.remove("badge-danger");
			room1Lav.classList.add("badge-success");
		} else {
			room1Lav.classList.add("badge-danger");
			room1Lav.classList.remove("badge-success");
		}
		room1Lav.innerHTML=room1Ct.toString();
		room1Lav.setAttribute("lav-count", room1Ct);
		console.log("cap->" + room1Ct + " ->" + r2Cap);
		if ( room2Ct < r2Cap ) {
			console.log("in here");
			room2Lav.classList.remove("badge-danger");
			room2Lav.classList.add("badge-success");
		} else {
			room2Lav.classList.add("badge-danger");
			room2Lav.classList.remove("badge-success");
		}
		room2Lav.innerHTML=room2Ct.toString();
		room2Lav.setAttribute("lav-count", room2Ct);
	}
	
	static inStudentToTable(studentId,atTime,transitId,roomName) {
		var room;
		if ( roomName != null ) {
			room = Controller.roomList.get(roomName);
		} else {
			room =  Controller.roomList.get(ViewBuilder.getLocation());
		}
		var s = Controller.studentsList.get(parseInt(studentId));
//		ViewBuilder.checkRoomCapacity(s.gender);
		
		var tab = document.getElementById("ci-rows");
		var tr = document.createElement("tr");
		tr.setAttribute("student",JSON.stringify({studentId:studentId, gender: s.gender, transitId:transitId, roomName: roomName}));
		tab.appendChild(tr);
		var td = document.createElement("td");
		
		td.innerHTML=Controller.studentsList.get(parseInt(studentId)).name + " (" + studentId + ")";
		tr.id = "studentrow-" + transitId;
		console.log("CREATED->" + tr.id  + "<----------------");
		tr.appendChild(td);
		td = document.createElement("td");
		td.innerHTML=new Date(atTime).toLocaleTimeString('en-US');
		tr.appendChild(td);
		
		td = document.createElement("td");
		td.innerHTML="";
		td.id="outcol-" + studentId;
		tr.appendChild(td);

		if ( Controller.isDualRoom() ) {
			td = document.createElement("td");
			td.id="roomcol-" + transitId;
			
			var l = document.createElement("label");
			l.id = "roomcollabel-" + transitId;
			l.innerHTML=room.id;
			td.appendChild(l);
			
			var flipRoomIcon = document.createElement("i");
			flipRoomIcon.id = "flip-room-" + studentId;
			flipRoomIcon.classList.add("disableStyle");
			flipRoomIcon.addEventListener("click",Controller.sendFlipRoomFunc);
			flipRoomIcon.setAttribute("studentId",studentId);
			flipRoomIcon.setAttribute("transitId",transitId);
			td.appendChild(flipRoomIcon);
			flipRoomIcon.classList.add("fa","fa-refresh","ml-3","pitTooltip","mr-2");	

			var flipToolTip = document.createElement("p");
			flipToolTip.classList.add("pitTooltipText");
			flipToolTip.textContent="Click to change dual room.";
			flipRoomIcon.appendChild(flipToolTip);	
			
			tr.appendChild(td);
		} else {		
			td = document.createElement("td");
			td.innerHTML= s.gender;
			td.id="gendercol-" + studentId;
			tr.appendChild(td);
		}
		td = document.createElement("td");
		var iNote = document.createElement("input");
		iNote.type="text";
		iNote.id="note-input-" + transitId;
		iNote.addEventListener("change",ViewBuilder.noteChange);
		iNote.setAttribute("studentId",studentId);
		iNote.setAttribute("transitId",transitId);
		td.appendChild(iNote);		
		td.id="note-col-" + transitId;
		tr.appendChild(td);
		
		td = document.createElement("td");
		
		var checkOutIcon = document.createElement("i");
		checkOutIcon.id = "force-out-" + studentId;
		checkOutIcon.addEventListener("click",Controller.sendForceOutFunc);
		checkOutIcon.setAttribute("studentId",studentId);
		checkOutIcon.setAttribute("transitId",transitId);
		td.appendChild(checkOutIcon);
		tr.append(td);
		checkOutIcon.classList.add("fa","fa-shopping-cart","ml-3","pitTooltip","mr-2");	

		var favToolTip = document.createElement("p");
		favToolTip.classList.add("pitTooltipText");
		favToolTip.textContent="Click to force checkout.";
		checkOutIcon.appendChild(favToolTip);		
		ViewBuilder.setRoomCapacity();

	}
	
	static async noteChange(e) {
		var iNote=document.getElementById(e.srcElement.id);
		var note=iNote.value;
		var studentId=iNote.getAttribute("studentId");
		var transitId=iNote.getAttribute("transitId");
		
		Controller.sendNoteUpdate(transitId,studentId,note);
		
	}
	static outStudentToTable(studentId,transitId,atTime) {
		console.log("student->" + studentId + " transit->" + transitId);
		var tab = document.getElementById("ci-out-rows");
		var tr = document.getElementById("studentrow-" + transitId);
		console.log("looking for->" + transitId);
		document.getElementById("force-out-" + studentId).classList.add("d-none");
		var td = document.getElementById("outcol-" + studentId);
		td.innerHTML=new Date(atTime).toLocaleTimeString('en-US');
		tab.appendChild(tr);
		var s = Controller.studentsList.get(parseInt(studentId));
		var sD = tr.getAttribute("student");
		ViewBuilder.setRoomCapacity();
	}
	static async getKeyUpTest(e) {
		if (e.key === "Enter") {
			var id = parseInt(document.getElementById("ci_faculty_id_scan").value);
			var f = Controller.facultyList.get(id);
			var cb= await DataLoader.getRTCurrBlock();
			document.getElementById("ci_curr_block").innerHTML = cb.ABDay + " Day, Block " + cb.block;
		}
    }
	static enterStudentName(e) {
		alert("enter name");
	}
	static enterStudentIdNum(e) {
		console.log("in enterstudentidnum");
		if (e.key === "Enter") {
			var id = parseInt(document.getElementById("ci_students_id_scan").value);
			var f = Controller.studentsList.get(id);
			document.getElementById("ci_students_id").value=f.name;
		}
    }
	static checkCapacityForPreferences() {
		var roomOverCapacity=false;
		var boysAtEl = document.getElementById("boys-at");
		var girlsAtEl = document.getElementById("girls-at");
		var capacity1 = boysAtEl.getAttribute("capacity");
		var count1= boysAtEl.getAttribute("lav-count");
		var capacity2 = girlsAtEl.getAttribute("capacity");
		var count2= girlsAtEl.getAttribute("lav-count");
		console.log("c1->" + capacity1 + " t1->" + count1 + " c2->" + capacity2 + " t2->" + count2);
		if ( count1 >= capacity1 && count2 >= capacity2 ) {
			roomOverCapacity = true;
		}
		return roomOverCapacity;	
	}
	static async getReport(e) {
		var dt=document.getElementById("ci_rep_date");
		var loc=ViewBuilder.getRepLocation();
		var b1=document.getElementById("ci_rep_b1").checked;
		var b2=document.getElementById("ci_rep_b2").checked;
		var blunch=document.getElementById("ci_rep_blunch").checked;
		var b3=document.getElementById("ci_rep_b3").checked;
		var b4=document.getElementById("ci_rep_b4").checked;
		var b5=document.getElementById("ci_rep_b5").checked;
		var binclude=document.getElementById("ci_rep_include_passing").checked;

		var room=Controller.roomList.get(loc);
		if ( room.type == "LAV-DUAL" ) {
			var rep1=await DataLoader.getReportData(dt.value,room.id,b1,b2,blunch,b3,b4,b5,binclude);
			var rep2=await DataLoader.getReportData(dt.value,room.dualRoomId,b1,b2,blunch,b3,b4,b5,binclude);
			var rep=rep1.concat(rep2);
		} else {
			var rep=await DataLoader.getReportData(dt.value,loc,b1,b2,blunch,b3,b4,b5,binclude);
		}
		rep.sort(function(a,b){ return (new Date(a.checkIn) - new Date(b.checkIn)); });
		$('#room-block-rows').empty();
		var tab = document.getElementById("room-block-rows");
				
		
		for (var i=0; i < rep.length; i++ ) {
			console.log("REPORTING->" + JSON.stringify(rep[i]));
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var s = Controller.studentsList.get(parseInt(rep[i].studentId))
			var td = document.createElement("td");
			console.log("STUDENT->" + JSON.stringify(s));
			td.innerHTML=s.name + "(" + s.id + ")";
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=rep[i].block;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=new Date(rep[i].checkIn).toLocaleTimeString('en-US');
			tr.appendChild(td);
			td = document.createElement("td");
			if ( rep[i].checkOut != null ) {
				td.innerHTML=new Date(rep[i].checkOut).toLocaleTimeString('en-US');
			} else {
				td.innerHTML="";
			}
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=s.gender;
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=rep[i].location;
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=rep[i].note;
			tr.appendChild(td);
			
			td = document.createElement("td");
			var u=Controller.facultyList.get(rep[i].byUser);
			if ( u != null ) {
				td.innerHTML=u.name +  "(" + u.id + ")";
			} else {
				td.innerHTML = rep[i].byUser;
			}
			tr.appendChild(td);
		}
	}
	static openScanning() {
		document.getElementById("scan-tab-item").classList.remove("d-none");
	}
	static toggleOutTable(e) {
		document.getElementById("ci-out-area").classList.toggle("d-none");
	}
	static toggleLogs(e) {
		document.getElementById("ci-logs").classList.toggle("d-none");
	}
	static dualRoomSetup() {
		document.getElementById("room1-config-label").innerHTML=Controller.dualRoom.room1;
		document.getElementById("room2-config-label").innerHTML=Controller.dualRoom.room2;
		$('#dualRoomModal').modal('show');
	}
	static clickedRoomDefault(e,room) {
		//it is either room 1 or 2.  no other option.
		// so, if not 2 default to 1.
		if ( room == 2 ) {
			document.getElementById("room1-config-default").checked=false;
			document.getElementById("room2-config-default").checked=true;

		} else {
			document.getElementById("room1-config-default").checked=true;			
			document.getElementById("room2-config-default").checked=false;
		}
	}
	static async dualRoomConfigCancel() {
		await Controller.sendClose();
		$('#dualRoomModal').modal('hide');
		alert("You have been logged out.");
	}
	static async dualRoomConfigContinue() {
		var scanFirst = null;
		var room1El = document.getElementById("room1-config-default")
		var room2El = document.getElementById("room2-config-default")
	
		var capHandleEl=document.getElementById("config-capacity-select");
		var soundEl = document.getElementById("sound-config-default");
		$('#dualRoomModal').modal('hide');
		if ( room1El.checked ) {
			Controller.startWithRoom = 0;
		} else {
			Controller.startWithRoom = 1;
		}
		Controller.capacityHandler = capHandleEl.options[capHandleEl.selectedIndex].value;
		Controller.playSound = soundEl.checked;
		Controller.dualRoom.setScanFirstRoom(Controller.startWithRoom);
	}
}