import dotenv from 'dotenv'
dotenv.config()
import pg from "pg"
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export async function OpenConnection(): Promise<pg.PoolClient> {
    const pool = new pg.Pool({
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: 5432,
        ssl: true
    });
    const client = await pool.connect();
    return client

}

export function CloseConnection(conn: pg.PoolClient) {
    conn.release()
}