/*
 * A Transit Handler holds the collection of transit transactions.
 */
const DataLoader = require('./data_loader');
const Transit = require('./transit');
const RTMessage = require('./rt_message');


class TransitHandler {

	constructor() {
		this.theTransits=null;			//theTransits is a map keyed by TransitId
	}

	async initialize() {
		console.log("in transithandler.intiitalize");
		this.theTransits = await DataLoader.getTransitsByDate();
		console.log("TheTransits->"  + this.theTransits.size);
		var ta = Array.from(this.theTransits);
		for ( var i=0; i < ta.length; i++ ) {
			console.log("ta[i][1]->" + JSON.stringify(ta[i][1]));
			if ( ta[i][1].isOpen ) { 
				console.log("is iopen");
			} else {
				console.log("NOTOPEN");
			}
		}
	}
	async addTransit(studentId,byUserId,locationId,theEvent,note) {
		var tt=new Transit(studentId);
		var id= await DataLoader.addTransitDB(studentId,true,note);
		tt.id = id;
		var tid= await DataLoader.addTransitLegDB(id,locationId,byUserId,theEvent);
		tt.addTransitLeg(tid,locationId,byUserId,theEvent,new Date());
		tt.setOpen();
		this.theTransits.set(tt.id,tt);
		return tt.id;
	}
	async addTransitAndLeg(studentId,byUserId,locationId,theEvent,note) {
		var ids= await DataLoader.addTransitAndLegDB(studentId,byUserId,locationId,theEvent,note);
		var tt=new Transit(studentId);
		tt.id = ids.transitId;
		tt.addTransitLeg(ids.transitLegId,locationId,byUserId,theEvent,new Date());
		tt.setOpen();
		this.theTransits.set(tt.id,tt);
		return tt.id;
	}
	async addTransitLeg(transit,byUserId,locationId,theEvent) {
		var id= await DataLoader.addTransitLegDB(transit.id,byUserId,locationId,theEvent);
		transit.addTransitLeg(id,byUserId,locationId,theEvent,new Date());
		transit.setClosed();
		await DataLoader.closeTransitDB(transit.id);
		this.theTransits.set(transit.id,transit);
	}
	//look
	async processMessage(msg) {
		console.log("Processing in TransitHandler->" + JSON.stringify(msg));
		var t;
		if ( msg.studentId == null || msg.location == null ) {
			throw new Error("Bad msg-> " + JSON.stringify(msg));
		}
		if ( msg.id == null ) {
			console.log("id is new transit.");
		} else { 
		console.log("not null");
			t = this.theTransits.get(msg.id);
		}
		console.log("got TRANSIT->" + JSON.stringify(t));
		var ret=new RTMessage();
		var dt = new Date();
		if ( t == null ) {
			var id = await this.addTransitAndLeg(msg.studentId,msg.userName,msg.location,"checkIn",msg.note);
			ret.initializeScanIn(msg.userName,msg.location,msg.studentId,dt);
			ret.id = id;
		} else {
			console.log("TTT->" + JSON.stringify(t));
			if ( t.isTransitOpen() ) {
				await this.addTransitLeg(t,msg.userName,msg.location,"checkOut",msg.note);
				ret.initializeScanOut(msg.id,msg.userName,msg.location,msg.studentId,dt)
				
			} else {
				var id = await this.addTransitAndLeg(msg.studentId,msg.userName,msg.location,"checkIn",msg.note);
				ret.initializeScanIn(msg.userName,msg.location,msg.studentId,dt);
				ret.id = id;
			}	
		}
//		console.log("LAV\n" + JSON.stringify(Array.from(this.theTransits)));
		return ret;
	}
	async forceOut(msg) {
		console.log("Processing in forceOut->" + JSON.stringify(msg));
		var t = this.theTransits.get(parseInt(msg.id));
		var ret=new RTMessage();
		var dt = new Date();
		if ( t == null ) {
			console.log("ERROR: can not force out, does not exist->" + JSON.stringify(msg));
		} else {
			console.log("TTT->" + JSON.stringify(t));
//			if ( t.isTransitOpen() ) {
				console.log("it was open");
				await this.addTransitLeg(t,msg.userName,msg.location,"forceOut");
				ret.initializeScanOut(msg.id,msg.userName,msg.location,msg.studentId,dt)	
//			}
		}
//		console.log("LAV\n" + JSON.stringify(Array.from(this.theTransits)));
		return ret;
	}
	// special methor for dual room features.  user can flip room the student scanned into.
	async flipRoom(msg) {
		console.log("Processing in flipRoom->" + JSON.stringify(msg));
		var t = this.theTransits.get(parseInt(msg.id));
		var ret=new RTMessage();
		if ( t == null ) {
			console.log("ERROR: can not flip room transit does not exist->" + JSON.stringify(msg));
		} else {
			await DataLoader.flipRoomDB(msg.id,msg.location,msg.byUser);
			t.location = msg.location;
			this.theTransits.set(t.id,t);
			console.log("GOOD: Flipped->" + JSON.stringify(msg));
			ret.initializeFlipRoom(msg.id,msg.location,msg.byUser);
		}
		return ret;
	}
	async updateNote(msg) {
		console.log("Processing in updateNotes->" + JSON.stringify(msg));
		var t = this.theTransits.get(parseInt(msg.id));
		var ret=new RTMessage();
		if ( t == null ) {
			console.log("ERROR: can not update notes, does not exist->" + JSON.stringify(msg));
		} else {
			await DataLoader.updateTransitDB(msg.id,t.studentId,t.isOpen,msg.note);
			console.log("GOOD:  Update Notes->" + JSON.stringify(msg));
			ret.initializeUpdateNote(msg.id,msg.userName,msg.location,msg.studentId,msg.note)	
		}
		return ret;
	}
}
module.exports = TransitHandler;