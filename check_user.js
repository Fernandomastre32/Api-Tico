import pool from './config/db.js';
import bcrypt from 'bcryptjs';

async function checkAndHashPasswords() {
    try {
        console.log('🔍 Verificando usuarios en la base de datos...');
        const result = await pool.query('SELECT id, email, password, estado_activo FROM especialistas');

        if (result.rows.length === 0) {
            console.log('⚠️ No se encontraron especialistas en la base de datos.');
            return;
        }

        console.log(`Se encontraron ${result.rows.length} especialistas. Revisando contraseñas...`);

        for (const user of result.rows) {
            // Verificamos si la contraseña no tiene el formato de un hash de bcrypt
            // Los hashes de bcrypt empiezan con $2a$, $2b$ o $2y$ y tienen 60 caracteres de longitud.
            if (user.password && !user.password.startsWith('$2')) {
                console.log(`🔄 Hasheando contraseña en texto plano para: ${user.email} ...`);

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);

                await pool.query('UPDATE especialistas SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
                console.log(`✅ Contraseña actualizada correctamente para: ${user.email}`);
            } else if (user.password) {
                console.log(`⚡ La contraseña de ${user.email} ya está protegida (hasheada).`);
            } else {
                console.log(`⚠️ El usuario ${user.email} no tiene contraseña asignada.`);
            }
        }
        console.log('\n✅ Proceso de verificación finalizado. El /api/login debería funcionar ahora.');
    } catch (error) {
        console.error('❌ Error al verificar o hashear contraseñas:', error);
    } finally {
        pool.end();
    }
}

checkAndHashPasswords();
