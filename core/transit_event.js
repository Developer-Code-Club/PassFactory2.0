/*
 * A TransitEvent represents an specific event that someone
 * is executing.  You will usually find this as an event associated
 * with a transit leg.
 */


class TransitEvent {
	
	static Event = {
		CheckIn : 0,
		CheckOut: 1
	};
	
	constructor() {
		this.id=null;
	}	
	setCheckIn() {
		this.id=Event.CheckIn;
	}
	setCheckOut() {
		this.id=Event.CheckOut;
	}
}
module.exports = TransitEvent;