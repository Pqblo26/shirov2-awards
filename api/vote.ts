    // api/vote.ts
    import { kv } from '@vercel/kv';
    import type { NextApiRequest, NextApiResponse } from 'next'; // O usa la interfaz de Vercel si no usas Next

    // Define la estructura esperada del cuerpo de la petición
    interface VotePayload {
      categorySlug: string;
      nomineeId: string;
    }

    export default async function handler(
      req: NextApiRequest, // O VercelApiRequest
      res: NextApiResponse  // O VercelApiResponse
    ) {
      // Solo permitir peticiones POST
      if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }

      try {
        const { categorySlug, nomineeId } = req.body as VotePayload;

        // Validar datos básicos
        if (!categorySlug || !nomineeId) {
          return res.status(400).json({ message: 'Faltan categorySlug o nomineeId' });
        }

        // Crear una clave única para este nominado en esta categoría
        // Ejemplo: vote:mejor-opening-2025:op-id-1
        const key = `vote:${categorySlug}:${nomineeId}`;

        // Incrementar el contador en Vercel KV
        // kv.incr() incrementa el valor de la clave en 1. Si no existe, la crea con valor 1.
        const newCount = await kv.incr(key);

        console.log(`Voto registrado para ${key}. Nuevo contador: ${newCount}`);

        // Enviar respuesta de éxito
        return res.status(200).json({ message: 'Voto registrado con éxito', nomineeId: nomineeId, categorySlug: categorySlug, newCount: newCount });

      } catch (error) {
        console.error('Error al registrar el voto:', error);
        // Enviar respuesta de error genérico
        return res.status(500).json({ message: 'Error interno al registrar el voto' });
      }
    }
    ```
    *Nota: Este código asume una estructura tipo Next.js para `req` y `res`. Si usas Vite puro con Vercel, puede que necesites ajustar ligeramente los tipos o la forma de acceder al body, pero la lógica con `kv.incr(key)` es la mism