// api/admin-login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
// --- MODIFICADO: Importar 'ironSession' directamente ---
import { ironSession } from 'iron-session';
// --- FIN MODIFICACIÓN ---
import { sessionOptions } from '../src/lib/session'; // Usamos la ruta corregida

// Define la estructura esperada del cuerpo de la petición
interface LoginPayload {
  password?: string;
}

// --- MODIFICADO: Exportamos la función handler directamente ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
// --- FIN MODIFICACIÓN ---

    console.log("API Function /api/admin-login Start");

    // Solo permitir POST
    if (req.method !== 'POST') {
        console.log("API Function End - Method Not Allowed");
        res.setHeader('Allow', ['POST']);
        return res.status(405).send(`Method ${req.method} Not Allowed`);
    }

    try {
        // --- MODIFICADO: Obtener la sesión aquí ---
        const session = await ironSession(req, res, sessionOptions);
        // --- FIN MODIFICACIÓN ---

        console.log("Request Body:", req.body);

        if (typeof req.body !== 'object' || req.body === null) {
            console.log("API Function End - Invalid Body");
            return res.status(400).json({ message: 'Cuerpo de la petición inválido o vacío.' });
        }

        const { password } = req.body as LoginPayload;

        // Comprobar si la contraseña coincide con la variable de entorno
        if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
            // Contraseña correcta: Crear la sesión
            // --- MODIFICADO: Usar 'session' en lugar de 'req.session' ---
            session.user = {
                isAdmin: true,
            };
            await session.save(); // Guardar la sesión
            // --- FIN MODIFICACIÓN ---
            console.log("Admin login successful, session saved.");
            return res.status(200).json({ message: 'Login successful' });
        } else {
            // Contraseña incorrecta o no proporcionada
            console.log("Admin login failed: Incorrect or missing password.");
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

    } catch (error) {
        console.error("API Function End - Error Caught:", error);
        // Devolver respuesta de error genérico
        return res.status(500).json({ message: 'Error interno al procesar el login' });
    }
}
