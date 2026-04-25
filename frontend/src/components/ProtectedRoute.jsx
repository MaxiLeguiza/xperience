import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

/**
 * ProtectedRoute - Componente que protege rutas que requieren autenticación
 * 
 * ¿CÓMO FUNCIONA?
 * 1. Verifica si el usuario tiene sesión activa (auth en el contexto)
 * 2. Si está logueado → muestra el componente solicitado
 * 3. Si NO está logueado → redirige a /login
 * 4. Mientras carga → muestra un loading
 * 
 * EJEMPLO DE USO:
 * <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  // Obtenemos el estado de autenticación del contexto
  const { auth, isLoading } = useContext(AuthContext);

  // Mientras carga, mostrar loading
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  // Si no hay usuario logueado, redirigimos a login
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario logueado, mostramos el componente
  return children;
}
