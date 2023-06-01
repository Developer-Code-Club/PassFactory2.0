/*
 * A TransitLeg represents a leg of a student moving
 * from place A to place B and back on campus.
 */


class TransitLeg {
	
	constructor(id,byUser,inLocation,inEvent,inDateTime) {
		this.id=id;
		this.theLocation=inLocation;
		this.byUser = byUser;
		this.theEvent=inEvent;
		this.theDateTime = inDateTime;
	}	
}
module.exports = TransitLeg;