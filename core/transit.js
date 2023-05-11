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
	addTransitLeg(inId,inLocation,byUser,inEvent,inDateTime) {
		var tl = new TransitLeg(inId,inLocation,byUser,inEvent,inDateTime);
		this.theTransitLegs.push(tl);
	}
	hello() {
		console.log("hello");
	}
	
}
module.exports = Transit;