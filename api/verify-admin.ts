// api/verify-admin.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

// Clave secreta para verificar el JWT (leer desde variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log("API Function /api/verify-admin Start");

    // Verificar que JWT_SECRET está configurado
    if (!JWT_SECRET) {
        console.error("JWT_SECRET environment variable is not set.");
        return res.status(500).json({ success: false, message: 'Error de configuración del servidor.' });
    }

    // Solo permitir GET (o POST si prefieres enviar el token en el body)
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).send(`Method ${req.method} Not Allowed`);
    }

    try {
        // Extraer token del header Authorization: Bearer <token>
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("Verification failed: No or invalid Authorization header");
            return res.status(401).json({ success: false, message: 'Token no proporcionado o inválido.' });
        }

        const token = authHeader.split(' ')[1]; // Obtener solo el token

        if (!token) {
             console.log("Verification failed: Token missing after Bearer");
             return res.status(401).json({ success: false, message: 'Token no proporcionado.' });
        }

        // Verificar el token usando la clave secreta
        console.log("Attempting to verify token...");
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Token verified successfully.");

        // Si la verificación es exitosa, jwt.verify devuelve el payload decodificado.
        // Podríamos comprobar aquí si el payload contiene { user: { isAdmin: true } } si quisiéramos ser más estrictos.
        // Por ahora, si la verificación no da error, asumimos que es un admin válido.

        // Devolver éxito y opcionalmente los datos decodificados (sin info sensible)
        // En este caso, solo confirmamos que es admin.
        return res.status(200).json({ success: true, user: { isAdmin: true } });

    } catch (error) {
        // jwt.verify lanza error si el token es inválido (firma incorrecta, expirado, etc.)
        console.error("Token verification failed:", error);
        // Devolver error de no autorizado
        return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
    }
}
