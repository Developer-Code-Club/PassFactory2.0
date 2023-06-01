/*
 * A Transit Handler holds the collection of transit transactions.
 */
const DataLoader = require('./data_loader');
const Transit = require('./transit');
const RTMessage = require('./rt_message');


class TransitHandler {

	constructor() {
		this.theTransits=null;	
	}

	async initialize() {
		console.log("in transithandler.intiitalize");
		this.theTransits = await DataLoader.getTransitData();
		
		console.log("this.theTransits.initialize xxxxcalled->" + this.theTransits.constructor.name);
	}
	async addTransit(studentId,byUserId,locationId,theEvent) {
		var tt=new Transit(studentId,null);
		var id= await DataLoader.addTransitDB(studentId,true);
		tt.id = id;
		var tid= await DataLoader.addTransitLegDB(id,locationId,byUserId,theEvent);
		tt.addTransitLeg(tid,locationId,byUserId,theEvent,new Date());
		tt.setOpen();
		this.theTransits.set(studentId,tt);
	}
	async addTransitAndLeg(studentId,byUserId,locationId,theEvent) {
		var ids= await DataLoader.addTransitAndLegDB(studentId,byUserId,locationId,theEvent);
		var tt=new Transit(studentId,null);
		tt.id = ids.transitId;
		tt.addTransitLeg(ids.transitLegId,locationId,byUserId,theEvent,new Date());
		tt.setOpen();
		this.theTransits.set(studentId,tt);
	}
	async addTransitLeg(transit,byUserId,locationId,theEvent) {
		var id= await DataLoader.addTransitLegDB(transit.id,byUserId,locationId,theEvent);
		transit.addTransitLeg(id,byUserId,locationId,theEvent,new Date());
		transit.setClosed();
		await DataLoader.closeTransitDB(transit.id);
		this.theTransits.set(transit.studentId,transit);	
	}
	processMessage(msg) {
		console.log("Processing in TransitHandler->" + JSON.stringify(msg));
		var t = this.theTransits.get(msg.studentId);
		var ret=new RTMessage();
		var dt = new Date();
		if ( t == null ) {
			this.addTransitAndLeg(msg.studentId,msg.userName,msg.location,"checkIn");
			ret.initializeScanIn(msg.userName,msg.location,msg.studentId,dt)
		} else {
			console.log("TTT->" + JSON.stringify(t));
			if ( t.isTransitOpen() ) {
				this.addTransitLeg(t,msg.userName,msg.location,"checkOut");
				ret.initializeScanOut(msg.userName,msg.location,msg.studentId,dt)
				
			} else {
				this.addTransitAndLeg(msg.studentId,msg.userName,msg.location,"checkIn");
				ret.initializeScanIn(msg.userName,msg.location,msg.studentId,dt)
			}	
		}
		console.log("LAV\n" + JSON.stringify(Array.from(this.theTransits)));
		return ret;
	}
}
module.exports = TransitHandler;