import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10,  // Mehr Verbindungen erlauben
    acquireTimeout: 30000, // Timeout auf 30 Sekunden setzen
    waitForConnections: true
});

export default pool;