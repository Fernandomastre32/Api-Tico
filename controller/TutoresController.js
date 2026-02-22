import Tutor from '../models/TutoresModels.js';

class TutorController {
    static async getAllTutores(req, res) {
        try {
            const tutores = await Tutor.findAll();
            res.json({ message: "Lista de Tutores", data: tutores });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async createTutor(req, res) {
        try {
            const tutor = await Tutor.create(req.body);
            res.status(201).json({ message: "Tutor creado exitosamente", data: tutor });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async getTutorById(req, res) {
        try {
            const tutor = await Tutor.findById(req.params.id);
            if (!tutor) return res.status(404).json({ message: "Tutor no encontrado" });
            res.json({ message: "Tutor encontrado", data: tutor });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }
}

export default TutorController;
