/**
 * A Location represent a specific instance of a location on campus.
 * A location is a room or a hallway, that is either open or closed, has a capacity, and occupants.
 */

const DataIntegrity =  require('./data_integrity');

class Location {

    constructor(aRoom,aName,aCapacity,aOpen) {
        this.room = parseInt(aRoom);
        this.name = aName;
        this.capacity = parseInt(aCapacity);
        this.open = Boolean(aOpen);
        if ( this.room == null || this.room == 0 ) {
            DataIntegrity.addIssue("ERROR","Location","constructor","Location Contructor adding empty Room for->" + JSON.stringify(this));
        }
        if ( this.name == null ) {
            DataIntegrity.addIssue("ERROR", "Location","constructor","Location Contructor adding empty name for->" + JSON.stringify(this));
        }		
    }	
    
}