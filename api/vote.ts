// api/vote.ts
import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface VotePayload {
  categorySlug: string;
  nomineeId: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  console.log("API Function /api/vote Start");

  // --- VERIFICACIÓN MANUAL DE VARIABLES DE ENTORNO ---
  console.log("Checking Environment Variables:");
  console.log(`KV_REST_API_URL Exists: ${!!process.env.KV_REST_API_URL}`); // Log true/false if it exists
  console.log(`KV_REST_API_TOKEN Exists: ${!!process.env.KV_REST_API_TOKEN}`); // Log true/false if it exists
  // Opcional: Loguear parte de la URL para confirmar que es la correcta (¡NUNCA loguear el TOKEN completo!)
  if (process.env.KV_REST_API_URL) {
    console.log(`KV_REST_API_URL Starts With: ${process.env.KV_REST_API_URL.substring(0, 20)}...`);
  }
  // --- FIN VERIFICACIÓN ---

  if (req.method !== 'POST') {
    console.log("API Function End - Method Not Allowed");
    res.setHeader('Allow', ['POST']);
    return res.status(405).send(`Method ${req.method} Not Allowed`);
  }

  let key: string | undefined;

  try {
    // Test de conexión temprano (lo mantenemos por si acaso)
    console.log("Attempting initial KV connection test (kv.get('test-connection'))");
    await kv.get('test-connection');
    console.log("Initial KV connection test successful.");

    console.log("Request Body:", req.body);

    if (typeof req.body !== 'object' || req.body === null) {
        console.log("API Function End - Invalid Body");
        return res.status(400).json({ message: 'Cuerpo de la petición inválido o vacío.' });
    }

    const { categorySlug, nomineeId } = req.body as VotePayload;

    if (!categorySlug || !nomineeId) {
      console.log("API Function End - Missing Data");
      return res.status(400).json({ message: 'Faltan categorySlug o nomineeId' });
    }

    key = `vote:${categorySlug}:${nomineeId}`;
    console.log(`Constructed KV Key: ${key}`);

    console.log(`Attempting kv.incr for key: ${key}`);
    const newCount = await kv.incr(key);
    console.log(`kv.incr successful. New count for ${key}: ${newCount}`);

    console.log("API Function End - Success");
    return res.status(200).json({ message: 'Voto registrado con éxito', nomineeId: nomineeId, categorySlug: categorySlug, newCount: newCount });

  } catch (error) {
    console.error("API Function End - Error Caught:", error);
    // Devolver respuesta de hola
    if (error instanceof Error && error.message.includes('Missing required environment variables')) {
         return res.status(500).json({ message: 'Error de configuración del servidor: Faltan variables KV.' });
    }
    return res.status(500).json({ message: 'Error interno al registrar el voto' });
  }
}
