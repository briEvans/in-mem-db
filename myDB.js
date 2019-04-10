const clone = require('clone');

module.exports = class myDB  {
  constructor () {

    // Data
    this.data = [{}];
    // Current Transaction index
    this.tIndex = 0;
    // Transaction Mode indicator
    this.transactionMode = false;

    // BASIC FUNCTIONS

   /* {@func} count - Returns the number of names that have the given value
    * assigned to them. If that value is not assigned anywhere, return 0
    * @params {String} value the unique identifier for the db search
    * @return {Number} the number of names tht have the given value
    */
    this.count = function (value) {
    	let count = 0;

    	if (value) {
	    	for (let property in this.data[this.tIndex]) {
	    		if (this.data[this.tIndex].hasOwnProperty(property)) {
		    		if (property && (this.data[this.tIndex][property] === value)) {
		    			count++;
		    		}
	    		}
	    	}
    	}

    	return count;
    };

   /* {@func} Deletes the value from the database.
    * @params {String} name the unique identifier for the db lookup
    */
    this.delete = function (name) {
    	if (name) {
    		if (this.data[this.tIndex][name]) {
	    		delete this.data[this.tIndex][name];
	    	}
    	}
    };

   /* {@func} get - Returns the value for the given name. 
    * If the value is not in the database, prints N ULL
    * @params name the unique identifier for the db lookup
    * @return {Object} the value for the given name
    */
    this.get = function (name) {
    	let elem = null;

    	if (name) {
		    elem = this.data[this.tIndex][name];
		}
     	return elem ? elem : null;
    };

   /* {@func} set - Sets the name in the database to the given value
    * @params {String} name the unique identifier for the entry
    * @params {String} value the value for the given entry
    */
    this.set = function (name, value) {
    	// let dataSet = this.data[this.tIndex];

    	if (!this.data[this.tIndex]) {
    		this.data[this.tIndex] = {};
    	}
    	if ( name && name.length > 0) {
	    	this.data[this.tIndex][name] = value || null;
	    }
    };

    // TRANSACTION FUNCTIONS 

   /* {@func} begin - Begins a new transaction. Turns off auto-commit
    */
    this.begin = function () {
    	if (!this.transactionMode) {
    		this.transactionMode = true;
    	}
    	// Make sure stage and and main are in sync
    	this.data[this.tIndex+1] = clone(this.data[this.tIndex]);
    	this.tIndex++;
    }; 

	/* {@func} commit - Commit all of the open transactions. Turns on auto-commit
    */
    this.commit = function () {
    	if (this.tIndex === 0) {
    		this.transactionMode = false;
    	}
    	if (this.tIndex > 0) {
	    	// Sync Data from transaction
	    	this.data[this.tIndex-1] = clone(this.data[this.tIndex]);
	    	// Clear out the transaction data
	    	this.data[this.tIndex] = {};
	    	// Point to earlier version of data
	    	this.tIndex--;
    	}
    };
    
	/* {@func} rollback - Rolls back the most recent transaction.
    * @return {Number} the new transaction index
    */
    this.rollback = function () {
    	if (this.tIndex === 0) {
    		return -1;
    	}
    	if (this.transactionMode) {
    		this.data[this.tIndex] = {};
    		 this.tIndex--;
    	}
    	return this.tIndex;
    }

	/* {@func} manageState - Auxilary function to manage state between
	* transactionMode(auto-commit-off) and regular(auto-commit-on) mode
    */
    this.manageState = function () {
	    if (!this.transactionMode) {
			// commit immediately
			this.data[0] = clone(this.data[this.tIndex]);
		}
    }
  }

};