import pool from '../config/db.js';

class MetricasIA {
    static async create(data) {
        // Agregamos tiempo_reaccion_ms a la extracción
        const { paciente_id, cita_id, frustracion, latencia_ms, presion_toque, tiempo_reaccion_ms } = data;

        // Actualizamos la consulta para insertar los 6 valores
        const result = await pool.query(
            'INSERT INTO metricas_ia (paciente_id, cita_id, frustracion, latencia_ms, presion_toque, tiempo_reaccion_ms) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [paciente_id, cita_id, frustracion, latencia_ms, presion_toque, tiempo_reaccion_ms]
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