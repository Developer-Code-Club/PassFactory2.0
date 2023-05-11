/**
 * A Transaction represents a specific transaction to a location on campus.
 */

const DataIntegrity =  require('./data_integrity');

class Transaction {

    /**
     * LEGS ARRAY
     * STUDENT ID
    */
    constructor(aLocation, aStudentID) {
        this.location = aLocation;
        this.studentID = parseInt(aStudentID);
        this.legs = [new Leg("IN", aLocation, new Date(Date.now)), new Leg("OUT", aLocation, new Date(Date.now))]; 
        this.isComplete = () => { 
            var result = false;
            this.legs.forEach(leg => result = result && leg.isComplete);
            return result;
         }
        if ( this.studentID == null || this.studentID == 0 ) {
            DataIntegrity.addIssue("ERROR","Location","constructor","Location Contructor adding empty StudentID for->" + JSON.stringify(this));
        }
        if ( this.location == null ) {
            DataIntegrity.addIssue("ERROR", "Location","constructor","Location Contructor adding empty location for->" + JSON.stringify(this));
        }		
    }

    getLocation() {
		return this.location;
	}
    getStudentID() {
        return this.studentID;
    }
    
    
    
}