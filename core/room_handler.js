/*
 * A Room Handler represents a collection of the locations in the school.
 */
const Room = require('./room');
const DataLoader = require('./data_loader');

class RoomHandler {

	constructor() {
		this.theRooms=null;	
	}

	async initialize() {
		this.theRooms = await DataLoader.getRoomData();
		console.log("THEROOMS->" + JSON.stringify(Array.from(this.theRooms)));
	}

}
module.exports = RoomHandler;
