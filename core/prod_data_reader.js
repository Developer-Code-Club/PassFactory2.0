const Student = require('./student');
const Faculty = require('./faculty');
const Course = require('./course');
const Room = require('./room');
const BlockCalculator = require('./block_calculator');
const ProdMode = require('./prod_mode');
const Schedule = require('./schedule');
const MasterSchedule = require('./master_schedule');
const Pass = require('./pass');
const Transit = require('./transit');

const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const url = "https://nj-hcrhs.myfollett.com/query/rest/api/";
const DBHandler = require('./db_handler');

class ProdDataReader 
{
	static key = null;
	static tempFacultyId = 9000000;
	static theDBHandler = null;
	
	static async initialize() {
		if ( ProdDataReader.theDBHandler == null ) {
			console.log("IT IS NULL");
			ProdDataReader.theDBHandler = new DBHandler();
			await ProdDataReader.theDBHandler.initialize();
		} 
	}
	static getKey = async () => 
	{
		/* commenting out because running multiple days problem.
		if (this.key != null)
			return this.key;
		*/
		const url = 'https://nj-hcrhs.myfollett.com/oauth/rest/v2.0/auth'
		const data = {
			client_id: 'dailyAbsences',
			client_secret: 'whosOnFirst22!'
		};
		var config = {headers: {'Content-Type': 'application/x-www-form-urlencoded' }};  
		const request = await axios.post(url, qs.stringify(data), config);
		this.key = request.data.access_token;  
		return this.key;
	} //End getKey

  
	static async getData(url,shortName){
console.log("urlll->" + url);
		var secretKey = await ProdDataReader.getKey();
		var options = { headers:{ Authorization: ' Bearer ' + secretKey }};
		try {
			const res = await axios.get(url, options);
//console.log("res->" + (res));
			const d = await res.data;
			if ( ProdMode.persistRefData && shortName != null) {
				fs.writeFileSync("./testdata/" + shortName + ".json",JSON.stringify(d),'utf8');
			}
			if ( shortName == null ) {
				console.log("CALL WITH NULL SHORTNAME->" + url);
			}
console.log("length->" + d.length);
			return d;
		} catch (e) {
			console.log("e.message->" + e.message);
			console.log("ez->" + e.stack);
		}
		return null;
	} //end getData

  
	static async getPassData(forDate)
	{
		var d = forDate;
		var thePasses = new Map();
		var thePasses = new Map();
		console.log("Date is " + d);
		var p =  await ProdDataReader.getData(url + "passes?type=Passes&date=" + d,"pass_data");
		for (var i=0; i < p.length; i++ ) 
		{
			var dt = new Date(d + " " + p[i].fieldA002);
			var pass = new Pass(i+1,parseInt(p[i].student.localId),dt, p[i].comment);
			thePasses.set(i+1, pass);
		}
		return thePasses;
	}	


	static async getStudentData() 
	{
		var theStudents = new Map();
		var std =  await ProdDataReader.getData(url + "students3?status=Active", "student_data");

//		var std = fs.readFileSync('./testdata/students_test.json');
//std = JSON.parse(std);
//console.log("std->" + std);

		for (var i=0; i < std.length; i++ ) 
		{
			//1's are OUT.
			if (std[i].fieldB017 != "1")
			{
				var s=new Student(parseInt(std[i].localId), std[i].nameView, std[i].person.firstName, std[i].person.lastName, std[i].person.email01,std[i].person.genderCode,std[i]);
				theStudents.set(s.id,s);
			} 
		}
		return theStudents;
	}
	
	static async getStudentBlockData()
	{
		var prevId = "";
		var stdSched = new Map();
		var stdCourses = new Array();

		var d = new Date();
		var month = d.getMonth() + 1;
		console.log("month is->" + month);
		var year = d.getFullYear()
		if (month > 6)
		year = year + 1;
console.log("caalling-sched");
		var ss =  await ProdDataReader.getData(url + "stdSched2?year=" + year,"student_block_data");
console.log("LENGTH->" + ss.length + " ->" + year);
		return ss;
	}
  
