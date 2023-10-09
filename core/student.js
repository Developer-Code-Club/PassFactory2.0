/*
 * A Student represents the students of the school.
 */
const Schedule =  require('./schedule');
const DataIntegrity =  require('./data_integrity');

class Student {
	
	constructor(aId,aFullName,aFirstName, aLastName,aEmail,aGender,theRawSource) {
		this.id = aId;  //MASK ATTRIBUTE
		this.name = aFullName; //MASK ATTRIBUTE
		this.fName = aFirstName; //MASK ATTRIBUTE
		this.lName = aLastName; //MASK ATTRIBUTE
		this.email = aEmail; //MASK ATTRIBUTE
		this.rawSource=theRawSource; //MASK ATTRIBUTE - HIDE
		this.theSchedule = new Schedule(aId);
		if ( this.id == null || this.id == 0 ) {
			DataIntegrity.addIssue("ERROR","Student","constructor", "Student Contructor adding empty Id for->" + JSON.stringify(this));
		}
		if ( this.name == null ) {
			DataIntegrity.addIssue("ERROR","Student","constructor",  "Student Contructor adding empty name for->" + JSON.stringify(this));
		}	
		if ( this.email == null ) {
			DataIntegrity.addIssue("ERROR", "Student","constructor", "Student Contructor adding empty email for->" + JSON.stringify(this));
		}
		this.gender=aGender;
	}	
	getScheduleBlock(blockName) {
		return this.theSchedule.getBlock(blockName);
	}
	getHomeRoomBlock(aBDay) {
		return this.theSchedule.getBlock(aBDay + "1");
	}
	
}
module.exports = Student;