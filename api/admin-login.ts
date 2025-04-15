// api/admin-login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ironSession } from 'iron-session';
// --- MODIFICADO: Ruta de importación corregida (asume session.ts está en api/_lib/) ---
import { sessionOptions } from './_lib/session';
// --- FIN MODIFICACIÓN ---

// Define la estructura esperada del cuerpo de la petición
interface LoginPayload {
  password?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log("API Function /api/admin-login Start");

    // Verificar Variables de Entorno (lo mantenemos por si acaso)
    console.log("Checking Environment Variables:");
    console.log(`TEST_VAR Value: ${process.env.TEST_VAR}`); // Test variable
    console.log(`KV_REST_API_URL Exists: ${!!process.env.KV_REST_API_URL}`);
    console.log(`KV_REST_API_TOKEN Exists: ${!!process.env.KV_REST_API_TOKEN}`);
    if (process.env.KV_REST_API_URL) {
        console.log(`KV_REST_API_URL Starts With: ${process.env.KV_REST_API_URL.substring(0, 20)}...`);
    }

    // Solo permitir POST
    if (req.method !== 'POST') {
        console.log("API Function End - Method Not Allowed");
        res.setHeader('Allow', ['POST']);
        return res.status(405).send(`Method ${req.method} Not Allowed`);
    }

    try {
        // Obtener la sesión
        const session = await ironSession(req, res, sessionOptions);

        console.log("Request Body:", req.body);

        if (typeof req.body !== 'object' || req.body === null) {
            console.log("API Function End - Invalid Body");
            return res.status(400).json({ message: 'Cuerpo de la petición inválido o vacío.' });
        }

        const { password } = req.body as LoginPayload;

        // Comprobar si la contraseña coincide con la variable de entorno
        if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
            // Contraseña correcta: Crear la sesión
            session.user = {
                isAdmin: true,
            };
            await session.save(); // Guardar la sesión
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
        // Comprobar si el error es específicamente por las variables de entorno KV
         if (error instanceof Error && error.message.includes('Missing required environment variables')) {
             return res.status(500).json({ message: 'Error de configuración del servidor: Faltan variables KV.' });
         }
        return res.status(500).json({ message: 'Error interno al procesar el login' });
    }
}
