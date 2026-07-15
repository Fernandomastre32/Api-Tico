import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 🎯 Script para generar un usuario de prueba
 * Uso: node utils/generarUsuarioPrueba.js
 */

const SALT_ROUNDS = 10;

async function generarUsuarioPrueba() {
    try {
        console.log('🔐 Generando usuario de prueba para capturas...\n');

        // Datos del usuario de prueba
        const datosUsuario = {
            nombre: 'Carlos',
            apellido_paterno: 'Prueba',
            apellido_materno: 'Demo',
            parentesco: 'Padre',
            email: 'prueba@test.com',
            telefono: '1234567890',
            password: 'Prueba123!'  // Contraseña simple para las capturas
        };

        // Hashear la contraseña
        console.log('📝 Datos del usuario:');
        console.log(`   Email: ${datosUsuario.email}`);
        console.log(`   Teléfono: ${datosUsuario.telefono}`);
        console.log(`   Contraseña (sin hash): ${datosUsuario.password}\n`);

        const hashedPassword = await bcrypt.hash(datosUsuario.password, SALT_ROUNDS);
        console.log('✅ Contraseña hasheada correctamente\n');

        // Intentar eliminar usuario anterior (si existe)
        try {
            await pool.query(
                'DELETE FROM tutores WHERE email = $1',
                [datosUsuario.email]
            );
            console.log('🗑️  Usuario anterior eliminado\n');
        } catch (e) {
            // Ignorar si no existe
        }

        // Crear el usuario
        const resultado = await pool.query(
            `INSERT INTO tutores 
            (nombre, apellido_paterno, apellido_materno, parentesco, email, telefono, password) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id, nombre, email, telefono`,
            [
                datosUsuario.nombre,
                datosUsuario.apellido_paterno,
                datosUsuario.apellido_materno,
                datosUsuario.parentesco,
                datosUsuario.email,
                datosUsuario.telefono,
                hashedPassword
            ]
        );

        const usuarioCreado = resultado.rows[0];
        console.log('✨ Usuario creado exitosamente en la BD:');
        console.log(`   ID: ${usuarioCreado.id}`);
        console.log(`   Nombre: ${usuarioCreado.nombre}`);
        console.log(`   Email: ${usuarioCreado.email}\n`);

        // Generar token de prueba
        const token = jwt.sign(
            {
                id: usuarioCreado.id,
                type: 'tutor',
                uuid: crypto.randomUUID()
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        console.log('🎫 Token JWT generado:\n');
        console.log(token);
        console.log('\n');

        // Mostrar las peticiones que necesitas hacer
        console.log('═════════════════════════════════════════════════════════════');
        console.log('📋 PASOS PARA TOMAR LAS CAPTURAS:');
        console.log('═════════════════════════════════════════════════════════════\n');

        console.log('1️⃣  CAPTURA: POST /api/tutores/login-unity');
        console.log('   URL: http://localhost:3000/api/tutores/login-unity');
        console.log('   Method: POST');
        console.log('   Body (JSON):');
        console.log(`   {
      "usuario": "${datosUsuario.email}",
      "password": "${datosUsuario.password}"
   }\n`);

        console.log('2️⃣  CAPTURA: GET /api/metricas (con Token)');
        console.log('   URL: http://localhost:3000/api/metricas');
        console.log('   Method: GET');
        console.log('   Headers:');
        console.log(`   Authorization: Bearer ${token}\n\n`);

        console.log('═════════════════════════════════════════════════════════════');
        console.log('💡 OPCIONES PARA HACER LAS PETICIONES:');
        console.log('═════════════════════════════════════════════════════════════\n');

        console.log('✅ Opción 1: Swagger (Recomendado)');
        console.log('   URL: http://localhost:3000/api-docs');
        console.log('   1. Haz login con POST /api/tutores/login-unity');
        console.log('   2. Copia el token de la respuesta');
        console.log('   3. Haz clic en "Authorize" y pega: Bearer <token>');
        console.log('   4. Prueba GET /api/metricas\n');

        console.log('✅ Opción 2: Postman');
        console.log('   1. POST http://localhost:3000/api/tutores/login-unity');
        console.log(`      Body: {"usuario":"${datosUsuario.email}","password":"${datosUsuario.password}"}`);
        console.log('   2. GET http://localhost:3000/api/metricas');
        console.log(`      Header: Authorization: Bearer <token_de_respuesta_anterior>\n`);

        console.log('✅ Opción 3: curl (Terminal)');
        console.log(`   curl -X POST http://localhost:3000/api/tutores/login-unity \\`);
        console.log(`     -H "Content-Type: application/json" \\`);
        console.log(`     -d '{"usuario":"${datosUsuario.email}","password":"${datosUsuario.password}"}'`);
        console.log(`   \n   curl -X GET http://localhost:3000/api/metricas \\`);
        console.log(`     -H "Authorization: Bearer ${token}"\n`);

        console.log('═════════════════════════════════════════════════════════════\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

generarUsuarioPrueba();
