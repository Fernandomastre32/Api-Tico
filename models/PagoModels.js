import pool from '../config/db.js';

class Pago {
    static async findAll() {
        const result = await pool.query('SELECT * FROM pagos');
        return result.rows;
    }

    static async create(data) {
        const { paciente_id, monto, fecha_pago, metodo_pago, estado_pago } = data;
        const result = await pool.query(
            'INSERT INTO pagos (paciente_id, monto, fecha_pago, metodo_pago, estado_pago) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [paciente_id, monto, fecha_pago, metodo_pago, estado_pago]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM pagos WHERE id = $1', [id]);
        return result.rows[0];
    }
}

export default Pago;