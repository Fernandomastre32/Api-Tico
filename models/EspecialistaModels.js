import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

class Especialista {
    static async findAll() {
        const result = await pool.query(
            `SELECT id, nombre, email, especialidad_principal, rol_id, estado_activo,
                    telefono, cedula_profesional, cedula_verificada, 
                    firma_url, horario_atencion, preferencia_modo_oscuro, preferencia_idioma,
                    foto_url, biografia, fecha_nacimiento,
                    (session_token IS NOT NULL) AS en_linea
             FROM especialistas
             ORDER BY id ASC`
        );
        return result.rows;
    }

    static async buscarPorUsuarioOCorreo(usuario) {
        const query = 'SELECT * FROM especialistas WHERE email = $1 OR nombre = $1';
        const { rows } = await pool.query(query, [usuario]);
        return rows[0];
    }

    static async create(data) {
        const { nombre, email, password, especialidad_principal, rol_id, cedula_profesional, cedula_verificada, telefono, firma_url, horario_atencion, preferencia_modo_oscuro, preferencia_idioma, foto_url, biografia, fecha_nacimiento } = data;

        // Cifrado en reposo: Hash de la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            'INSERT INTO especialistas (nombre, email, password, especialidad_principal, rol_id, cedula_profesional, cedula_verificada, telefono, firma_url, horario_atencion, preferencia_modo_oscuro, preferencia_idioma, foto_url, biografia, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id, nombre, email, especialidad_principal, rol_id, estado_activo, cedula_profesional, cedula_verificada, telefono, firma_url, horario_atencion, preferencia_modo_oscuro, preferencia_idioma, foto_url, biografia, fecha_nacimiento',
            [nombre, email, hashedPassword, especialidad_principal, rol_id, cedula_profesional || null, cedula_verificada || false, telefono || null, firma_url || null, horario_atencion || null, preferencia_modo_oscuro || false, preferencia_idioma || 'es', foto_url || null, biografia || null, fecha_nacimiento || null]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query('SELECT id, nombre, email, especialidad_principal, rol_id, estado_activo, telefono, cedula_profesional, cedula_verificada, firma_url, horario_atencion, preferencia_modo_oscuro, preferencia_idioma, foto_url, biografia, fecha_nacimiento FROM especialistas WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async findByEmailForAuth(email) {
        // Obtenemos la contraseña enhasheada para la verificación de autenticación
        const result = await pool.query('SELECT * FROM especialistas WHERE email = $1 AND estado_activo = TRUE', [email]);
        return result.rows[0];
    }

    static async update(id, data) {
        const { nombre, email, especialidad_principal, rol_id, cedula_profesional, cedula_verificada, estado_activo, telefono, firma_url, horario_atencion, preferencia_modo_oscuro, preferencia_idioma, foto_url, biografia, fecha_nacimiento } = data;

        let queryStr = 'UPDATE especialistas SET nombre = $1, email = $2, especialidad_principal = $3, rol_id = $4, cedula_profesional = $5, cedula_verificada = $6, telefono = $7, firma_url = $8, horario_atencion = $9, preferencia_modo_oscuro = $10, preferencia_idioma = $11, foto_url = $12, biografia = $13, fecha_nacimiento = $14';
        let queryParams = [nombre, email, especialidad_principal, rol_id, cedula_profesional || null, cedula_verificada || false, telefono || null, firma_url || null, horario_atencion || null, preferencia_modo_oscuro || false, preferencia_idioma || 'es', foto_url || null, biografia || null, fecha_nacimiento || null];

        if (estado_activo !== undefined) {
            queryStr += `, estado_activo = $15`;
            queryParams.push(estado_activo);
        }

        queryStr += ` WHERE id = $${queryParams.length + 1} RETURNING id, nombre, email, especialidad_principal, rol_id, estado_activo, telefono, cedula_profesional, cedula_verificada, firma_url, horario_atencion, preferencia_modo_oscuro, preferencia_idioma, foto_url, biografia, fecha_nacimiento`;
        queryParams.push(id);

        const result = await pool.query(queryStr, queryParams);
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query(
            'UPDATE especialistas SET estado_activo = FALSE WHERE id = $1 RETURNING id, nombre, email, especialidad_principal, rol_id, estado_activo',
            [id]
        );
        return result.rows[0];
    }

    static async updateSession(id, sessionToken) {
        console.log(`[DEBUG] updateSession ejecutando -> id: ${id}, token: ${sessionToken}`);
        await pool.query('UPDATE especialistas SET session_token = $1 WHERE id = $2', [sessionToken, id]);
    }
}

export default Especialista;
