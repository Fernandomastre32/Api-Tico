import pool from '../config/db.js';

class MetricasIA {
    static async create(data) {
        const { paciente_id, cita_id, frustracion, latencia_ms, presion_toque, tiempo_reaccion_ms } = data;
        const result = await pool.query(
            'INSERT INTO metricas_ia (paciente_id, cita_id, frustracion, latencia_ms, presion_toque, tiempo_reaccion_ms) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [paciente_id, cita_id, frustracion, latencia_ms, presion_toque, tiempo_reaccion_ms]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query(`
            SELECT m.*, p.nombre AS paciente_nombre
            FROM metricas_ia m
            LEFT JOIN pacientes p ON m.paciente_id = p.id
            ORDER BY m.fecha_registro DESC
        `);
        return result.rows;
    }

    static async findByPaciente(paciente_id) {
        const result = await pool.query(
            `SELECT m.*, p.nombre AS paciente_nombre
             FROM metricas_ia m
             LEFT JOIN pacientes p ON m.paciente_id = p.id
             WHERE m.paciente_id = $1
             ORDER BY m.fecha_registro ASC`,
            [paciente_id]
        );
        return result.rows;
    }
}

export default MetricasIA;