import pool from '../config/db.js';

class MetricasIA {
    static async create(data) {
        const { paciente_id, cita_id, frustracion, latencia_ms, presion_toque } = data;
        const result = await pool.query(
            'INSERT INTO metricas_ia (paciente_id, cita_id, frustracion, latencia_ms, presion_toque) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [paciente_id, cita_id, frustracion, latencia_ms, presion_toque]
        );
        return result.rows[0];
    }

    static async findByPaciente(paciente_id) {
        const result = await pool.query(
            'SELECT * FROM metricas_ia WHERE paciente_id = $1 ORDER BY fecha_registro DESC',
            [paciente_id]
        );
        return result.rows;
    }
}

export default MetricasIA;