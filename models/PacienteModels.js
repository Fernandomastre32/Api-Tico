import pool from '../config/db.js';

class Paciente {
    static async findAll() {
        const query = `
            SELECT p.*, t.nombre AS tutor_nombre 
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
            nombre, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual,
            genero, peso_kg, altura_cm, imc, alergias, observacion, estado, estado_activo
        } = data;
        const result = await pool.query(
            `INSERT INTO pacientes (
                nombre, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual,
                genero, peso_kg, altura_cm, imc, alergias, observaciones, estado_clinico, estado_activo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
            [
                nombre, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual,
                genero, peso_kg, altura_cm, imc, alergias, observacion, estado, estado_activo !== undefined ? estado_activo : true
            ]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, data) {
        const {
            nombre, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual,
            genero, peso_kg, altura_cm, imc, alergias, observacion, estado, estado_activo
        } = data;
        const result = await pool.query(
            `UPDATE pacientes SET 
                nombre = $1, fecha_nacimiento = $2, tutor_id = $3, especialista_asignado_id = $4, monto_mensual = $5,
                genero = $6, peso_kg = $7, altura_cm = $8, imc = $9, alergias = $10,
                observaciones = $11, estado_clinico = $12, estado_activo = $13
            WHERE id = $14 RETURNING *`,
            [
                nombre, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual,
                genero, peso_kg, altura_cm, imc, alergias, observacion, estado, estado_activo,
                id
            ]
        );
        return result.rows[0];
    }
}

export default Paciente;