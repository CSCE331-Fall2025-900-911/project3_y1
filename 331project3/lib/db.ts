<<<<<<< HEAD
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;
=======
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
>>>>>>> fb035af4120f109e3822c9b8a1cbed8e808ddce8
