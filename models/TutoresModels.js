import pool from '../config/db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

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
static async buscarPorUsuarioOCorreo(usuario) {
        const query = 'SELECT * FROM tutores WHERE email = $1 OR telefono::text = $1';
        const { rows } = await pool.query(query, [usuario]);
        return rows[0];
    }
    static async create(data) {
        const { nombre, parentesco, email, telefono, password } = data;
        // Hashear la contraseña con bcrypt
        const plainPassword = password || 'temporal123';
        const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        const result = await pool.query(
            'INSERT INTO tutores (nombre, parentesco, email, telefono, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, parentesco, email, telefono, hashedPassword]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM tutores WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, data) {
        const { nombre, parentesco, email, telefono, password } = data;
        // Solo actualizar password si se proporciona, hasheando con bcrypt
        if (password) {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const result = await pool.query(
                'UPDATE tutores SET nombre = $1, parentesco = $2, email = $3, telefono = $4, password = $5 WHERE id = $6 RETURNING *',
                [nombre, parentesco, email, telefono, hashedPassword, id]
            );
            return result.rows[0];
        }
        const result = await pool.query(
            'UPDATE tutores SET nombre = $1, parentesco = $2, email = $3, telefono = $4 WHERE id = $5 RETURNING *',
            [nombre, parentesco, email, telefono, id]
        );
        return result.rows[0];
    }
}

export default Tutor;