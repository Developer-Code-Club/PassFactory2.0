/*
 * The DataLoader is a client side communication to the
 * server for data.
 */
 
class DataLoader {
	
	constructor() {
		
	}
	
	async initializeData(forDate) {	
		const rr = async()=> { 
			var data={ "forDate" : forDate };
			const response = await fetch('/initialize_data', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async getStudentData() {	
		const rr = async()=> { 
			const response = await fetch('/get_student_data', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async getStudentBlockNames() {
		const rr = async()=> { 
			const response = await fetch('/get_student_block_names', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async getPasses() {
		const rr = async()=> { 
			const response = await fetch('/get_passes', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async getDecoratedPasses() {
		const rr = async()=> { 
			const response = await fetch('/get_decorated_passes', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async emailPasses(forDate) {	
		const rr = async()=> { 
			var data={ "forDate" : forDate };
			const response = await fetch('/email_passes', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async emailTestPasses() {	
		const rr = async()=> { 
			const response = await fetch('/email_test_passes', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async getRTFacultyList() {	
		const rr = async()=> { 
			const response = await fetch('/get_rt_faculty', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async getRTRoomsList() {	
		const rr = async()=> { 
			const response = await fetch('/get_rt_room_info', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	
	async getRTStudentsList() {	
		const rr = async()=> { 
			const response = await fetch('/get_rt_students', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		
		return ret;
	}
	async getRTTempUserList() {	
		const rr = async()=> { 
			const response = await fetch('/get_rt_temp_users', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	static async addRTTempUser(name) {	
		var data={ "name" : name };
		const rr = async()=> { 
			const response = await fetch('/add_rt_temp_user', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	static async getRTCurrBlock() {	
	console.log("calling getRTCurrBlock");
		const rr = async()=> { 
			const response = await fetch('/get_rt_curr_block', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		console.log("got->" + JSON.stringify(ret));
		return ret;
	}
	static async getReportData(dt,loc,block1,block2,blockLunch,block3,block4,block5,includePassing) {	
		const rr = async()=> { 
			var p={ repDate:dt, location: loc, block1:block1, block2:block2, lunch:blockLunch, block3:block3, block4:block4, block5:block5, includePassing:includePassing};
			const response = await fetch('/get_report_data', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(p)
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		console.log("got->" + JSON.stringify(ret));
		return ret;
	}
	static async initializePostLogin(dt,loc) {	
		const rr = async()=> { 
			var p={ repDate:dt, location: loc, block1:true, block2:true, lunch:true, block3:true, block4:true, block5:true, includePassing:true};
			const response = await fetch('/get_report_data', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(p)
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		console.log("got->" + JSON.stringify(ret));
		return ret;
	}
}
