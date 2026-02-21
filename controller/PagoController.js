import Pago from '../models/PagoModels.js';

class PagoController {
    static async getAllPagos(req, res) {
        try {
            const pagos = await Pago.findAll();
            res.json({ message: "Historial financiero global", data: pagos });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createPago(req, res) {
        try {
            const pago = await Pago.create(req.body);
            res.status(201).json({ message: "Pago registrado correctamente", data: pago });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getPagoById(req, res) {
        try {
            const pago = await Pago.findById(req.params.id);
            if (!pago) return res.status(404).json({ message: "Registro de pago no encontrado" });
            res.json({ message: "Detalle de pago obtenido", data: pago });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default PagoController;