	static async getFacultyData()
	{
		var theFaculty = new Map();
		var f =  await ProdDataReader.getData(url + "staff2?status=Active", "faculty_data");
		for (var i=0; i < f.length; i++ )
		{  
			var fac = new Faculty(parseInt(f[i].localId), f[i].nameView, f[i].person.firstName, f[i].person.lastName, f[i].person.email01, f[i].departmentCode);
			theFaculty.set(fac.id,fac);
		} 
		return theFaculty;
	}
  
	static async getCourseData() 
	{
		var theCourses = new Map();
		var d = new Date();
		var month = d.getMonth() + 1;
		var year = d.getFullYear() 
		if (month > 6) {
			year = year + 1;
		}
		var c =  await ProdDataReader.getData(url + "course?year=" + year,"course_data");
		
		for (var i=0; i < c.length; i++ ) 
		{
			var crs = new Course(parseInt(c[i].number), c[i].description, c[i].departmentCode,c[i]);
			theCourses.set(crs.id, crs);
		}
		return theCourses;
	}

  
	static async getMasterScheduleData() 
	{
		var d = new Date();
		var month = d.getMonth() + 1;
		//var year = d.getYear() + 1900;
		var year = d.getFullYear() 
		if (month > 6)
			year = year + 1;
		var s =  await ProdDataReader.getData(url + "schedMaster?year=" + year, "master_schedule_data");
		var theSched = new Map();
		for (var i=0; i < s.length; i++ ) {
			var b=new MasterSchedule(s[i].courseView,s[i].primaryRoom.roomNumber, s[i].description, s[i].scheduleDisplay, s[i].termView, s[i].primaryStaff.person.email01,s[i]);
			if ( theSched.has(s[i].courseView) ) {
				//console.log("DUPLICATE COURSE->" + JSON.stringify(s[i]) + "<- and ->" + JSON.stringify(theSched.get(s[i].courseView)));
			} else {
				theSched.set(s[i].courseView, b);
			}
		}
		return theSched;
	}


	static jsonToFile(fName, data)
	{
		fs.writeFile(fName, JSON.stringify(data), 
         function (err) {
             if (err) return console.log(err);
		});
  
	}  

