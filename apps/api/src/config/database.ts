import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sasm_db',
    password: process.env.DB_PASSWORD || 'Zed1929@!@!',
    port: Number(process.env.DB_PORT) || 5432,
});

pool.on('connect', () => {
    console.log('Database connected successfully to SASM-IS PostgreSQL!');
});

export default pool;
