import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function check() {
    try {
        const t = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tutores';");
        console.log('TUTORES_COLUMNS:', JSON.stringify(t.rows, null, 2));
    } catch (e) { console.error(e); }
    finally { pool.end(); }
}
check();
