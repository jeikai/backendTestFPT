const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'funplay',
    waitForConnections: true,
    connectionLimit: 10, // Giới hạn số kết nối đồng thời
    queueLimit: 0
});

module.exports = pool;
