import pool from '../config/db.js';

class Paciente {
    static async findAll() {
        const result = await pool.query('SELECT * FROM pacientes');
        return result.rows;
    }

    static async create(data) {
        const { nombre, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual } = data;
        const result = await pool.query(
            'INSERT INTO pacientes (nombre, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, data) {
        const { nombre, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual } = data;
        const result = await pool.query(
            'UPDATE pacientes SET nombre = $1, fecha_nacimiento = $2, tutor_id = $3, especialista_asignado_id = $4, monto_mensual = $5 WHERE id = $6 RETURNING *',
            [nombre, fecha_nacimiento, tutor_id, especialista_asignado_id, monto_mensual, id]
        );
        return result.rows[0];
    }
}

export default Paciente;