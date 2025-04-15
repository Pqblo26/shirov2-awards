// api/admin-login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
// --- MODIFICADO: Volver a importar el wrapper ---
import { withIronSessionApiRoute } from 'iron-session/next';
// --- FIN MODIFICACIÓN ---
import type { IronSessionOptions } from 'iron-session'; // Mantenemos la importación del TIPO

// Declaración del módulo para tipos de sesión
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      isAdmin: boolean;
    };
  }
}

// Definición de sessionOptions (se queda aquí)
const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: 'shiro-nexus-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  },
};

// Define la estructura esperada del cuerpo de la petición
interface LoginPayload {
  password?: string;
}

// --- MODIFICADO: Envolvemos la función loginRoute con el wrapper ---
export default withIronSessionApiRoute(loginRoute, sessionOptions);
// --- FIN MODIFICACIÓN ---

// La lógica principal ahora está en esta función separada
async function loginRoute(req: VercelRequest, res: VercelResponse) {
    // La sesión ahora está disponible en req.session gracias al wrapper
    console.log("API Function /api/admin-login Start (withIronSession)");

    // Verificar Variables de Entorno (Opcional)
    console.log("Checking Environment Variables:");
    console.log(`TEST_VAR Value: ${process.env.TEST_VAR}`);
    console.log(`ADMIN_PASSWORD Exists: ${!!process.env.ADMIN_PASSWORD}`);
    console.log(`SESSION_PASSWORD Exists: ${!!process.env.SESSION_PASSWORD}`);
    // ... (otros logs de KV si los necesitas) ...

    // Solo permitir POST
    if (req.method !== 'POST') {
        console.log("API Function End - Method Not Allowed");
        res.setHeader('Allow', ['POST']);
        return res.status(405).send(`Method ${req.method} Not Allowed`);
    }

    try {
        console.log("Request Body:", req.body);

        if (typeof req.body !== 'object' || req.body === null) {
            console.log("API Function End - Invalid Body");
            return res.status(400).json({ message: 'Cuerpo de la petición inválido o vacío.' });
        }

        const { password } = req.body as LoginPayload;

        // Comprobar si la contraseña coincide con la variable de entorno ADMIN_PASSWORD
        if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
            // Contraseña correcta: Crear la sesión
            // --- MODIFICADO: Usar req.session ---
            req.session.user = {
                isAdmin: true,
            };
            await req.session.save(); // Guardar la sesión
            // --- FIN MODIFICACIÓN ---
            console.log("Admin login successful, session saved.");
            return res.status(200).json({ message: 'Login successful' });
        } else {
            // Contraseña incorrecta o no proporcionada
            console.log("Admin login failed: Incorrect or missing password.");
            // Destruir cualquier sesión existente si el login falla (opcional pero bueno para seguridad)
            await req.session.destroy();
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

    } catch (error) {
        console.error("API Function End - Error Caught:", error);
        // Devolver respuesta de error genérico
        if (error instanceof Error && error.message.includes('Missing required environment variables')) {
             return res.status(500).json({ message: 'Error de configuración del servidor: Faltan variables KV.' });
        }
        // Devolver error genérico si no es uno específico
        return res.status(500).json({ message: 'Error interno al procesar el login' });
    }
}