	static async getDayBellSched(d) 
	{
		var db =  await ProdDataReader.getData(url + "daybell?date=" + d, "bell_schedule_data");
	}
	static async getABDay(d)
	{
		var day="";
		console.log("date is " + d);
		var db =  await ProdDataReader.getData(url + "dateToAB?date=" + d,"a_b_day_data");
		console.log("db is " + JSON.stringify(db));

		console.log("schedule day number is " + db[0].scheduleDayNumber);
		switch (db[0].scheduleDayNumber)
		{
			case 1:
				day = "A";
				break;
			case 2:
				day = "B";
				break;
		}
		return(day);
	}
	static async getRoomData()
	{
		var theRooms = new Map();
		var rm =  await ProdDataReader.getData(url + "rooms","room_data");
		for (var i=0; i < rm.length; i++ )
		{
			var r=new Room(rm[i].roomNumber, rm[i].departmentCode, rm[i].roomTypeCode, rm[i].buildingCode, rm[i].fieldC001, rm[i].locationCode, rm[i].maxCapacity);
			theRooms.set(rm[i].roomNumber,r);  
		}
		var ri = await ProdDataReader.getRoomInfoData();
		for ( var i=0; i < ri.length; i++ ) {
			var r = theRooms.get(ri[i].id);
			if ( r == null ) {
				r = new Room(ri[i].id,"","","","","",0);
				console.log("ERROR: Can not find roominfo room->" + JSON.stringify(ri[i]));
				console.log("adding->" + JSON.stringify(r));
			} 
			r.type = ri[i].type;
			r.dual = ri[i].dual;
			r.capacity = ri[i].capacity;
			r.maleCapacity = ri[i].maleCapacity;
			r.femaleCapacity = ri[i].femaleCapacity;
			r.dualRoomId = ri[i].dualRoomId;
			theRooms.set(r.num,r);
		}
		return theRooms;
	}
	static async getTransitData() {
		await ProdDataReader.initialize();
		console.log("in proddatareader.getTransitData");
		var theTransits=new Map();
		//Insert code here to read from mysql server.
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			//await conn.query("START TRANSACTION");
		
			/* DB Code */
			//var sql="Call CreateUser(?,?,?,?,?,?,?,?,?,?,?,?,?,?,@rowkey); select @rowkey";
			var sql="Call GetTransits()";
			var info = await conn.query(sql);
			console.log("GGGGGG->" + JSON.stringify(info));
	
			//await conn.query("COMMIT");

		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			//await conn.query("ROLLBACK");
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return theTransits;
	}
	static async getTransitsByDate() {
		await ProdDataReader.initialize();
		console.log("in proddatareader.getTransitsByDate");
		var theTransits=new Map();
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
		
			/* DB Code */
			var sql="Call GetTransitsByDate(?)";
			var x = new Date();
			var y = x.getFullYear();
			var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
			var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
			var dtStr = y + "-" + m + "-" + d ;	
			console.log("passing Date->" + dtStr);
			var info = await conn.query(sql,[dtStr]);
			info = info[0];
			for ( var i=0; i < info.length; i++ ) {
				console.log("working on->" + JSON.stringify(info[i]));
				var transit = theTransits.get(parseInt(info[i].Id));
				if ( transit == null ) {
					console.log('is null');
					var t = new Transit(info[i].StudentId);
					t.id = info[i].Id;
					t.isOpen = new Boolean(info[i].IsOpen);
					t.addTransitLeg(info[i].LegId,info[i].ByUser,info[i].Location,info[i].Location,info[i].CreateDate);
					theTransits.set(t.id,t);
			console.log("T.isOpen->" + t.isOpen);		
				} else {
					console.log("not null");
					transit.addTransitLeg(info[i].LegId,info[i].ByUser,info[i].Location,info[i].Location,info[i].CreateDate);					
					transit.isOpen = new Boolean(info[i].IsOpen);
					console.log("transit.isopen->" + transit.isOpen);
					theTransits.set(transit.id,transit);
				}
			}
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			//await conn.query("ROLLBACK");
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return theTransits;
	}
	static async getTempUserData() {
		await ProdDataReader.initialize();
		console.log("in proddatareader.getTempUserData");
		//Insert code here to read from mysql server.
		var users=[];
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			var sql="Call GetTempUsers()";
			var info = await conn.query(sql);
			info=info[0];
			var users=[];
			for ( var i=0; i < info.length; i++ ) {
				var id = parseInt(info[i].Id) * (-1);
				users.push({id: id, name: info[i].Name});
			}
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			//await conn.query("ROLLBACK");
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return users;
	}
	static async getRoomInfoData() {
		await ProdDataReader.initialize();
		console.log("in proddatareader.getTempUserData");
			var rooms=[];
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			var sql="Call GetRoomInfo()";
			var info = await conn.query(sql);
			info=info[0];
			for ( var i=0; i < info.length; i++ ) {
				rooms.push({id: info[i].Id, type: info[i].RoomType, dual: info[i].DualRoom, capacity: info[i].Capacity, maleCapacity : info[i].MaleCapacity, femaleCapacity: info[i].FemaleCapacity, dualRoomId: info[i].DualRoomId });
			}
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return rooms;
	}
	static async addTempUser(name) {
		await ProdDataReader.initialize();
		//Insert code here to read from mysql server.
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			await conn.query("START TRANSACTION");
			/* DB Code */
			var sql="Call CreateTempUser(?,@rowkey); select @rowkey";
			var info = await conn.query(sql,[name]);
			var id = info[1][0]["@rowkey"];
			id = parseInt(id)* (-1)
			await conn.query("COMMIT");
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			await conn.query("ROLLBACK");
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		
		return { name: name, id: id };
	}
	static async addTransitDB(studentId,isOpen,note) {
		await ProdDataReader.initialize();
		//Insert code here to read from mysql server.
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			await conn.query("START TRANSACTION");
			/* DB Code */
			var sql="Call CreateTransit(?,?,?,@rowkey); select @rowkey";
			var info = await conn.query(sql,[studentId,isOpen,note]);
			var id = info[1][0]["@rowkey"];
			await conn.query("COMMIT");
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			await conn.query("ROLLBACK");
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return id;
	}
	
