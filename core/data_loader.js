/*
 * The Data Loader main engine that loads data. Its main decision is to 
 * broker between development/test and production.  It abstracts away the 
 * source of the data from the rest of the system. 
 */

const TestDataReader = require('./test_data_reader');
const ProdDataReader = require('./prod_data_reader');
const ProdMode = require('./prod_mode');

class DataLoader {
	
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
	static async getTempUserData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getTempUserData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getTempUserData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getRoomInfoData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getRoomInfoData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getRoomInfoData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async addTempUser(name) {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.addTempUser(name);
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.addTempUser(name);
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
		 console.log("in data_loader.getTransitData");
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getTransitData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getTransitData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getTransitsByDate() {
		 console.log("in data_loader.getTransitsByDate");
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getTransitsByDate();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getTransitsByDate();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async addTransitDB(studentId,isOpen,note) {
		 console.log("in data_loader.getTransitData");
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.addTransitDB(studentId,isOpen,note);
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.addTransitDB(studentId,isOpen,note);
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async updateTransitDB(transitId,studentId,isOpen,note) {
		 console.log("in data_loader.updateTransitDB");
		if ( ProdMode.isProductionModeTest() ) {
			throw Error("test mode for this not implemented");
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.updateTransitDB(transitId,studentId,isOpen,note);
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async addTransitLegDB(transitId,byUserId,locationId,theEvent) {
		 console.log("in data_loader.getTransitData");
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.addTransitLegDB(transitId,byUserId,locationId,theEvent);
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.addTransitLegDB(transitId,byUserId,locationId,theEvent);
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async addTransitAndLegDB(studentId,byUserId,locationId,theEvent,note) {
		 console.log("in data_loader.getTransitData");
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.addTransitAndLegDB(studentId,byUserId,locationId,theEvent,note);
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.addTransitAndLegDB(studentId,byUserId,locationId,theEvent,note);
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async closeTransitDB(transitId) {
		 console.log("in data_loader.closeTransitDB");
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.closeTransitDB(transitID);
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.closeTransitDB(transitId);
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getReportData(dt,locationId,block1,block2,blockLunch,block3,block4,block5,includePassing) {
		 console.log("in data_loader.getReportData");
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getReportData(dt,locationId,block1,block2,blockLunch,block3,block4,block5,includePassing);
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getReportData(dt,locationId,block1,block2,blockLunch,block3,block4,block5,includePassing);
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
}
module.exports = DataLoader;