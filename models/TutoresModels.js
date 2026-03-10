import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

class Tutor {
        static async buscarPorUsuarioOCorreo(usuario) {
        const query = 'SELECT * FROM tutores WHERE email = $1 OR telefono = $1';
        const { rows } = await pool.query(query, [usuario]);
        return rows[0];
    }
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

    static async update(id, data) {
        const { nombre, parentesco, email, telefono } = data;
        const result = await pool.query(
            'UPDATE tutores SET nombre = $1, parentesco = $2, email = $3, telefono = $4 WHERE id = $5 RETURNING *',
            [nombre, parentesco, email, telefono, id]
        );
        return result.rows[0];
    }
}

export default Tutor;