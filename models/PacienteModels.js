import pool from '../config/db.js';

class Paciente {
    static async findAll() {
        const query = `
            SELECT p.*, 
                   t.nombre AS tutor_nombre, 
                   t.apellido_paterno AS tutor_apellido_paterno, 
                   t.apellido_materno AS tutor_apellido_materno,
                   t.parentesco AS tutor_parentesco,
                   t.email AS tutor_email,
                   t.telefono AS tutor_telefono
            FROM pacientes p 
            LEFT JOIN tutores t ON p.tutor_id = t.id
            ORDER BY p.id DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }
    static async findByTutorId(tutor_id) {
        const result = await pool.query('SELECT * FROM pacientes WHERE tutor_id = $1', [tutor_id]);
        return result.rows;
    }

    static async create(data) {
        const {
            nombre, apellido_paterno, apellido_materno, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual,
            genero, peso_kg, altura_cm, imc, alergias, observacion, estado, estado_activo
        } = data;
        const result = await pool.query(
            `INSERT INTO pacientes (
                nombre, apellido_paterno, apellido_materno, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual,
                genero, peso_kg, altura_cm, imc, alergias, observaciones, estado_clinico, estado_activo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
            [
                nombre, apellido_paterno || '', apellido_materno || '', fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual,
                genero, peso_kg, altura_cm, imc, alergias, observacion, estado, estado_activo !== undefined ? estado_activo : true
            ]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const query = `
            SELECT p.*, 
                   t.nombre AS tutor_nombre, 
                   t.apellido_paterno AS tutor_apellido_paterno, 
                   t.apellido_materno AS tutor_apellido_materno,
                   t.parentesco AS tutor_parentesco,
                   t.email AS tutor_email,
                   t.telefono AS tutor_telefono
            FROM pacientes p 
            LEFT JOIN tutores t ON p.tutor_id = t.id
            WHERE p.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async update(id, data) {
        const {
            nombre, apellido_paterno, apellido_materno, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual,
            genero, peso_kg, altura_cm, imc, alergias, observacion, estado, estado_activo
        } = data;
        const result = await pool.query(
            `UPDATE pacientes SET 
                nombre = $1, apellido_paterno = $2, apellido_materno = $3, fecha_nacimiento = $4, tutor_id = $5, especialista_asignado_id = $6, monto_mensual = $7,
                genero = $8, peso_kg = $9, altura_cm = $10, imc = $11, alergias = $12,
                observaciones = $13, estado_clinico = $14, estado_activo = $15
            WHERE id = $16 RETURNING *`,
            [
                nombre, apellido_paterno, apellido_materno, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual,
                genero, peso_kg, altura_cm, imc, alergias, observacion, estado, estado_activo,
                id
            ]
        );
        return result.rows[0];
    }
}

export default Paciente;