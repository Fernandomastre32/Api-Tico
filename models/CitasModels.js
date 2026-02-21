import pool from '../config/db.js';

class Cita {
    static async findAll() {
        const result = await pool.query('SELECT * FROM citas');
        return result.rows;
    }

    static async create(data) {
        const { paciente_id, especialista_id, fecha_cita, estado_cita, progreso_terapia_pct } = data;
        const result = await pool.query(
            'INSERT INTO citas (paciente_id, especialista_id, fecha_cita, estado_cita, progreso_terapia_pct) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [paciente_id, especialista_id, fecha_cita, estado_cita, progreso_terapia_pct]
        );
        return result.rows[0];
    }

    static async update(id, data) {
        const { fecha_cita, estado_cita, progreso_terapia_pct, observacion_clinica } = data;
        const result = await pool.query(
            'UPDATE citas SET fecha_cita = $1, estado_cita = $2, progreso_terapia_pct = $3, observacion_clinica = $4 WHERE id = $5 RETURNING *',
            [fecha_cita, estado_cita, progreso_terapia_pct, observacion_clinica, id]
        );
        return result.rows[0];
    }
}

export default Cita;