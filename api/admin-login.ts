// api/admin-login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
// --- MODIFICADO: Importar 'ironSession' y 'IronSessionOptions' ---
import { ironSession, type IronSessionOptions } from 'iron-session';
// --- FIN MODIFICACIÓN ---

// --- ELIMINADO: Import de sessionOptions desde archivo externo ---
// import { sessionOptions } from '../src/lib/session';

// --- AÑADIDO: Declaración del módulo para tipos de sesión ---
// (Necesario aquí si session.ts ya no se importa o se elimina)
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      isAdmin: boolean;
    };
  }
}
// --- FIN AÑADIDO ---

// --- AÑADIDO: Definición de sessionOptions directamente aquí ---
const sessionOptions: IronSessionOptions = {
  // ¡MUY IMPORTANTE! Usa la variable de entorno que creaste.
  // Debe ser una cadena secreta larga y compleja (mínimo 32 caracteres).
  password: process.env.SESSION_PASSWORD as string, // Asegúrate que SESSION_PASSWORD está en Vercel Env Vars
  cookieName: 'shiro-nexus-admin-session', // Nombre de la cookie
  // Configuración recomendada para cookies seguras en producción
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    httpOnly: true, // No accesible por JavaScript del cliente
    sameSite: 'lax', // Protección CSRF
    maxAge: 60 * 60 * 24 * 7 // Duración: 7 días (en segundos)
    // path: '/', // Opcional: define el path de la cookie
  },
};
// --- FIN AÑADIDO ---


// Define la estructura esperada del cuerpo de la petición
interface LoginPayload {
  password?: string;
}

// Exportamos la función handler directamente
export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log("API Function /api/admin-login Start");

    // Verificar Variables de Entorno (Opcional, quitar si ya funciona)
    console.log("Checking Environment Variables:");
    console.log(`TEST_VAR Value: ${process.env.TEST_VAR}`);
    console.log(`ADMIN_PASSWORD Exists: ${!!process.env.ADMIN_PASSWORD}`); // Verificar la contraseña de admin
    console.log(`SESSION_PASSWORD Exists: ${!!process.env.SESSION_PASSWORD}`); // Verificar la contraseña de sesión
    console.log(`KV_REST_API_URL Exists: ${!!process.env.KV_REST_API_URL}`);
    console.log(`KV_REST_API_TOKEN Exists: ${!!process.env.KV_REST_API_TOKEN}`);

    // Solo permitir POST
    if (req.method !== 'POST') {
        console.log("API Function End - Method Not Allowed");
        res.setHeader('Allow', ['POST']);
        return res.status(405).send(`Method ${req.method} Not Allowed`);
    }

    try {
        // Obtener la sesión usando las opciones definidas arriba
        const session = await ironSession(req, res, sessionOptions);

        console.log("Request Body:", req.body);

        if (typeof req.body !== 'object' || req.body === null) {
            console.log("API Function End - Invalid Body");
            return res.status(400).json({ message: 'Cuerpo de la petición inválido o vacío.' });
        }

        const { password } = req.body as LoginPayload;

        // Comprobar si la contraseña coincide con la variable de entorno ADMIN_PASSWORD
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
        // Ya no debería dar error de módulo no encontrado, pero mantenemos la comprobación KV por si acaso
        if (error instanceof Error && error.message.includes('Missing required environment variables')) {
             return res.status(500).json({ message: 'Error de configuración del servidor: Faltan variables KV.' });
        }
        return res.status(500).json({ message: 'Error interno al procesar el login' });
    }
}
