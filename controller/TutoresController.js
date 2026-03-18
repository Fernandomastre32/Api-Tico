import Tutor from '../models/TutoresModels.js';
import Paciente from '../models/PacienteModels.js'; 
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs'; 
import crypto from 'crypto';

class TutorController {
    
    static async getAllTutores(req, res) {
        try {
            const tutores = await Tutor.findAll();
            res.json({ message: "Lista de Tutores", data: tutores });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async loginUnity(req, res) {
        try {
            console.log("--- INTENTO DE LOGIN (TUTORES) ---");
            const { usuario, password } = req.body;
            console.log("1. Lo que llegó de Unity:", req.body);

            // Buscamos en la BD de tutores
            const tutor = await Tutor.buscarPorUsuarioOCorreo(usuario);
            console.log("2. Lo que encontró en la BD para Tutores:", tutor);

            if (!tutor) {
                console.log("❌ FALLA: No se encontró el tutor");
                return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
            }

            console.log("3. Comparando contraseñas con bcrypt...");
            
            // VALIDACIÓN SEGURA: Comparamos la contraseña de Unity con la encriptada de la BD
            const passwordCorrecta = await bcrypt.compare(password, tutor.password);
            
            if (!passwordCorrecta) {
                console.log("❌ FALLA: Las contraseñas no coinciden");
                return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
            }

            console.log("✅ ÉXITO: Generando Token...");

            // Buscar también los pacientes asociados a este tutor
            const pacientes = await Paciente.findByTutorId(tutor.id);

            // Crear el token de seguridad con UUID para que pase tu middleware
            const token = jwt.sign(
                {
                    id: tutor.id,
                    type: 'tutor',
                    uuid: crypto.randomUUID()
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            // Responder a Unity con éxito
            res.status(200).json({
                mensaje: "Login exitoso",
                token: token,
                tutor: {
                    id: tutor.id,
                    nombre: tutor.nombre,
                    parentesco: tutor.parentesco,
                    email: tutor.email,
                    telefono: tutor.telefono
                },
                pacientes: pacientes
            });
        } catch (error) {
            console.error('[LOGIN_UNITY_TUTOR ERROR]', error);
            res.status(500).json({ error: "Error interno del servidor" });
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