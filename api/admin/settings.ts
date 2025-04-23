// api/admin/settings.ts
import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

// Clave secreta para verificar el JWT (leer desde variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET;
const SETTINGS_KEY = 'site-settings'; // Clave única para guardar los ajustes en KV

interface SiteSettings {
  showPremios?: boolean;
  // Añadir aquí más ajustes en el futuro
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log(`API Function /api/admin/settings Start - Method: ${req.method}`);

    // 1. Verificar Secreto JWT
    if (!JWT_SECRET) {
        console.error("JWT_SECRET environment variable is not set.");
        return res.status(500).json({ success: false, message: 'Error de configuración del servidor.' });
    }

    // 2. Verificar Token de Admin
    const authHeader = req.headers.authorization;
    let isAdmin = false;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { user?: { isAdmin?: boolean } };
            if (decoded.user?.isAdmin) {
                isAdmin = true;
                console.log("Admin token verified successfully.");
            } else {
                 console.log("Token valid, but user is not admin.");
            }
        } catch (error) {
            console.error("Admin token verification failed:", error);
            // No devolver error aquí todavía, lo haremos si intenta escribir
        }
    }

    // --- Manejar GET (Leer Ajustes) ---
    if (req.method === 'GET') {
        try {
            console.log(`Attempting kv.get for key: ${SETTINGS_KEY}`);
            const settings = await kv.get<SiteSettings>(SETTINGS_KEY);
            console.log("Settings retrieved:", settings);
            // Devolver los ajustes (o un objeto vacío si no existen)
            // Cualquiera puede leer los ajustes (la protección está en el frontend)
            return res.status(200).json({ success: true, settings: settings || {} });
        } catch (error) {
            console.error(`Error getting settings from KV (Key: ${SETTINGS_KEY}):`, error);
            return res.status(500).json({ success: false, message: 'Error al leer los ajustes.' });
        }
    }

    // --- Manejar POST (Actualizar Ajustes) ---
    if (req.method === 'POST') {
        // ¡Solo permitir si es admin!
        if (!isAdmin) {
            console.log("Attempted POST without admin token.");
            return res.status(403).json({ success: false, message: 'Acceso no autorizado.' });
        }

        try {
            const newSettings = req.body as Partial<SiteSettings>; // Acepta ajustes parciales

            if (typeof newSettings !== 'object' || newSettings === null) {
                return res.status(400).json({ success: false, message: 'Cuerpo de la petición inválido.' });
            }

            console.log(`Attempting to update settings with:`, newSettings);

            // Leer ajustes actuales para fusionar (opcional, kv.set sobrescribe)
            // const currentSettings = await kv.get<SiteSettings>(SETTINGS_KEY) || {};
            // const updatedSettings = { ...currentSettings, ...newSettings };

            // Usamos kv.set para guardar el objeto completo (o parcial si solo envías lo que cambia)
            // kv.set sobrescribirá la clave SETTINGS_KEY con el nuevo objeto
            await kv.set(SETTINGS_KEY, newSettings);

            console.log("Settings updated successfully in KV.");
            return res.status(200).json({ success: true, settings: newSettings });

        } catch (error) {
            console.error(`Error setting settings in KV (Key: ${SETTINGS_KEY}):`, error);
            return res.status(500).json({ success: false, message: 'Error al guardar los ajustes.' });
        }
    }

    // Si no es GET ni POST (y tiene token válido)
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).send(`Method ${req.method} Not Allowed`);
}
