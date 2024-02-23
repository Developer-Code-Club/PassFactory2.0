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
			//	console.log("SKIPPING FACULTY->" + JSON.stringify(list[i][1]));
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
		var option = document.querySelector("#" + 'ci_faculty_list' + " option[value='" + inputValue + "']");
		if ( option == null ) { return null; }
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
		document.getElementById("dashboard-tab-item").classList.add("d-none");

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
	
	static inStudentToTable(studentId,atTime,transitId,roomName,ABDay,blockNum,popup) {
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
		
		var l = document.createElement("label");
		td.appendChild(l);
		var student = Controller.studentsList.get(parseInt(studentId));
		l.innerHTML=student.name + " (" + studentId + ")";
		l.classList.add("xpitTooltip");
			
		var xToolTip = document.createElement("p");
		if ( popup ) {
			xToolTip.classList.add("xpitTooltipText2");
		} else {
			xToolTip.classList.add("xpitTooltipText");
		}
		var cont=document.createElement("div"); cont.classList.add("container","m-0","p-0"); xToolTip.appendChild(cont);
		var row=document.createElement("div");  row.classList.add("row","m-0","p-0"); cont.appendChild(row);
		var col1=document.createElement("div"); col1.classList.add("col-sm-6"); row.appendChild(col1);
		var col2=document.createElement("div"); col2.classList.add("col-sm-6"); row.appendChild(col2);

		var d=ViewBuilder.getFromClass(student,ABDay,blockNum);
		col1.appendChild(d);
		
		var img = document.createElement("img");
			img.src = "./images/pictures/students/" + studentId + ".jpg";
			img.classList.add("img-fluid","w-50");
			col2.appendChild(img);
		l.appendChild(xToolTip);	
		
		
		
		
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
		if ( popup ) {
			ViewBuilder.showit(xToolTip);
		}
	}
	static getFromClass(student,ABDay,blockNum) {
		var d=document.createElement("div"); d.classList.add("container");
		
		var aOrb;
		if ( ABDay == "A" ) {
			aOrb=student.theSchedule.ADayBlocks;
		} else if ( ABDay == "B") {
			aOrb=student.theSchedule.BDayBlocks;
		} 
	
		var nameLN = document.createElement("label"); nameLN.classList.add("float-left");
		nameLN.innerHTML= "Name:";
		var nameL = document.createElement("label"); nameL.classList.add("float-left");
		nameL.innerHTML= student.name;
		var row=document.createElement("div"); row.classList.add("row");d.appendChild(row);
		var col1=document.createElement("div"); col1.classList.add("col-sm-4");row.appendChild(col1);
		var col2=document.createElement("div"); col2.classList.add("col-sm-8");row.appendChild(col2);	
		col1.appendChild(nameLN);
		col2.appendChild(nameL);
		
		if ( aOrb ) {
			if ( blockNum == 1 || blockNum == 2 || blockNum == 3 || blockNum == 4 ) {
				var blockLN = document.createElement("label");  blockLN.classList.add("float-left");
				blockLN.innerHTML = "Block:";
		
				var blockL = document.createElement("label");  blockL.classList.add("float-left");
				blockL.innerHTML = aOrb[blockNum].scheduleDisplay;
	
				var row=document.createElement("div"); row.classList.add("row");d.appendChild(row);
				var col1=document.createElement("div"); col1.classList.add("col-sm-4");row.appendChild(col1);
				var col2=document.createElement("div"); col2.classList.add("col-sm-8");row.appendChild(col2);		
				col1.appendChild(blockLN);
				col2.appendChild(blockL);
		
				
				var roomLN = document.createElement("label"); roomLN.classList.add("float-left");
				roomLN.innerHTML = "Room:";
				var roomL = document.createElement("label"); roomL.classList.add("float-left");
				roomL.innerHTML = aOrb[blockNum].room;
				var row=document.createElement("div"); row.classList.add("row");d.appendChild(row);
				var col1=document.createElement("div"); col1.classList.add("col-sm-4");row.appendChild(col1);
				var col2=document.createElement("div"); col2.classList.add("col-sm-8");row.appendChild(col2);		
				col1.appendChild(roomLN);
				col2.appendChild(roomL);
				
				var classLN = document.createElement("label"); classLN.classList.add("float-left");
				classLN.innerHTML = "Class:";
				var classL = document.createElement("label"); classL.classList.add("float-left");
				classL.innerHTML = aOrb[blockNum].description;
				var row=document.createElement("div"); row.classList.add("row");d.appendChild(row);
				var col1=document.createElement("div"); col1.classList.add("col-sm-4");row.appendChild(col1);
				var col2=document.createElement("div"); col2.classList.add("col-sm-8");row.appendChild(col2);		
				col1.appendChild(classLN);
				col2.appendChild(classL);

				var teacherLN = document.createElement("label"); teacherLN.classList.add("float-left");
				teacherLN.innerHTML = "Teacher:";
				var teacherL = document.createElement("label"); teacherL.classList.add("float-left");
				teacherL.innerHTML = aOrb[blockNum].rawSource.primaryStaff.nameView;
				var row=document.createElement("div"); row.classList.add("row");d.appendChild(row);
				var col1=document.createElement("div"); col1.classList.add("col-sm-4");row.appendChild(col1);
				var col2=document.createElement("div"); col2.classList.add("col-sm-8");row.appendChild(col2);		
				col1.appendChild(teacherLN);
				col2.appendChild(teacherL);
				
				
			} else if ( blockNum == 2.5 ) {
				var classLN = document.createElement("label");classLN.classList.add("float-left");
				classLN.innerHTML = "Class:";
				var classL = document.createElement("label");classL.classList.add("float-left");
				classL.innerHTML = "Lunch";
				var row=document.createElement("div"); row.classList.add("row");d.appendChild(row);
				var col1=document.createElement("div"); col1.classList.add("col-sm-4");row.appendChild(col1);
				var col2=document.createElement("div"); col2.classList.add("col-sm-8");row.appendChild(col2);		
				col1.appendChild(classLN);
				col2.appendChild(classL);
			} else {
				var classLN = document.createElement("label");classLN.classList.add("float-left");
				classLN.innerHTML = "Class:";
				var classL = document.createElement("label");classL.classList.add("float-left");
				classL.innerHTML = "Non Class Time";
				var row=document.createElement("div"); row.classList.add("row");d.appendChild(row);
				var col1=document.createElement("div"); col1.classList.add("col-sm-4");row.appendChild(col1);
				var col2=document.createElement("div"); col2.classList.add("col-sm-8");row.appendChild(col2);		
				col1.appendChild(classLN);
				col2.appendChild(classL);
			}	
		} else {
			var classLN = document.createElement("label");classLN.classList.add("float-left");
			classLN.innerHTML = "Class:";
			var classL = document.createElement("label");classL.classList.add("float-left");
			classL.innerHTML = "No Other Info";				
			var row=document.createElement("div"); row.classList.add("row");d.appendChild(row);
			var col1=document.createElement("div"); col1.classList.add("col-sm-4");row.appendChild(col1);
			var col2=document.createElement("div"); col2.classList.add("col-sm-8");row.appendChild(col2);		
			col1.appendChild(classLN);
			col2.appendChild(classL);			
		}	
		
		return d;
	}
	static async showit(el) {
		const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
		await sleep(2000);
		el.classList.remove("xpitTooltipText2");
		el.classList.add("xpitTooltipText");
	}
	static async blinkCell(elementId, count) {
		console.log("blinking->" + elementId);
		const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
		var el = document.getElementById(elementId);
		for ( var i=1; i <= count; i++ ){
			console.log("blink on");
			el.classList.remove("dashboard-blink-off");
			el.classList.add("dashboard-blink-on");
			await sleep(1500);
			console.log("blink off");
			el.classList.add("dashboard-blink-off");
			el.classList.remove("dashboard-blink-on");
			await sleep(1500);
		}
	}
	static async showStudentDetails(studentId) {
		const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
		var l = document.getElementById("details-area");
		l.innerHTML=studentId;
//		var n = document.getElementById("popupStudent");
		
//		var c = n.cloneNode();
//		var dt = Date.now();
//		dt="";
//		c.id = "popupStudent2" + dt;
//		console.log("c->" + c.id);
//		await document.getElementById("student-modal-home").appendChild(c);
//		$('#popupStudent').modal("show");
		await sleep(4000);
		l.innerHTML="clear";
//		$('#popupStudent').modal("hide");
//		c.parentNode.removeChild(c);
	}

		
	/*
	 * facultyList is an array of faculty users signed in for lav.
	 */
	static setUpDashboard(row) {

		//mcole - this function works on rows.  So, I changed this to see if the row was there.
		var findRow = document.getElementById("dashrow-" + hashCode(row.num) );
		if ( findRow != null ) {
			var oldData = JSON.parse(findRow.getAttribute("row"));
			if ( oldData.maleCount != row.maleCount ) {

				var pill = document.getElementById("dashrow-" + hashCode(row.num) + "-mo");
				
				if(row.maleCount >= row.maleCapacity){
					pill.classList.add("badge", "badge-pill", "badge-danger", "px-3", "ml-2", "mt-2");	
				}
				else{
					pill.classList.add("badge", "badge-pill", "badge-success", "px-3", "ml-2", "mt-2")
				}

				// pill.innerHTML = row.maleCount + "(" + row.maleCapacity + ")";
				pill.innerHTML = row.maleCount;

				// var td = document.getElementById("dashrow-" + hashCode(row.num) + "-mo");
				// td.innerHTML= row.maleCount + "(" + row.maleCapacity + ")";

				ViewBuilder.blinkCell(td.id, 2);
			}
			if ( oldData.femaleCount != row.femaleCount ) {
				// var td = document.getElementById("dashrow-" + hashCode(row.num) + "-fo");
				// td.innerHTML= row.femaleCount + "(" + row.femaleCapacity + ")";
				ViewBuilder.blinkCell(td.id, 2);

				var pill = document.getElementById("dashrow-" + hashCode(row.num) + "-fo");
				
				if(row.femaleCount >= row.femaleCapacity){
					pill.classList.add("badge", "badge-pill", "badge-danger", "px-3", "ml-2", "mt-2");	
				}
				else{
					pill.classList.add("badge", "badge-pill", "badge-success", "px-3", "ml-2", "mt-2")
				}

				//pill.innerHTML= row.femaleCount + "(" + row.femaleCapacity + ")";
				pill.innerHTML = row.femaleCount;
			}
			if ( JSON.stringify(oldData.users) != JSON.stringify(row.users) ) {
				var td = document.getElementById("dashrow-" + hashCode(row.num) + "-users");
				if ( row.users == null || row.users.length == 0 ) {
					td.innerHTML = "Noone Signed In";
				} else {
					var fNames = "";
					for ( var ii=0; ii < row.users.length; ii++ ) {
						var nameAt = Controller.facultyList.get(row.users[ii]);
						if ( ii > 0 ) { fNames += "\n"; }
						fNames += nameAt.name;
					}
					td.innerHTML = fNames;
					ViewBuilder.blinkCell(td.id, 3);
				}
			}
		//row did not exist we are creating it.
		} else {
			//mcole - This is the table for the dashboard.
			var tab = document.getElementById("dashboard-tablebody");
			findRow = document.createElement("tr");
			findRow.setAttribute("row",JSON.stringify(row));
			//mcole - this is the uniqueID for the row.  This is important.
			findRow.id = "dashrow-" + hashCode(row.num) ;
			tab.appendChild(findRow);

			var td = document.createElement("td");
			td.innerHTML=row.num;
			findRow.appendChild(td);
			
			td = document.createElement("td");
			td.id = "dashrow-" + hashCode(row.num) + "-users";
			if ( row.users == null || row.users.length == 0 ) {
				td.innerHTML = "Noone Signed In";
			} else {
				var fNames = "";
				for ( var ii=0; ii < row.users.length; ii++ ) {
					var nameAt = Controller.facultyList.get(row.users[ii]);
					if ( ii > 0 ) { fNames += "\n"; }
					fNames += nameAt.name;
				}		
				td.innerHTML = fNames;
			}
			findRow.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML = row.maleCount + "(" + row.maleCapacity + ")" ;
			//mcole - this is the male occupancy column id.
			td.id = "dashrow-" + hashCode(row.num) + "-mo";
			findRow.appendChild(td);


			td = document.createElement("td");
			td.innerHTML = row.femaleCount + "(" + row.femaleCapacity + ")";
			//mcole - this is the female occupancy column id.
			td.id = "dashrow-" + hashCode(row.num) + "-fo";
			findRow.appendChild(td);
		}

	}
	//
	static async buildDashboard(rooms) {
		var dashboardCardAreaEl=document.getElementById("dashboard-card-area");
		var row;
		if ( dashboardCardAreaEl.children.length == 0 ) {
		
			for (var i=0; i < rooms.length; i++ )  {
				if ( i % 4 == 0 ) {
					row = document.createElement("div"); row.classList.add("row","m-2");
					dashboardCardAreaEl.appendChild(row);
				}
				var col=document.createElement("div"); col.classList.add("col-sm-3");
				row.appendChild(col);
				var el=ViewBuilder.buildDashboardCard(rooms[i]);
				col.appendChild(el);
			}
		} else {
			for (var i=0; i < rooms.length; i++ )  {
				ViewBuilder.updateDashboardCard(rooms[i]);
			}
		}
	}
	static buildDashboardCard(row) {
		// the card element
		var card = document.createElement("div");
		card.classList.add("card", "shadow", "mb-4", "bg-white", "rounded-lg");
		card.id = "dashboard-card-" + hashCode(row.num);
		card.setAttribute("row", JSON.stringify(row));

		// card header 
		var cardHeader = document.createElement("div");
		cardHeader.classList.add("card-header", "text-white", "text-center", "py-2"); //"rounded-top"
		cardHeader.classList.add(row.users == null || row.users.length == 0 ? "bg-danger" : "bg-success");
		cardHeader.innerHTML = `<strong>` + row.num + `</strong>`;
		cardHeader.style.borderTopLeftRadius = "20px";
		cardHeader.style.borderTopRightRadius = "20px";

		card.appendChild(cardHeader);

		var cardBody = document.createElement("div");
		cardBody.id = "dashboard-textbody-"+hashCode(row.num);
		cardBody.classList.add("card-body", "p-4", "text-center");
		card.appendChild(cardBody);

		// user info section
		var userInfoSection = document.createElement("div");
		userInfoSection.classList.add("user-info-section", "mb-3");
		cardBody.appendChild(userInfoSection);

		// user list 
		var userListLabel = document.createElement("h5");
		userListLabel.classList.add("mb-2", "text-dark");
		userListLabel.innerHTML = "Signed In:";
		userInfoSection.appendChild(userListLabel);

		var userList = document.createElement("p");
		userList.classList.add("text-muted", "mb-0", "fw-bold");
		var userListContent = "";
		if (row.users == null || row.users.length == 0) {
			userListContent = "Empty";
		} else {
			var nameAt = Controller.facultyList.get(row.users[0]);
			userListContent += `${nameAt.name} (${nameAt.id})`;
		}
		userList.innerHTML = userListContent;
		userInfoSection.appendChild(userList);

		// Displaying user image 
		var userImageContainer = document.createElement("div");
		userImageContainer.classList.add("user-image-container", "my-3");
		var userImage = document.createElement("img");
		
		var imgPlaceholder = "./images/pictures/staff/placeholder.jpg";


		if(row.users.length && Controller.haveFacultyPicture("./images/pictures/staff/" + Controller.facultyList.get(row.users[0]).id + ".jpg")){
			userImage.src = "./images/pictures/staff/" + Controller.facultyList.get(row.users[0]).id + ".jpg";
		}
		else{
			userImage.src = imgPlaceholder;
		}

		userImage.classList.add("img-thumbnail", "rounded-circle");
		userImage.style.width = "100px";
		userImage.style.height = "110px";
		userImageContainer.appendChild(userImage);
		userInfoSection.appendChild(userImageContainer);
		userImageContainer.style.display = row.users == null || row.users.length == 0 ? "none" : "block";


		var countSection = document.createElement("div");
		countSection.classList.add("count-section", "d-flex", "justify-content-around", "mt-3");
		cardBody.appendChild(countSection);

		//male count
		var isDual = (row.type=='LAV-DUAL');
		var maleCount = document.createElement("div");
		maleCount.innerHTML = !isDual
			? `<i class="fa fa-male text-primary" style="padding-right:5px; font-size:1.5em;"></i> <span class="badge ${row.maleCount >= row.maleCapacity ? 'badge-danger' : 'badge-success'} rounded-pill py-2 px-4" style="color:white; font-size: 1em;">${row.maleCount}</span>`
			: `<i class="text-secondary" style="padding-right:5px; font-size:1em;">Lav</i> <span class="badge ${row.maleCount >= row.maleCapacity ? 'badge-danger' : 'badge-success'} rounded-pill py-2 px-4" style="color:white; font-size: 1em;">${row.maleCount}</span>`;

		maleCount.classList.add("male-count", "d-flex", "align-items-center");
		maleCount.setAttribute("data-toggle", "tooltip");
		maleCount.setAttribute("data-placement", "bottom");
		!isDual ? maleCount.setAttribute("title", "Male Count:") : maleCount.setAttribute("title", "Dual Count:");
		countSection.appendChild(maleCount);

		// female count 
		var femaleCount = document.createElement("div");
		femaleCount.innerHTML = !isDual 
			? `<i class="fa fa-female text-danger" style= "padding-right:5px; font-size:1.5em"></i> <span class="badge ${row.femaleCount >= row.femaleCapacity ? 'badge-danger' : 'badge-success'} rounded-pill py-2 px-4" style="color:white; font-size: 1em;">${row.femaleCount}</span>`
			: `<i class="text-secondary" style= "padding-right:5px; font-size:1em">Lav</i> <span class="badge ${row.femaleCount >= row.femaleCapacity ? 'badge-danger' : 'badge-success'} rounded-pill py-2 px-4" style="color:white; font-size: 1em;">${row.femaleCount}</span>`;
		femaleCount.classList.add("female-count", "d-flex", "align-items-center");
		femaleCount.setAttribute("data-toggle", "tooltip");
		femaleCount.setAttribute("data-placement", "bottom");
		!isDual ? femaleCount.setAttribute("title", "Female Count:") : femaleCount.setAttribute("title", "Dual Count:");
		countSection.appendChild(femaleCount);

		// needed for popover
		var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
		var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl);
		});

		return card;
	}

	static updateDashboardCard(row) {
		var card = document.getElementById("dashboard-card-" + hashCode(row.num));
		var cardbody = document.getElementById("dashboard-textbody-"+hashCode(row.num));
		var oldRow = JSON.parse(card.getAttribute("row"));
	
		// update the card header color based on user sign-in status
		var cardHeader = card.querySelector(".card-header");
		cardHeader.classList.toggle("bg-danger", row.users == null || row.users.length == 0);
		cardHeader.classList.toggle("bg-success", !(row.users == null || row.users.length == 0));
		
		// update user list content
		var userList = card.querySelector(".user-info-section > p");
		var userListContent = "";
		if (row.users == null || row.users.length == 0) {
			userListContent = "Empty";
		} else {
			var nameAt = Controller.facultyList.get(row.users[0]);
			userListContent += `${nameAt.name} (${nameAt.id})`;
		}
		userList.innerHTML = userListContent;
	
		// update the user image and its visibility
		var userImageContainer = card.querySelector(".user-image-container");
		var userImage = userImageContainer.querySelector("img");
		var imgPlaceholder = "./images/pictures/staff/placeholder.jpg";


		if(row.users.length && Controller.haveFacultyPicture("./images/pictures/staff/" + Controller.facultyList.get(row.users[0]).id + ".jpg")){
			userImage.src = "./images/pictures/staff/" + Controller.facultyList.get(row.users[0]).id + ".jpg";
		}
		else{
			userImage.src = imgPlaceholder;
		}

		//userImage.src = "./images/pictures/staff/" + (row.users.length ? nameAt.id : 'placeholder') + ".jpg";
		userImageContainer.style.display = row.users == null || row.users.length == 0 ? "none" : "block";
		
		// update male count
		var maleCountBadge = card.querySelector(".male-count > span");
		maleCountBadge.innerHTML = row.maleCount;
		maleCountBadge.classList.toggle("bg-danger", row.maleCount >= row.maleCapacity);
		maleCountBadge.classList.toggle("bg-success", row.maleCount < row.maleCapacity);
		
		// update female count
		var femaleCountBadge = card.querySelector(".female-count > span");
		femaleCountBadge.innerHTML = row.femaleCount;
		femaleCountBadge.classList.toggle("bg-danger", row.femaleCount >= row.femaleCapacity);
		femaleCountBadge.classList.toggle("bg-success", row.femaleCount < row.femaleCapacity);
	
		if (JSON.stringify(row) !== card.getAttribute("row")) {
			ViewBuilder.blinkCell(cardbody.id, 2);
			card.setAttribute("row", JSON.stringify(row)); // Update the row attribute with the new data
		}
	}
	
	static async noteChange(e) {
		var iNote=document.getElementById(e.srcElement.id);
		var note=iNote.value;
		var studentId=iNote.getAttribute("studentId");
		var transitId=iNote.getAttribute("transitId");
		
		Controller.sendNoteUpdate(transitId,studentId,note);
		
	}
	static async updateNoteMsgReceived(transitId, note) {
		console.log("t->" + transitId + " ->" + note);
		var ntEl = document.getElementById("note-input-" + transitId);
		ntEl.value = note ;
	}
	static async flipRoomMsgReceived(transitId, room) {
		console.log("tr->" + transitId + " ->" + room);
		var rmEl = document.getElementById("roomcollabel-" + transitId);
		console.log("rmel->" + rmEl);
		rmEl.innerHTML = room;
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
	static toggleDashboard(e) {
		document.getElementById("ci-dash-status").classList.toggle("d-none");
	}
	static dualRoomSetup() {
		document.getElementById("room1-config-label").innerHTML=Controller.dualRoom.room1;
		document.getElementById("room2-config-label").innerHTML=Controller.dualRoom.room2;
console.log("HACK FIX LATER");
//mcole - not sure why not working or why being called.
//		$('#dualRoomModal').modal('show');
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

	static addLocation(num, f, m, cap, user, status) {
		alert("addlocation");
		var b = document.getElementById("tablebody");
		var tr = document.createElement('tr');
		tr.className = 'align-middle';
		tr.id = num;
		var td = document.createElement('td');
		td.innerHTML = num;
		tr.appendChild(td);
		td = document.createElement('td');
		td.innerHTML = f;
		tr.appendChild(td);
		td = document.createElement('td');
		td.innerHTML = m;
		tr.appendChild(td);
		td = document.createElement('td');
		td.innerHTML = cap;
		tr.appendChild(td);
		td = document.createElement('td');
		td.innerHTML = user;
		tr.appendChild(td);
		td = document.createElement('td');
		var span = document.createElement('span');
		if(status == "Active") {
			span.className = 'badge fs-6 fw-normal bg-tint-success text-success';
		} else {
			span.className = 'badge fs-6 fw-normal bg-tint-danger text-danger';
		}
		span.innerHTML = status;
		td.appendChild(span);
		tr.appendChild(td);
		b.appendChild(tr);
	}

	static clearDashboard() {
		alert("clearDashboard");
		// var table = document.getElementById('tablebody');
		// table.innerHTML = "";
	}

	static newSignIn(name, location) {
		alert("newSignIn");
		var tr = document.getElementById(location);
		var r = tr.cells[4];
		var s = tr.cells[5].children;
		if(r.innerHTML == name) {
			ViewBuilder.removeUser(location);
		} else {
			r.innerHTML = name;
			s[0].className = 'badge fs-6 fw-normal bg-tint-danger text-danger';
			s[0].innerHTML = "Active"
		}
	}

	static removeUser(location) {
		var tr = document.getElementById(location);
		tr.cells[4].innerHTML = "None";
		var s = tr.cells[5].children;
		s[0].className = 'badge fs-6 fw-normal bg-tint-danger text-danger';
		s[0].innerHTML = "Empty";
	}

	static dbScanIn(location, n, scan) {
		alert("dbScanIn");
		//Controller.refreshDashboard();
		var tr = document.getElementById(location);
		console.log(n);
		var cell = n == "M" ? 2 : 1;
		console.log(cell);
		var count = parseInt(tr.cells[cell].innerHTML);
		if(scan) {
			tr.cells[cell].innerHTML = count+=1;
		} else {
			tr.cells[cell].innerHTML = count-=1;
		}
	}
}
hashCode = function(s) {
	console.log("hasing->" + s);
  return s.split("").reduce(function(a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
}