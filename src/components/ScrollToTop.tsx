import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que hace scroll hasta la parte superior de la ventana
 * cada vez que cambia la ruta (pathname).
 */
function ScrollToTop() {
  // Obtiene el objeto location actual, que contiene información sobre la URL
  const { pathname } = useLocation();

  // useEffect se ejecuta cada vez que el valor de 'pathname' cambia
  useEffect(() => {
    // Hace scroll de la ventana a la posición (0, 0) - arriba del todo
    window.scrollTo(0, 0);
    // El array de dependencias [pathname] asegura que el efecto
    // solo se ejecute cuando la ruta cambie.
  }, [pathname]);

  // Este componente no renderiza nada visualmente
  return null;
}

export default ScrollToTop;
