// api/admin-login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withIronSessionApiRoute } from 'iron-session/next';
// --- MODIFICADO: Ruta de importación corregida ---
import { sessionOptions } from '../src/lib/session'; // Asumiendo que session.ts está en src/lib/
// --- FIN MODIFICACIÓN ---

// Define la estructura esperada del cuerpo de la petición
interface LoginPayload {
  password?: string;
}

// Envolvemos el handler con iron-session
export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: VercelRequest, res: VercelResponse) {
    // Solo permitir POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).send(`Method ${req.method} Not Allowed`);
    }

    const { password } = req.body as LoginPayload;

    // Comprobar si la contraseña coincide con la variable de entorno
    // ¡Asegúrate de que ADMIN_PASSWORD está definida en Vercel!
    if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
        // Contraseña correcta: Crear la sesión
        req.session.user = {
            isAdmin: true, // Marcar al usuario como admin en la sesión
        };
        await req.session.save(); // Guardar la sesión (esto establece la cookie)
        console.log("Admin login successful, session saved.");
        // Enviar respuesta OK (el frontend redirigirá)
        return res.status(200).json({ message: 'Login successful' });
    } else {
        // Contraseña incorrecta o no proporcionada
        console.log("Admin login failed: Incorrect or missing password.");
        // Enviar error de no autorizado
        return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    // Nota: No debería llegar aquí, pero por si acaso
    return res.status(500).json({ message: 'Error inesperado en login' });
}
