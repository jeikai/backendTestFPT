const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: '172.17.0.1',
    user: 'root',
    password: '123456',
    database: 'funbug',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
