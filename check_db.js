import pool from './config/db.js';

async function check() {
    try {
        const t = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tutores';");
        console.log('TUTORES:', t.rows);
        const p = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pacientes';");
        console.log('PACIENTES:', p.rows);
    } catch (e) { console.error(e); }
    finally { pool.end(); }
}
check();
