import Especialista from '../models/EspecialistaModels.js';

class EspecialistaController {
    static async getAllEspecialistas(req, res) {
        try {
            const especialistas = await Especialista.findAll();
            res.json({ message: "Lista de todos los Especialistas", data: especialistas });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createEspecialista(req, res) {
        try {
            const especialista = await Especialista.create(req.body);
            res.status(201).json({ message: "Especialista creado exitosamente", data: especialista });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getEspecialistaById(req, res) {
        try {
            const especialista = await Especialista.findById(req.params.id);
            if (!especialista) return res.status(404).json({ message: "Especialista no encontrado" });
            res.json({ message: "Especialista encontrado", data: especialista });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateEspecialista(req, res) {
        try {
            const especialista = await Especialista.update(req.params.id, req.body);
            if (!especialista) return res.status(404).json({ message: "Especialista no encontrado" });
            res.json({ message: "Especialista actualizado", data: especialista });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteEspecialista(req, res) {
        try {
            const eliminado = await Especialista.delete(req.params.id);
            if (!eliminado) return res.status(404).json({ message: "Especialista no encontrado" });
            res.json({ message: "Especialista desactivado correctamente", data: eliminado });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default EspecialistaController;