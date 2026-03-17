import pool from './config/db.js';

async function diagnostico() {
    try {
        console.log('--- DIAGNÓSTICO DE BASE DE DATOS ---');
        
        // 1. Verificar si la columna existe
        const colCheck = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='especialistas' AND column_name='session_token'
        `);
        
        if (colCheck.rowCount === 0) {
            console.log('❌ La columna session_token NO EXISTE.');
        } else {
            console.log('✅ La columna session_token EXISTE.');
        }

        // 2. Verificar especialistas existentes
        const users = await pool.query('SELECT id, nombre, email, session_token FROM especialistas');
        console.log(`👤 Usuarios encontrados: ${users.rowCount}`);
        users.rows.forEach(u => {
            console.log(` - ID: ${u.id}, Email: ${u.email}, SessionToken: ${u.session_token || 'NULL'}`);
        });

        console.log('--- FIN DEL DIAGNÓSTICO ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error en el diagnóstico:', err);
        process.exit(1);
    }
}

diagnostico();
