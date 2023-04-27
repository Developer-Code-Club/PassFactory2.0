const DataIntegrity =  require('./data_integrity');

class Transaction {

    constructor(aLocation, aStudentID) {
        this.location = aLocation;
        this.studentID = parseInt(aStudentID);
        if ( this.studentID == null || this.studentID == 0 ) {
            DataIntegrity.addIssue("ERROR","Location","constructor","Location Contructor adding empty StudentID for->" + JSON.stringify(this));
        }
        if ( this.location == null ) {
            DataIntegrity.addIssue("ERROR", "Location","constructor","Location Contructor adding empty location for->" + JSON.stringify(this));
        }		
    }	
    
}