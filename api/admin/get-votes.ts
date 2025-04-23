// api/admin/get-votes.ts
import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

// Clave secreta para verificar el JWT
const JWT_SECRET = process.env.JWT_SECRET;
const VOTE_KEY_PREFIX = 'vote:'; // Prefijo de las claves de votos

interface VoteResult {
    categorySlug: string;
    nomineeId: string;
    count: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log("API Function /api/admin/get-votes Start");

    // 1. Verificar Secreto JWT
    if (!JWT_SECRET) {
        console.error("JWT_SECRET environment variable is not set.");
        return res.status(500).json({ success: false, message: 'Error de configuración del servidor.' });
    }

    // 2. Verificar Token de Admin (Obligatorio para esta ruta)
    const authHeader = req.headers.authorization;
    let isAdmin = false;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { user?: { isAdmin?: boolean } };
            if (decoded.user?.isAdmin) {
                isAdmin = true;
                console.log("Admin token verified successfully for get-votes.");
            }
        } catch (error) {
            console.error("Admin token verification failed for get-votes:", error);
            // Si falla la verificación, no está autorizado
        }
    }

    if (!isAdmin) {
        console.log("Unauthorized attempt to get votes.");
        return res.status(403).json({ success: false, message: 'Acceso no autorizado.' });
    }

    // 3. Solo permitir GET
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).send(`Method ${req.method} Not Allowed`);
    }

    // 4. Obtener todos los votos de KV
    try {
        console.log(`Scanning KV for keys matching: ${VOTE_KEY_PREFIX}*`);
        const voteKeys: string[] = [];
        // kv.scanIterator busca claves que coincidan con el patrón
        for await (const key of kv.scanIterator({ match: `${VOTE_KEY_PREFIX}*` })) {
            voteKeys.push(key);
        }
        console.log(`Found ${voteKeys.length} vote keys.`);

        if (voteKeys.length === 0) {
            return res.status(200).json({ success: true, votes: [] }); // Devolver array vacío si no hay votos
        }

        // Obtener los valores (contadores) para cada clave
        // Usamos kv.mget para obtener múltiples valores en una sola llamada
        const voteCounts = await kv.mget<number[]>(...voteKeys);
        console.log("Retrieved vote counts.");

        // Procesar los resultados para devolver un formato útil
        const results: VoteResult[] = voteKeys.map((key, index) => {
            const count = voteCounts[index] || 0; // Obtener el contador (o 0 si es null)
            // Extraer categorySlug y nomineeId de la clave
            // Asume formato "vote:categorySlug:nomineeId"
            const parts = key.substring(VOTE_KEY_PREFIX.length).split(':');
            const categorySlug = parts[0] || 'unknown';
            const nomineeId = parts[1] || 'unknown';

            return { categorySlug, nomineeId, count };
        });

        console.log("API Function End - Success (get-votes)");
        return res.status(200).json({ success: true, votes: results });

    } catch (error) {
        console.error("API Function End - Error Caught during KV scan/get:", error);
        return res.status(500).json({ success: false, message: 'Error interno al obtener los votos.' });
    }
}
