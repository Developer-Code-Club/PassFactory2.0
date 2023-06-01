/*
 * A Transit represents tracked movement around campus.
 * Initially it will be the mechanism to hold a transaction
 * of a student checking in and out of a restroom.
 */
const TransitLeg = require('./transit_leg');

class Transit {
	
	constructor(id) {
		this.id=id;
//		this.theStudent=student;
		this.isOpen=false;
		this.theTransitLegs=[];   //we may want to change this to a map later.
	}
	setOpen() {
		this.isOpen = true;
	}
	setClosed() { 
		this.isOpen = false;
	}
	isTransitOpen() { 
		return this.isOpen;
	}
	addTransitLeg(inId,byUserId,inLocationId,inEvent,inDateTime) {
		var tl = new TransitLeg(inId,byUserId,inLocationId,inEvent,inDateTime);
		this.theTransitLegs.push(tl);
	}
	
}
module.exports = Transit;