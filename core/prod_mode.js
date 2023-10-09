/*
 * This is a class that the PassFactory constructs to setup the 
 * environment we are running in.  Test/Production at first.
 * Any class can use the static methods to determine envorinment.
 * This is very important for loading data at least.
 */


class ProdMode {
	
	constructor() {
		var productionMode = process.env.PRODUCTION_MODE;
		console.log("Production Mode Environment Variable = " + productionMode);
		if ( productionMode != undefined ) {
			if ( productionMode.toUpperCase() == "TEST") {
				ProdMode.setProductionModeTest();
			} else if ( productionMode == "PROD" ) {
				ProdMode.setProductionModeProd();
			} else {
				throw new Error("Production Mode set to unknown value->" + productionMode);
			}
		}
		//PERSIST_REF_DATA will make a copy of the data read from aspen
		var persistRefData = process.env.PERSIST_REF_DATA;  
		console.log("Persist Ref Data Environment Variable = " + persistRefData);
		if ( persistRefData != null ) {
			if ( persistRefData.toUpperCase() == "Y" ||  persistRefData.toUpperCase() == "YES"  ) {
				ProdMode.persistRefData = true;
			} else {
				ProdMode.persitRefData = false;
			}
		}
	}	
	
	/*
	 * These statics are used to enable a mode for production.
	 * Code anywhere can ask the ProdMode if we are running in 
	 * production or test mode.  If running in test mode, it will
	 * use masked data. If running in prod mode, it will use 
	 * production data.  The use of static methods hides users from knowing
	 * "TEST" vs "PROD" strings.
	 */
	static productionMode = "TEST";
	static persistRefData = false;
	
	static setProductionModeTest() {
		ProdMode.productionMode="TEST";
	}
	static setProductionModeProd() {
		ProdMode.productionMode="PROD";
	}
		
	static isProductionModeTest() {
		if ( ProdMode.productionMode == "TEST" ) {
			return true;
		}
		return false;
	}
	static isProductionModeProd() {
		if ( ProdMode.productionMode == "PROD" ) {
			return true;
		}
		return false;
	}
}
module.exports = ProdMode;