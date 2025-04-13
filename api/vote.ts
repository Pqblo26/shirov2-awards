// api/vote.ts
import { kv } from '@vercel/kv';
// --- MODIFICADO: Usar tipos de @vercel/node ---
import type { VercelRequest, VercelResponse } from '@vercel/node';
// --- FIN MODIFICACIÓN ---

// Define la estructura esperada del cuerpo de la petición
interface VotePayload {
  categorySlug: string;
  nomineeId: string;
}

export default async function handler(
  // --- MODIFICADO: Usar tipos VercelRequest y VercelResponse ---
  req: VercelRequest,
  res: VercelResponse
  // --- FIN MODIFICACIÓN ---
) {
  // Solo permitir peticiones POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    // --- MODIFICADO: Usar .send() en lugar de .end() ---
    return res.status(405).send(`Method ${req.method} Not Allowed`);
    // --- FIN MODIFICACIÓN ---
  }

  let key: string | undefined; // Definir key fuera del try para usarla en el catch si es necesario

  try {
    // Asegurarse de que req.body existe y es un objeto antes de castear
    if (typeof req.body !== 'object' || req.body === null) {
        return res.status(400).json({ message: 'Cuerpo de la petición inválido o vacío.' });
    }

    // Castear de forma más segura
    const { categorySlug, nomineeId } = req.body as VotePayload;

    // Validar datos básicos
    if (!categorySlug || !nomineeId) {
      return res.status(400).json({ message: 'Faltan categorySlug o nomineeId' });
    }

    // Crear una clave única para este nominado en esta categoría
    key = `vote:${categorySlug}:${nomineeId}`;

    // Incrementar el contador en Vercel KV
    const newCount = await kv.incr(key);

    console.log(`Voto registrado para ${key}. Nuevo contador: ${newCount}`);

    // Enviar respuesta de éxito
    return res.status(200).json({ message: 'Voto registrado con éxito', nomineeId: nomineeId, categorySlug: categorySlug, newCount: newCount });

  } catch (error) {
     // --- MODIFICADO: Corregido el console.error ---
    console.error(`Error al registrar el voto (Key: ${key ?? 'desconocida'}):`, error);
    // --- FIN MODIFICACIÓN ---
    return res.status(500).json({ message: 'Error interno al registrar el voto' });
  }
}
