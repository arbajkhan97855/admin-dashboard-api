const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATA_BASE,
    port: 4000,
    ssl: {
        rejectUnauthorized: false 
    },
    connectTimeout: 20000, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log(`Connected to TiDB Cloud: ${process.env.DATA_BASE}`);
        connection.release();
    }
});

module.exports = db;

// local ke liye
// const mysql = require("mysql2")
// require("dotenv/config")

// const db = mysql.createConnection({
//     host : process.env.HOST,
//     user : process.env.USER,
//     password : process.env.PASSWORD,
//     database : process.env.DATA_BASE
// })

// const connect = db.connect((err)=>{
//     if(err) throw err
//     console.log(`connect mysql ${process.env.DATA_BASE} databse`)
// })

// module.exports = db
