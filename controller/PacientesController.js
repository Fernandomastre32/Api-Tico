import Paciente from '../models/PacienteModels.js';
import Tutor from '../models/TutoresModels.js';
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
            // 1. Crear Tutor primero
            const tutorData = {
                nombre: req.body.tutor_nombre,
                parentesco: req.body.tutor_parentesco,
                email: req.body.tutor_email,
                telefono: req.body.tutor_telefono
            };
            const tutor = await Tutor.create(tutorData);

            // 2. Crear Paciente con el tutor_id

            // Calculo de IMC seguro backend (peso_kg / altura_mts^2)
            let imcCalculado = null;
            if (req.body.peso_kg && req.body.altura_cm) {
                const peso = parseFloat(req.body.peso_kg);
                const altura_mts = parseFloat(req.body.altura_cm) / 100;
                if (!isNaN(peso) && !isNaN(altura_mts) && altura_mts > 0) {
                    imcCalculado = (peso / (altura_mts * altura_mts)).toFixed(2);
                }
            }

            const pacienteData = {
                ...req.body,
                tutor_id: tutor.id,
                imc: req.body.imc || imcCalculado, // Usar provisto o calculado
                // Si no mandan especialista, dejamos el del usuario actual temporalmente o nulo
                especialista_asignado_id: req.body.especialista_asignado_id || (req.user ? req.user.id : null)
            };

            const paciente = await Paciente.create(pacienteData);

            // 3. Responder con el paciente creado (y opcionalmente datos del tutor anexos)
            res.status(201).json({ message: "Paciente registrado", data: { ...paciente, tutor_nombre: tutor.nombre } });
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
            const existing = await Paciente.findById(req.params.id);
            if (!existing) return res.status(404).json({ message: "Paciente no encontrado" });

            // 1. Actualizar el tutor asociado (si existe_tutor_id y enviaron datos)
            if (existing.tutor_id) {
                // Hay que mezclar o enviar los nuevos, si no enviaron en el body se deja como está temporalmente
                // (Para que no fallen validaciones si algo va vacío)
                await Tutor.update(existing.tutor_id, {
                    nombre: req.body.tutor_nombre || existing.tutor_nombre || 'N/D',
                    parentesco: req.body.tutor_parentesco || 'N/D',
                    email: req.body.tutor_email || null,
                    telefono: req.body.tutor_telefono || null
                });
            }

            // 2. Cálculo de IMC si cambió peso/altura
            let imcCalculado = existing.imc;
            if (req.body.peso_kg || req.body.altura_cm) {
                const peso = parseFloat(req.body.peso_kg || existing.peso_kg);
                const altura_cm = parseFloat(req.body.altura_cm || existing.altura_cm);
                if (!isNaN(peso) && !isNaN(altura_cm) && altura_cm > 0) {
                    const altura_mts = altura_cm / 100;
                    imcCalculado = (peso / (altura_mts * altura_mts)).toFixed(2);
                }
            }

            // 3. Preparar datos combinados
            const pacienteData = {
                ...existing,            // Cargar datos actuales como base para no pisar
                ...req.body,            // Sobrescribir con lo que mande el JSON
                tutor_id: existing.tutor_id,
                especialista_asignado_id: existing.especialista_asignado_id,
                imc: req.body.imc || imcCalculado,
                observacion: req.body.observacion || existing.observaciones || 'Medio',
                estado: req.body.estado || existing.estado_clinico || 'Estable'
            };

            const paciente = await Paciente.update(req.params.id, pacienteData);
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
