import pool from '../config/db.js';
import { encryptData, decryptData } from '../utils/cryptoHelper.js';

class Pago {
    static async findAll() {
        const result = await pool.query('SELECT * FROM pagos');
        // Ejemplo de Tokenización / Enmascaramiento: Mostrar solo parte de los datos decifrados.
        return result.rows.map(pago => {
            const dec = decryptData(pago.metodo_pago);
            if (dec && dec.length > 4) pago.metodo_pago = '****' + dec.slice(-4);
            else pago.metodo_pago = dec;
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
}

export default Pago;