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
		this.theTransits = await DataLoader.getTransitData();
		
		console.log("this.theTransits.initialize called->" + this.theTransits.constructor.name);
	}
	processMessage(msg) {
		console.log("Processing in TransitHandler->" + JSON.stringify(msg));
		var t = this.theTransits.get(msg.studentId);
		var ret=new RTMessage();
		var dt = new Date();
		if ( t == null ) {
			var tt=new Transit(msg.studentId,null);
			tt.addTransitLeg(0,msg.location,msg.userName,"checkIn",dt);
			tt.setOpen();
			this.theTransits.set(msg.studentId,tt);
			ret.initializeScanIn(msg.userName,msg.location,msg.studentId,dt)
		} else {
			console.log("TTT->" + t.constructor.name);
			if ( t.isTransitOpen() ) {
				t.addTransitLeg(0,msg.location,msg.userName,"checkOut",dt);
				t.setClosed();
				this.theTransits.set(msg.studentId,t);
				ret.initializeScanOut(msg.userName,msg.location,msg.studentId,dt)
				
			} else {
				var tt=new Transit(msg.studentId,null);
				tt.addTransitLeg(0,msg.location,msg.userName,"checkIn",new Date());
				this.theTransits.set(msg.studentId,tt);
				ret.initializeScanIn(msg.userName,msg.location,msg.studentId,dt)
			}	
		}
		console.log("LAV\n" + JSON.stringify(Array.from(this.theTransits)));
		return ret;
	}

}
module.exports = TransitHandler;