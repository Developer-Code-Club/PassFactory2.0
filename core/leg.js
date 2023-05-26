/**
 * A Leg represents a specific part of a transaction.
 */

const DataIntegrity = require('./data_integrity');

class Leg {
    /**
     * EVENT TYPE
     * LOCATION
     * TIMESTAMP
     */

    constructor(aEventType, aLocation, aTimeStamp) {
        this.eventType = aEventType;
        this.location = aLocation;
        this.timeStamp = aTimeStamp;
        this.isComplete = false;
    }

    Complete() {
        this.isComplete = true;
        this.timeStamp = new Date(Date.now);
    }
}

module.exports = Leg;