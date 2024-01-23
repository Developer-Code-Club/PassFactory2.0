/*
 * The Data Loader main engine that loads data. Its main decision is to 
 * broker between development/test and production.  It abstracts away the 
 * source of the data from the rest of the system. 
 */

const TestDataReader = require('./test_data_reader');
const ProdDataReader = require('./prod_data_reader');
const ProdMode = require('./prod_mode');

class DataLoader {
	
	//returns a map of student objects
	static async getStudentData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getStudentData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getStudentData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getFacultyData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getFacultyData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getFacultyData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}

	static async getRoomData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getRoomData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getRoomData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getCourseData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getCourseData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getCourseData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getMasterScheduleData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getMasterScheduleData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getMasterScheduleData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getPassData(forDate) {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getPassData(forDate);
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getPassData(forDate);
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getStudentBlockData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getStudentBlockData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getStudentBlockData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getABDay(dt) {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getABDay(dt);
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getABDay(dt);
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	/*
	 * below here we are loading data from mysql server.
	 */
	 static async getTransitData() {	
		return await ProdDataReader.getTransitData();
	}
	static async getTransitsByDate() {
		return await ProdDataReader.getTransitsByDate();
	}
	static async addTransitDB(studentId,isOpen,note) {
		return await ProdDataReader.addTransitDB(studentId,isOpen,note);
	}
	static async updateTransitDB(transitId,studentId,isOpen,note) {
		return await ProdDataReader.updateTransitDB(transitId,studentId,isOpen,note);
	}
	//this is a custom method for dual lav's to flip the room of a student checked in.
	static async flipRoomDB(transitId,toRoom,byUserId) {
		return await ProdDataReader.flipRoomDB(transitId,toRoom,byUserId);
	}
	static async addTransitLegDB(transitId,byUserId,locationId,theEvent) {
		return await ProdDataReader.addTransitLegDB(transitId,byUserId,locationId,theEvent);
	}
	static async addTransitAndLegDB(studentId,byUserId,locationId,theEvent,note) {
		return await ProdDataReader.addTransitAndLegDB(studentId,byUserId,locationId,theEvent,note);
	}
	static async closeTransitDB(transitId) {
		return await ProdDataReader.closeTransitDB(transitId);
	}
	static async getReportData(dt,locationId,block1,block2,blockLunch,block3,block4,block5,includePassing) {
		return await ProdDataReader.getReportData(dt,locationId,block1,block2,blockLunch,block3,block4,block5,includePassing);
	}
	static async getOpenTransitCountByRoom() {
		return await ProdDataReader.getOpenTransitCountByRoom();
	}
	static async getOpenTransitsForStudents() {
		return await ProdDataReader.getOpenTransitsForStudents();
	}
	static async getTempUserData() {
		return await ProdDataReader.getTempUserData();
	}
	static async getTempUserData() {
		return await ProdDataReader.getTempUserData();
	}
	static async getRoomInfoData() {
		return await ProdDataReader.getRoomInfoData();
	}
	static async addTempUser(name) {
		return await ProdDataReader.addTempUser(name);
	}
}
module.exports = DataLoader;