import Paciente from '../models/PacienteModels.js';

class PacienteController {
    static async getAllPacientes(req, res) {
        try {
            const pacientes = await Paciente.findAll();
            res.json({ message: "Lista de todos los Pacientes", data: pacientes });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async createPaciente(req, res) {
        try {
            const paciente = await Paciente.create(req.body);
            res.status(201).json({ message: "Paciente registrado", data: paciente });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async getPacienteById(req, res) {
        try {
            const paciente = await Paciente.findById(req.params.id);
            if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });
            res.json({ message: "Datos del paciente obtenidos", data: paciente });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async updatePaciente(req, res) {
        try {
            const paciente = await Paciente.update(req.params.id, req.body);
            res.json({ message: "Paciente actualizado correctamente", data: paciente });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async deletePaciente(req, res) {
        try {
            const paciente = await Paciente.delete(req.params.id);
            res.json({ message: "Paciente eliminado del sistema", data: paciente });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }
}

export default PacienteController;
