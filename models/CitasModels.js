import pool from '../config/db.js';

class Cita {
    static async findAll() {
        const query = `
            SELECT 
                c.id, 
                c.paciente_id, 
                c.especialista_id, 
                TO_CHAR(c.fecha_cita, 'YYYY-MM-DD') as fecha_cita,
                TO_CHAR(c.fecha_cita, 'HH24:MI') as hora_cita,
                c.estado_cita, 
                c.progreso_terapia_pct, 
                c.observacion_clinica,
                p.nombre AS paciente_nombre, 
                t.nombre AS tutor
            FROM citas c
            JOIN pacientes p ON c.paciente_id = p.id
            LEFT JOIN tutores t ON p.tutor_id = t.id
            ORDER BY c.fecha_cita DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    static async create(data) {
        const { paciente_id, especialista_id, fecha_cita, hora_cita, estado_cita, progreso_terapia_pct, observacion_clinica } = data;
        const timestamp = `${fecha_cita} ${hora_cita}`;
        const result = await pool.query(
            'INSERT INTO citas (paciente_id, especialista_id, fecha_cita, estado_cita, progreso_terapia_pct, observacion_clinica) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [paciente_id, especialista_id, timestamp, estado_cita, progreso_terapia_pct || 0, observacion_clinica]
        );
        return result.rows[0];
    }

    static async update(id, data) {
        const { fecha_cita, hora_cita, estado_cita, progreso_terapia_pct, observacion_clinica } = data;
        const timestamp = `${fecha_cita} ${hora_cita}`;
        const result = await pool.query(
            'UPDATE citas SET fecha_cita = $1, estado_cita = $2, progreso_terapia_pct = $3, observacion_clinica = $4 WHERE id = $5 RETURNING *',
            [timestamp, estado_cita, progreso_terapia_pct || 0, observacion_clinica, id]
        );
        return result.rows[0];
    }
}

export default Cita;