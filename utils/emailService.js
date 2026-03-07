import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a reusable transporter using default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envia el código de verificación 2FA.
 * Siempre fuerza el envío a 'jerrymoralesrivera@gmail.com' por motivos de seguridad/prueba en este caso específico.
 * 
 * @param {string} code Código de 6 dígitos
 * @returns {Promise} Resultado del envío
 */
export const send2FACode = async (code) => {
    // Verificar que las credenciales estén configuradas, de otro modo se podría colgar la app o dar error críptico
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('ERROR: EMAIL_USER o EMAIL_PASS no están configurados en el archivo .env');
        throw new Error('Configuración de correo incompleta en el servidor.');
    }

    const mailOptions = {
        from: `"Centro Terapéutico TICO" <${process.env.EMAIL_USER}>`,
        to: 'jerrymoralesrivera@gmail.com', // Destino fijo solicitado por el cliente
        subject: 'Código de Verificación - Centro TICO',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
                <h2 style="color: #4F46E5; text-align: center;">Centro Terapéutico TICO</h2>
                <p style="font-size: 16px; color: #374151;">Hola,</p>
                <p style="font-size: 16px; color: #374151;">Se ha solicitado un inicio de sesión en tu cuenta. Usa el siguiente código de 6 dígitos para verificar tu identidad:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; background-color: #f3f4f6; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827; border-radius: 8px;">
                        ${code}
                    </span>
                </div>
                
                <p style="font-size: 14px; color: #6b7280;">Este código expirará en 10 minutos. Si no fuiste tú quien intentó iniciar sesión, por favor ignora este correo.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">© 2025 Centro Terapéutico TICO. Todos los derechos reservados.</p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};
