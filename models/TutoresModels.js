import pool from '../config/db.js';

class Tutor {
    static async findAll() {
        const result = await pool.query('SELECT * FROM tutores');
        return result.rows;
    }

    static async create(data) {
        const { nombre, parentesco, email, telefono } = data;
        const result = await pool.query(
            'INSERT INTO tutores (nombre, parentesco, email, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, parentesco, email, telefono]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM tutores WHERE id = $1', [id]);
        return result.rows[0];
    }
}

export default Tutor;