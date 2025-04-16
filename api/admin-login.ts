    // api/admin-login.ts
    import type { VercelRequest, VercelResponse } from '@vercel/node';
    import jwt from 'jsonwebtoken'; // Importar jsonwebtoken

    // Define la estructura esperada del cuerpo de la petición
    interface LoginPayload {
      password?: string;
    }

    // Clave secreta para firmar el JWT (leer desde variable de entorno)
    const JWT_SECRET = process.env.JWT_SECRET;

    export default async function handler(req: VercelRequest, res: VercelResponse) {
        console.log("API Function /api/admin-login Start (JWT)");

        // Verificar que JWT_SECRET está configurado
        if (!JWT_SECRET) {
            console.error("JWT_SECRET environment variable is not set.");
            return res.status(500).json({ message: 'Error de configuración del servidor.' });
        }

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
            const adminPassword = process.env.ADMIN_PASSWORD;

            console.log(`ADMIN_PASSWORD Exists: ${!!adminPassword}`);

            // Comprobar si la contraseña coincide
            if (password && adminPassword && password === adminPassword) {
                // Contraseña correcta: Generar el token JWT
                console.log("Admin password correct. Generating JWT...");

                const payload = {
                    user: {
                        // Puedes añadir más datos si quieres, pero mantenlo simple
                        isAdmin: true,
                        // Podrías añadir un timestamp o un ID si quisieras
                    }
                };

                // Firmar el token para que expire en 7 días
                const token = jwt.sign(
                    payload,
                    JWT_SECRET,
                    { expiresIn: '7d' } // Token válido por 7 días
                );

                console.log("JWT generated successfully.");
                // Devolver el token al cliente
                return res.status(200).json({ success: true, token: token });

            } else {
                // Contraseña incorrecta o no proporcionada
                console.log("Admin login failed: Incorrect or missing password.");
                return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }

        } catch (error) {
            console.error("API Function End - Error Caught:", error);
            return res.status(500).json({ success: false, message: 'Error interno al procesar el login' });
        }
    }
    