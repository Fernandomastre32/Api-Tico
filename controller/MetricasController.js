import MetricasIA from '../models/MetricasModels.js';

class MetricasIAController {
    static async createMetrica(req, res) {
        try {
            const metrica = await MetricasIA.create(req.body);
            res.status(201).json({ message: "Métricas de IA capturadas", data: metrica });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async getByPaciente(req, res) {
        try {
            const metricas = await MetricasIA.findByPaciente(req.params.pacienteId);
            res.json({ message: "Análisis de progreso clínico IA", data: metricas });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }
}

export default MetricasIAController;
