import pool from './config/db.js';

async function checkEspecialistas() {
    try {
        const result = await pool.query('SELECT id, email, password, estado_activo FROM especialistas');
        console.log('Usuarios en BD:', result.rows);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        pool.end();
    }
}

checkEspecialistas();
