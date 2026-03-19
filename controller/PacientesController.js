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
        console.log("--- CREANDO PACIENTE ---");
        console.log("Body recibido:", JSON.stringify(req.body, null, 2));
        try {
            // 1. Crear Tutor primero
            const tutorData = {
                nombre: req.body.tutor_nombre,
                apellido_paterno: req.body.tutor_apellido_paterno,
                apellido_materno: req.body.tutor_apellido_materno,
                parentesco: req.body.tutor_parentesco,
                email: req.body.tutor_email,
                telefono: req.body.tutor_telefono,
                password: req.body.tutor_password
            };
            console.log("Datos del tutor a crear:", tutorData);

            // Basic validation for tutor email and phone before creation
            if (tutorData.email && tutorData.email.length > 0) {
                if (tutorData.email.includes(' ')) {
                    console.warn("Error de validación: El correo no puede tener espacios.");
                    return res.status(400).json({ message: "El correo no puede tener espacios" });
                }
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(tutorData.email)) {
                    console.warn("Error de validación: Formato de correo inválido.");
                    return res.status(400).json({ message: "Formato de correo inválido" });
                }
            }
            if (tutorData.telefono && tutorData.telefono.length > 0) {
                const soloDigitos = String(tutorData.telefono).replace(/\D/g, '');
                if (soloDigitos.length !== 10) {
                    console.warn("Error de validación: El teléfono debe tener exactamente 10 dígitos.");
                    return res.status(400).json({ message: "El teléfono debe tener exactamente 10 dígitos" });
                }
            }

            const tutor = await Tutor.create(tutorData);
            console.log("Tutor creado con ID:", tutor.id);

            // 2. Crear Paciente con el tutor_id

            // Calculo de IMC seguro backend (peso_kg / altura_mts^2)
            let imcCalculado = null;
            if (req.body.peso_kg && req.body.altura_cm) {
                const peso = parseFloat(req.body.peso_kg);
                const altura_cm = parseFloat(req.body.altura_cm);
                if (!isNaN(peso) && !isNaN(altura_cm) && altura_cm > 0) {
                    const altura_mts = altura_cm / 100;
                    imcCalculado = (peso / (altura_mts * altura_mts)).toFixed(2);
                    console.log(`IMC calculado: ${imcCalculado} (Peso: ${peso}kg, Altura: ${altura_cm}cm)`);
                } else {
                    console.warn("Advertencia: Datos de peso/altura inválidos para cálculo de IMC.");
                }
            }

            const pacienteData = {
                ...req.body,
                tutor_id: tutor.id,
                imc: req.body.imc || imcCalculado, // Usar provisto o calculado
                // Si no mandan especialista, dejamos el del usuario actual temporalmente o nulo
                especialista_asignado_id: req.body.especialista_asignado_id || (req.user ? req.user.id : null)
            };
            console.log("Datos del paciente a crear:", pacienteData);

            const paciente = await Paciente.create(pacienteData);
            console.log("Paciente creado con ID:", paciente.id);

            // 3. Responder con el paciente creado (y opcionalmente datos del tutor anexos)
            res.status(201).json({ message: "Paciente registrado", data: { ...paciente, tutor_nombre: tutor.nombre } });
        } catch (error) {
            console.error("Error al crear paciente:", error);
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async getPacienteById(req, res) {
        try {
            console.log("Buscando paciente con ID:", req.params.id);
            const paciente = await Paciente.findById(req.params.id);
            if (!paciente) {
                console.log("Paciente no encontrado con ID:", req.params.id);
                return res.status(404).json({ message: "Paciente no encontrado" });
            }
            console.log("Paciente encontrado:", paciente.id);
            res.json({ message: "Datos del paciente obtenidos", data: paciente });
        } catch (error) {
            console.error("Error al obtener paciente por ID:", error);
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async updatePaciente(req, res) {
        console.log("--- ACTUALIZANDO PACIENTE ---");
        console.log("ID:", req.params.id);
        console.log("Body recibido:", JSON.stringify(req.body, null, 2));
        try {
            const existing = await Paciente.findById(req.params.id);
            if (!existing) {
                console.log("Paciente no encontrado para actualizar con ID:", req.params.id);
                return res.status(404).json({ message: "Paciente no encontrado" });
            }

            // 1. Actualizar el tutor asociado — primero obtener datos actuales para no pisar
            if (existing.tutor_id) {
                console.log("Actualizando tutor del paciente:", existing.tutor_id);
                const existingTutor = await Tutor.findById(existing.tutor_id);
                const tutorUpdateData = {
                    nombre: req.body.tutor_nombre || existingTutor?.nombre || 'N/D',
                    apellido_paterno: req.body.tutor_apellido_paterno !== undefined ? req.body.tutor_apellido_paterno : existingTutor?.apellido_paterno,
                    apellido_materno: req.body.tutor_apellido_materno !== undefined ? req.body.tutor_apellido_materno : existingTutor?.apellido_materno,
                    parentesco: req.body.tutor_parentesco !== undefined ? req.body.tutor_parentesco : (existingTutor?.parentesco || 'N/D'),
                    email: req.body.tutor_email !== undefined ? req.body.tutor_email : (existingTutor?.email || null),
                    telefono: req.body.tutor_telefono !== undefined ? req.body.tutor_telefono : (existingTutor?.telefono || null),
                    password: req.body.tutor_password || undefined // Solo actualizar si envían nueva
                };
                console.log("Datos de actualización del tutor:", tutorUpdateData);

                // Basic validation for tutor email and phone before update
                if (tutorUpdateData.email && tutorUpdateData.email.length > 0) {
                    if (tutorUpdateData.email.includes(' ')) {
                        console.warn("Error de validación: El correo del tutor no puede tener espacios.");
                        return res.status(400).json({ message: "El correo del tutor no puede tener espacios" });
                    }
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(tutorUpdateData.email)) {
                        console.warn("Error de validación: Formato de correo del tutor inválido.");
                        return res.status(400).json({ message: "Formato de correo del tutor inválido" });
                    }
                }
                if (tutorUpdateData.telefono && tutorUpdateData.telefono.length > 0) {
                    const soloDigitos = String(tutorUpdateData.telefono).replace(/\D/g, '');
                    if (soloDigitos.length !== 10) {
                        console.warn("Error de validación: El teléfono del tutor debe tener exactamente 10 dígitos.");
                        return res.status(400).json({ message: "El teléfono del tutor debe tener exactamente 10 dígitos" });
                    }
                }

                await Tutor.update(existing.tutor_id, tutorUpdateData);
                console.log("Tutor actualizado.");
            }

            // 2. Cálculo de IMC si cambió peso/altura
            let imcCalculado = existing.imc;
            if (req.body.peso_kg || req.body.altura_cm) {
                const peso = parseFloat(req.body.peso_kg || existing.peso_kg);
                const altura_cm = parseFloat(req.body.altura_cm || existing.altura_cm);
                if (!isNaN(peso) && !isNaN(altura_cm) && altura_cm > 0) {
                    const altura_mts = altura_cm / 100;
                    imcCalculado = (peso / (altura_mts * altura_mts)).toFixed(2);
                    console.log(`IMC recalculado: ${imcCalculado} (Peso: ${peso}kg, Altura: ${altura_cm}cm)`);
                } else {
                    console.warn("Advertencia: Datos de peso/altura inválidos para recalcular IMC.");
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
