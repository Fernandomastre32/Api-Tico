import pool from '../config/db.js';
import { encryptData, decryptData } from '../utils/cryptoHelper.js';

class Pago {
    static async findAll() {
        const result = await pool.query('SELECT * FROM pagos ORDER BY fecha_pago DESC');
        return result.rows.map(pago => {
            try {
                const dec = decryptData(pago.metodo_pago);
                if (dec && dec.length > 4) pago.metodo_pago = '****' + dec.slice(-4);
                else pago.metodo_pago = dec;
            } catch (e) {
                pago.metodo_pago = 'Invalid Data';
            }
            return pago;
        });
    }

    static async create(data) {
        const { paciente_id, monto, fecha_pago, metodo_pago, estado_pago } = data;

        // Cifrado en Reposo API
        const encryptedMetodo = encryptData(metodo_pago);

        const result = await pool.query(
            'INSERT INTO pagos (paciente_id, monto, fecha_pago, metodo_pago, estado_pago) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [paciente_id, monto, fecha_pago, encryptedMetodo, estado_pago]
        );
        let pagoCreado = result.rows[0];
        const dec = decryptData(pagoCreado.metodo_pago);
        pagoCreado.metodo_pago = dec && dec.length > 4 ? '****' + dec.slice(-4) : dec;
        return pagoCreado;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM pagos WHERE id = $1', [id]);
        if (!result.rows.length) return null;
        let pago = result.rows[0];
        const dec = decryptData(pago.metodo_pago);
        pago.metodo_pago = dec && dec.length > 4 ? '****' + dec.slice(-4) : dec;
        return pago;
    }

    static async update(id, data) {
        const { paciente_id, monto, fecha_pago, metodo_pago, estado_pago } = data;
        let encryptedMetodo = undefined;
        if (metodo_pago) encryptedMetodo = encryptData(metodo_pago);

        const result = await pool.query(
            `UPDATE pagos SET 
                paciente_id = COALESCE($1, paciente_id),
                monto = COALESCE($2, monto),
                fecha_pago = COALESCE($3, fecha_pago),
                metodo_pago = COALESCE($4, metodo_pago),
                estado_pago = COALESCE($5, estado_pago)
            WHERE id = $6 RETURNING *`,
            [paciente_id, monto, fecha_pago, encryptedMetodo, estado_pago, id]
        );
        let pago = result.rows[0];
        if (pago) {
            const dec = decryptData(pago.metodo_pago);
            pago.metodo_pago = dec && dec.length > 4 ? '****' + dec.slice(-4) : dec;
        }
        return pago;
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM pagos WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

export default Pago;