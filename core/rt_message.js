/*
 * A RTMessage represents the real time message for 
 * exchanges via sockets on the server side.
 * It will be responsible for all content integrity except
 * referential integrity with school data. 
 */


class RTMessage {
	
	static messageFuncs=["signin", "sendMessage","scannedId","scanConfirmIn","scanConfirmOut"];
	
	constructor() {
		this.func=null;
		this.byUser=null;
		this.location=null;
		this.note = null;
		this.studentId = null;
		this.theDateTime = null;
	}

	initialize(message) {
		this.func=message.func;
		this.byUser = message.userName;
		this.userName = message.userName;
		this.location = message.location;
		this.note=message.note;
		this.studentId = message.studentId;
		this.tempUser = message.tempUser;
		this.id = message.id;
//		return this.checkIntegrity();
	}
	initializeScanOut(byUser,location,studentId,theDateTime) {
		this.func = "scanConfirmOut";
		this.byUser = byUser;
		this.location = location;
		this.studentId = studentId;
		this.theDateTime = theDateTime;
	}
	initializeUpdateNote(byUser,location,studentId,theDateTime,note) {
		this.func = "updateNote";
		this.byUser = byUser;
		this.location = location;
		this.studentId = studentId;
		this.note=note;
		this.theDateTime = theDateTime;
	}
	initializeScanIn(byUser,location,studentId,theDateTime) {
		this.func = "scanConfirmIn";
		this.byUser = byUser;
		this.location = location;
		this.studentId = studentId;
		this.theDateTime = theDateTime;
	}
	checkIntegrity() {
		if ( this.func == null ) {
			throw new Error("func not set");
		}
		if ( ! RTMessage.messageFuncs.includes(this.func)) {
			throw new Error("unknown func->" + this.func);
		}
		if ( this.userName == null ) {
			throw new Error("userName is null");
		}
		return true;
	}
}
module.exports = RTMessage;