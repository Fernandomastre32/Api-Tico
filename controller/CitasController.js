import Cita from '../models/CitasModels.js';

class CitaController {
    static async getAllCitas(req, res) {
        try {
            const citas = await Cita.findAll();
            res.json({ message: "Cronograma de citas", data: citas });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createCita(req, res) {
        try {
            const cita = await Cita.create(req.body);
            res.status(201).json({ message: "Cita programada exitosamente", data: cita });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateCita(req, res) {
        try {
            const cita = await Cita.update(req.params.id, req.body);
            res.json({ message: "Estado de cita actualizado", data: cita });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default CitaController;