	static async updateTransitDB(transitId,studentId,isOpen,note) {
		console.log("UPDATETRANSITDB->" + transitId + " ->" + studentId + " ->" + isOpen + " ->" + note);
		await ProdDataReader.initialize();
		//Insert code here to read from mysql server.
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			await conn.query("START TRANSACTION");
			/* DB Code */
			var sql="Call UpdateTransit(?,?,?,?);";
			var o = isOpen==="true";
			await conn.query(sql,[transitId,studentId,o,note]);
			await conn.query("COMMIT");
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			await conn.query("ROLLBACK");
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return ;
	}
	static async flipRoomDB(transitId,toRoom,byUserId) {
		console.log("flipRoomDB->" + transitId + " ->" + toRoom + " ->" + byUserId);
		await ProdDataReader.initialize();
		//Insert code here to read from mysql server.
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			await conn.query("START TRANSACTION");
			/* DB Code */
			var sql="Call FlipRoomTransitLegs(?,?,?);";
			await conn.query(sql,[transitId,toRoom,byUserId]);
			await conn.query("COMMIT");
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			await conn.query("ROLLBACK");
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return ;
	}
	static async addTransitLegDB(transitId,byUserId,locationId,theEvent) {
		await ProdDataReader.initialize();
		//Insert code here to read from mysql server.
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			await conn.query("START TRANSACTION");
			/* DB Code */
			var sql="Call CreateTransitLeg(?,?,?,?,@rowkey); select @rowkey";
			var info = await conn.query(sql,[transitId,locationId,byUserId,theEvent]);
			var id = info[1][0]["@rowkey"];
			await conn.query("COMMIT");
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			await conn.query("ROLLBACK");
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return id;
	}
	static async getOpenTransitCountByRoom() {	
		var totals=[];
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			/* DB Code */
			var sql="Call GetOpenTransitCountByRoom();";
			var info = await conn.query(sql);
			info = info[0];
			for ( var i=0; i < info.length; i++ ) {
				totals.push({room: info[i].Location, total: info[i].Total});
			}		
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return totals;
	}
	static async getOpenTransitsForStudents() {	
		var totals=[];
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			/* DB Code */
			var sql="Call GetOpenTransitsForStudents();";
			var info = await conn.query(sql);
			info = info[0];
			for ( var i=0; i < info.length; i++ ) {
				totals.push({room: info[i].Location, studentId: info[i].StudentId, transitId: info[i].Id});
			}		
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return totals;
	}
	static async getReportData(dt,locationId,block1,block2,blockLunch,block3,block4,block5,includePassing) {
		
		await ProdDataReader.initialize();
		//Insert code here to read from mysql server.
		var m=new Map();
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			/* DB Code */
			console.log("calling get transits->" + dt + " ->" + locationId);
			var sql="Call GetTransitsReport(?,?);";
			var info = await conn.query(sql,[dt,locationId]);
			info = info[0];
			console.log("xxot->" + JSON.stringify(info));
			for ( var i=0; i < info.length; i++ ) {
				var r = m.get(parseInt(info[i].Id));
				if ( r == null ) {
					console.log("r is null");
					if ( info[i].TheEvent == "checkIn" ) {
						m.set(parseInt(info[i].Id),{id: info[i].Id, studentId: info[i].StudentId, location: info[i].Location, checkIn: new Date(info[i].CreateDate), note: info[i].Note, byUser: info[i].ByUser});
					} else if (info[i].TheEvent == "checkOut" ) {
						m.set(parseInt(info[i].Id),{id: info[i].Id, studentId: info[i].StudentId, location: info[i].Location, checkOut: new Date(info[i].CreateDate), note: info[i].Note, byUser: info[i].ByUser});
					}
				} else {
					console.log("r is NOT NULL ->"  + info[i].TheEvent );
					if ( info[i].TheEvent == "checkIn" ) {
						r.checkIn = new Date(info[i].CreateDate);
						m.set(r.id,r);
					} else if ( info[i].TheEvent == "checkOut"  ) {
						r.checkOut = new Date(info[i].CreateDate);
						m.set(r.id,r);
					} else if ( info[i].TheEvent == "forceOut" ) {
						console.log("it was forceOut");
						r.note = r.note + ";forceOut";
						r.byUser=info[i].ByUser;
						r.checkOut = new Date(info[i].CreateDate);
						m.set(r.id,r);
					} else {
						console.log("DOESNT MATCH ANYTHING");
					}
				}
			}		
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		var ret = Array.from(m.values());
		var filtered = [];
		
		for ( var i=0; i < ret.length; i++ ) {
//			console.log("xxtime->" + ret[i].checkIn.getHours() + " ->" + ret[i].checkIn.getMinutes());
			var bNum = BlockCalculator.checkBlockStdDayPassing(ret[i].checkIn);
			if ( bNum == 0 ) {
				if ( block1 ) { ret[i].block="0";filtered.push(ret[i]); }
			} else if ( bNum == 1 ) {
				if ( block1 ) { ret[i].block="1"; filtered.push(ret[i]); } 
			} else if ( bNum == 1.75 ) {
				if ( (block1 || block2) && includePassing ) { ret[i].block="2 Passing"; filtered.push(ret[i]); }
			} else if ( bNum == 2 ) {
				if ( block2 ) { ret[i].block="2"; filtered.push(ret[i]); }
			} else if ( bNum == 2.5 ) {
				if ( blockLunch ) { ret[i].block="UL"; filtered.push(ret[i]); }
			} else if ( bNum == 3 ) {
				if ( block3 ) { ret[i].block="3"; filtered.push(ret[i]); }
			} else if ( bNum == 3.75 ) {
				if ( (block3 || block4 ) && includePassing ) {ret[i].block="4 Passing";  filtered.push(ret[i]); }
			} else if ( bNum == 4 ) {
				if ( block4 ) { ret[i].block="4"; filtered.push(ret[i]); }
			} else if ( bNum == 5 ) {
				if ( block5 ) { ret[i].block="5"; filtered.push(ret[i]); }
			}
		}
		return filtered;
	}
	static async addTransitAndLegDB(studentId,byUserId,locationId,theEvent,note) {
		await ProdDataReader.initialize();
		//Insert code here to read from mysql server.
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			await conn.query("START TRANSACTION");
			/* DB Code */
			var sql="Call CreateTransit(?,?,?,@rowkey); select @rowkey";
			var info = await conn.query(sql,[studentId,true,note]);
			var id = info[1][0]["@rowkey"];
			
			var sql="Call CreateTransitLeg(?,?,?,?,@rowkey); select @rowkey";
			var info = await conn.query(sql,[id,locationId,byUserId,theEvent]);
			var tid = info[1][0]["@rowkey"];
			
			await conn.query("COMMIT");
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			await conn.query("ROLLBACK");
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return { transitId:id, transitLegId:tid};
	}
	static async closeTransitDB(transitId) {
		await ProdDataReader.initialize();
		//Insert code here to read from mysql server.
		try {
			var conn= await ProdDataReader.theDBHandler.connection();
			await conn.query("START TRANSACTION");
			/* DB Code */
			var sql="Call CloseTransit(?);";
			var info = await conn.query(sql,[transitId]);
			
			await conn.query("COMMIT");
		} catch ( err ) {
			console.log("there was an error->" + err.stack);
			await conn.query("ROLLBACK");
			throw err;
		} finally {
			await ProdDataReader.theDBHandler.releaseit(conn);	
		}
		return;
	}
	static async backwardsLog(transitType,id,name,dt,day,loc,timeIn,timeOut,by,comment) {
console.log("in backwards log");
		const rr = async()=> { 
			var data={ 
				id: id,
				name : name, 
				dt: dt, 
				day: day, 
				loc: loc, 
				timeIn: timeIn, 
				timeOut: timeOut, 
				by: by, 
				comment: comment };
				console.log("sending->" + JSON.stringify(data));
				
			const response = await fetch(ProdMode.backwardsLogUrl +"/" + transitType, {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			});
		}
		await rr();
console.log("pastiit");
	
//	console.log("ret->" + JSON.stringify(ret));
		return;
	}
} //end class ProdDataReader

module.exports = ProdDataReader;

