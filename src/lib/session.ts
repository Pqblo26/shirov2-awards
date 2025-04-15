    // src/lib/session.ts
    import type { IronSessionOptions } from 'iron-session';

    // Define la estructura de los datos de sesión
    declare module 'iron-session' {
      interface IronSessionData {
        user?: {
          isAdmin: boolean;
        };
      }
    }

    // Configuración de la sesión
    export const sessionOptions: IronSessionOptions = {
      // ¡MUY IMPORTANTE! Usa la variable de entorno que creaste.
      // Debe ser una cadena secreta larga y compleja (mínimo 32 caracteres).
      password: process.env.SESSION_PASSWORD as string,
      cookieName: 'shiro-nexus-admin-session', // Nombre de la cookie
      // Configuración recomendada para cookies seguras en producción
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        httpOnly: true, // No accesible por JavaScript del cliente
        sameSite: 'lax', // Protección CSRF
        maxAge: 60 * 60 * 24 * 7 // Duración: 7 días (en segundos)
        // path: '/', // Opcional: define el path de la cooki
      },
    };
    