// api/admin-login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define la estructura esperada del cuerpo de la petición
interface LoginPayload {
  password?: string;
}

// Exportamos la función handler directamente
export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log("API Function /api/admin-login Start (Simplified Test)");

    // Solo permitir POST
    if (req.method !== 'POST') {
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
        const adminPassword = process.env.ADMIN_PASSWORD; // Leer contraseña del admin

        console.log(`ADMIN_PASSWORD Exists: ${!!adminPassword}`);

        // Comprobar si la contraseña coincide
        if (password && adminPassword && password === adminPassword) {
            // Contraseña correcta: Devolver éxito (sin sesión)
            console.log("Admin login successful (Password check only).");
            // Nota: Esto NO inicia sesión realmente, solo verifica la contraseña
            return res.status(200).json({ message: 'Password OK (Test)' });
        } else {
            // Contraseña incorrecta o no proporcionada
            console.log("Admin login failed: Incorrect or missing password.");
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

    } catch (error) {
        console.error("API Function End - Error Caught:", error);
        return res.status(500).json({ message: 'Error interno al procesar el login' });
    }
}
