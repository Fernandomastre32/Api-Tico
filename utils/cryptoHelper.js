import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Debe ser de 32 bytes para aes-256-cbc. Como ejemplo, usamos un string fijo o variable de entorno.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 chars
const IV_LENGTH = 16; // Para AES, esto es siempre 16

export function encryptData(text) {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // Guardamos el iv junto al texto encriptado para poder desencriptarlo después
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptData(text) {
    if (!text) return text;
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (err) {
        return text; // Por si los datos antes no estaban encriptados
    }
}
