import Especialista from '../models/EspecialistaModels.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

class EspecialistaController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email y contraseña son requeridos" });
            }

            // 1. Validar usuario existe
            const especialista = await Especialista.findByEmailForAuth(email);
            if (!especialista) {
                return res.status(401).json({ message: "Credenciales inválidas" }); // No especificar que el email fallo, solo "credenciales"
            }

            // 2. Hash con salt: Comparar bcrypt hash guardado con password
            const isMatch = await bcrypt.compare(password, especialista.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }

            // 3. Gestión segura de sesiones: Crear token (corta expiración '1h')
            const payload = {
                id: especialista.id,
                rol_id: especialista.rol_id,
                especialidad: especialista.especialidad_principal
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

            // Retornamos también las cookies seguras (opcional conceptual)
            // res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });

            res.json({ message: "Autenticado con éxito", token });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async getAllEspecialistas(req, res) {
        try {
            const especialistas = await Especialista.findAll();
            res.json({ message: "Lista de todos los Especialistas", data: especialistas });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async createEspecialista(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const especialista = await Especialista.create(req.body);
            res.status(201).json({ message: "Especialista creado exitosamente", data: especialista });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async getEspecialistaById(req, res) {
        try {
            const especialista = await Especialista.findById(req.params.id);
            if (!especialista) return res.status(404).json({ message: "Especialista no encontrado" });
            res.json({ message: "Especialista encontrado", data: especialista });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async updateEspecialista(req, res) {
        try {
            const especialista = await Especialista.update(req.params.id, req.body);
            if (!especialista) return res.status(404).json({ message: "Especialista no encontrado" });
            res.json({ message: "Especialista actualizado", data: especialista });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }

    static async deleteEspecialista(req, res) {
        try {
            const eliminado = await Especialista.delete(req.params.id);
            if (!eliminado) return res.status(404).json({ message: "Especialista no encontrado" });
            res.json({ message: "Especialista desactivado correctamente", data: eliminado });
        } catch (error) {
            res.status(500).json({ error: error.message || "Error interno", details: error.toString() });
        }
    }
}

export default EspecialistaController;
