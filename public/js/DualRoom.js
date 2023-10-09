/*
 * The DualRoom class is the container and controller for dual room data features.
 */
 
class DualRoom {
	
	constructor(room1,room2) {
		this.room1 = room1;
		var r1=Controller.roomList.get(room1);
		this.room1Capacity=r1.capacity;
		var r2=Controller.roomList.get(room2);
		this.room2 = room2;
		this.room2Capacity=r2.capacity;
		this.scanFirst=room1; 		
	}
	setScanFirstRoom(r) {
		if ( r == 1 ) {
			this.scanFirst = this.room2;
		} 
		this.scanFirst = this.room1;
	}
	getNextRoom(r1CurrCap, r2CurrCap,forceInRoom) {
		console.log("in getNExtroom " + r1CurrCap + " ->" + r2CurrCap + " ->" + forceInRoom);
		//if both are < capacity return the scanFirst room. 
		if ( r1CurrCap < this.room1Capacity && r2CurrCap < this.room2Capacity ) {
			return this.scanFirst;
		}
		//if room 1 is at or above capacity and room 2 < then room2.
		if ( r1CurrCap >= this.room1Capacity && r2CurrCap < this.room2Capacity ) {
			return this.room2;
		}
		//if room 2 is at or above capacity and room 1 > then room 1.
		if (r2CurrCap >= this.room2Capacity && r1CurrCap < this.room1Capacity ) {
			return this.room1;
		}
		// rooms are full, return room less over capacity.
		if ( forceInRoom ) {
			if ( (this.room1Capacity - r1CurrCap) > (this.room2Capacity - r2CurrCap) ) {
				return this.room1;
			} else {
				return this.room2;
			}
		}
		return null; //this is not good.
	
	}
	setScanFirstRoom1() {
		this.scanFirst=room1;
	}
	setScanFirstRoom2() {
		this.scanFirst=room2;
	}
	
	//This assumes boys at is the first room.
	isAtFirstRoom() {
		console.log("COMPARING->" + this.roomAt + " ->" + this.room1);
		if ( this.roomAt == this.room1 ) {
			return true;
		}
		return false;
	}
}