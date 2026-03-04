import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

class Especialista {
    static async findAll() {
        const result = await pool.query(
            `SELECT id, nombre, email, especialidad_principal, rol_id, estado_activo,
                    telefono, cedula_profesional, cedula_verificada
             FROM especialistas
             ORDER BY id ASC`
        );
        return result.rows;
    }

    static async create(data) {
        const { nombre, email, password, especialidad_principal, rol_id, cedula_profesional, cedula_verificada } = data;

        // Cifrado en reposo: Hash de la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            'INSERT INTO especialistas (nombre, email, password, especialidad_principal, rol_id, cedula_profesional, cedula_verificada) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nombre, email, especialidad_principal, rol_id, estado_activo, cedula_profesional, cedula_verificada',
            [nombre, email, hashedPassword, especialidad_principal, rol_id, cedula_profesional || null, cedula_verificada || false]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query('SELECT id, nombre, email, especialidad_principal, rol_id, estado_activo, cedula_profesional, cedula_verificada FROM especialistas WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async findByEmailForAuth(email) {
        // Obtenemos la contraseña enhasheada para la verificación de autenticación
        const result = await pool.query('SELECT * FROM especialistas WHERE email = $1 AND estado_activo = TRUE', [email]);
        return result.rows[0];
    }

    static async update(id, data) {
        const { nombre, email, especialidad_principal, rol_id, cedula_profesional, cedula_verificada } = data;
        const result = await pool.query(
            'UPDATE especialistas SET nombre = $1, email = $2, especialidad_principal = $3, rol_id = $4, cedula_profesional = $5, cedula_verificada = $6 WHERE id = $7 RETURNING id, nombre, email, especialidad_principal, rol_id, estado_activo, cedula_profesional, cedula_verificada',
            [nombre, email, especialidad_principal, rol_id, cedula_profesional || null, cedula_verificada || false, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query(
            'UPDATE especialistas SET estado_activo = FALSE WHERE id = $1 RETURNING id, nombre, email, especialidad_principal, rol_id, estado_activo',
            [id]
        );
        return result.rows[0];
    }
}

export default Especialista;
