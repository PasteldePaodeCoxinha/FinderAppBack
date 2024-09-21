require('dotenv').config({ path: "../env" });
const { Pool } = require('pg');
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

async function OpenConnection() {
    const pool = new Pool({
        host: PGHOST,
        database: PGDATABASE,
        username: PGUSER,
        password: PGPASSWORD,
        port: 5432,
        ssl: {
            require: true,
        },
    });
    const client = await pool.connect();
    return client

}

function CloseConnection(conn) {
    conn.release()
}

module.exports = { OpenConnection, CloseConnection }