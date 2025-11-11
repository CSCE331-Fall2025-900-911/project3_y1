import {Pool} from 'pg';

let pool: Pool | undefined;

export function getDbPool() {
    if (!pool) {
        console.log("Creating new database connection pool");
        pool = new Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT) || 5432,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
    }
    return pool;
}
