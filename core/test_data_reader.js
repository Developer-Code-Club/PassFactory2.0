/*
 * The test data reader simulates a database or rest server reader
 * abstracting the user from file to json structure.
 * Notice all methods are static.  It is intended to be
 * somewhat of a singleton model.
 */
const fs   = require('fs');
const Student = require('./student');
const Faculty = require('./faculty');
const Course = require('./course');
const Block = require('./block');
const Pass = require('./pass');
const Room = require('./room');
const ProdDataReader = require('./prod_data_reader');
const MasterSchedule = require('./master_schedule');


class TestDataReader {	
	
	/* This method returns a Map of students.
	 * It is static so you can call without an instance of the
	 * class.  It returns a Map where the index is the student id and 
	 * the data is a student object.
	 */
	 
	//done
	static async getStudentData() 
	{
		var theStudents = new Map();
		var std = fs.readFileSync('./testdata/student_data.json');
		std=JSON.parse(std);
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
	
	//done
	static async getFacultyData()
	{
		var theFaculty = new Map();
		var f = fs.readFileSync('./testdata/faculty_data.json');
		f=JSON.parse(f);
		for (var i=0; i < f.length; i++ )
		{  
			var fac = new Faculty(parseInt(f[i].localId), f[i].nameView, f[i].person.firstName, f[i].person.lastName, f[i].person.email01, f[i].departmentCode);
			theFaculty.set(fac.id,fac);
		} 
		return theFaculty;
	}
	//done
	static async getCourseData() 
	{
		var theCourses = new Map();
		var d = new Date();
		var month = d.getMonth() + 1;
		var year = d.getFullYear() 
		if (month > 6) {
			year = year + 1;
		}
		var c = fs.readFileSync('./testdata/course_data.json');
		c=JSON.parse(c);
		for (var i=0; i < c.length; i++ ) 
		{
			var crs = new Course(parseInt(c[i].number), c[i].description, c[i].departmentCode,c[i]);
			theCourses.set(crs.id, crs);
		}
		return theCourses;
	}
	
	//not done.
	static getBlockData() {
		var blockRaw = fs.readFileSync('./testdata/blocks.json');
		blockRaw=JSON.parse(blockRaw);
		var theBlocks = new Map();
		var blocks = JSON.parse(blockRaw);
		for (var i=0; i < blocks.length; i++ ) {
			var b = new Block(parseInt(blocks[i].id), blocks[i].room, 
				blocks[i].blockNum,blocks[i].day,blocks[i].courseId,blocks[i].teacherId,blocks[i].students);
			theBlocks.set(b.id,b);
		}
		console.log("loaded theBlocks->" + JSON.stringify(Array.from(theBlocks)));
		return theBlocks;
	}
	

	//done
	static async getPassData(forDate)
	{
		var d = forDate;
		var thePasses = new Map();
		var thePasses = new Map();
		console.log("Date is " + d);
		var p = fs.readFileSync('./testdata/pass_data.json');
		p=JSON.parse(p);		
		for (var i=0; i < p.length; i++ ) 
		{
			var dt = new Date(d + " " + p[i].fieldA002);
			var pass = new Pass(i+1,parseInt(p[i].student.localId),dt, p[i].comment);
			thePasses.set(i+1, pass);
		}
		return thePasses;
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
		var ss = fs.readFileSync('./testdata/student_block_data.json');
		ss=JSON.parse(ss);
		return ss;
	}
	static async getMasterScheduleData() 
	{
		var d = new Date();
		var month = d.getMonth() + 1;
		//var year = d.getYear() + 1900;
		var year = d.getFullYear() 
		if (month > 6)
			year = year + 1;
		var s = fs.readFileSync('./testdata/master_schedule_data.json');
		s=JSON.parse(s);
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
	static async getDayBellSched(d) 
	{
		var db = fs.readFileSync('./testdata/bell_schedule_data.json');
		db=JSON.parse(db);
	}
	static async getABDay(d)
	{
		var day="";
		console.log("date is " + d);
		var db = fs.readFileSync('./testdata/a_b_day_data.json');
		db=JSON.parse(db);
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
		var rm = fs.readFileSync('./testdata/room_data.json');
		rm=JSON.parse(rm);
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
}
module.exports = TestDataReader;
