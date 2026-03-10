import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

async function migrate_tutores() {
    try {
        await pool.query('ALTER TABLE tutores ADD COLUMN password VARCHAR(255);');
        console.log('Migración exitosa: columna password agregada a tutores.');
    } catch (e) {
        if (e.code === '42701') {
            console.log('La columna password ya existia en tutores');
        } else {
            console.error('Error en la migración:', e);
        }
    } finally {
        pool.end();
    }
}
migrate_tutores();
