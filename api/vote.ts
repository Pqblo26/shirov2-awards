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
  console.log("API Function /api/vote Start"); // Log inicial

  if (req.method !== 'POST') {
    console.log("API Function End - Method Not Allowed");
    res.setHeader('Allow', ['POST']);
    return res.status(405).send(`Method ${req.method} Not Allowed`);
  }

  let key: string | undefined;

  try {
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
    // --- MODIFICADO: console.error simplificado ---
    console.error("API Function End - Error Caught:", error);
    // --- FIN MODIFICACIÓN ---
    return res.status(500).json({ message: 'Error interno al registrar el voto' });
  }
}
