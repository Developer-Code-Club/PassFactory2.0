/*
 * The DBHandler is the container for managing database connections and queries.  
 */

const mysql = require("mysql2");
 
/*
  var connection_prod = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'passit'
});*/
 var connection_prod = mysql.createConnection({
    host     : '192.168.11.121',
    user     : 'passu',
    password : 'passu',
    database : 'passit'
});

    class DBHandler {

    constructor() {
        this.thePool = "";
        this.host = "192.168.11.121";
        this.user="passu";
        this.password="passu";
        this.database="passit";
    }
    initialize() {
        console.log("initialized db");
        this.thePool = mysql.createPool({
            connectionLimit : 10,
            host     : this.host,
            user     : this.user,
            password : this.password,
            database : this.database,
            idleTimeout: 60,
            multipleStatements : true
        });
        console.log("past pool");
    }
    connection() {
        DBcounter ++;
        if ( DBcounter > 5 ) {
             console.log("WARNING: dbconn counter->" + DBcounter);
        }
        return new Promise((resolve, reject) => {
        this.thePool.getConnection((err, connection) => {
            if (err) reject(err);
            /*
            connection.on('error', function(err) {
            console.log("DB CONNECTION ERROR->" + JSON.stringify(err));
            }); */
            const query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    connection.query(sql, binding, (err, result) => {
                        if (err) reject(err);
                            resolve(result);
                    });
                });
            };
            const release = () => {
                return new Promise((resolve, reject) => {
                if (err) reject(err);
                resolve(connection.release());
                });
            };
            resolve({ query, release });
            });
        });
    };
    async releaseit( conn ) {
        DBcounter--;
        if ( DBcounter > 5 ) {
            console.log("WARNING: releasing->" + DBcounter);
        }
        conn.release();
    }

}
 var DBcounter=0;
 module.exports = DBHandler;