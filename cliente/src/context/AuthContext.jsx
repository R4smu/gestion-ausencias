import { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email) => {
    const correoLimpio = email.toLowerCase();
    const esDirectivo = correoLimpio.includes('directivo') || correoLimpio.includes('jefatura');
    const role = esDirectivo ? 'directivo' : 'docente';
    
    const parteNombre = email.split('@')[0];
    const name = esDirectivo 
      ? 'Jefatura de Estudios' 
      : parteNombre.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const usuarioLogueado = { role, name, email };
    setUser(usuarioLogueado);
    return role;
  };

  const logout = () => setUser(null);
  const contextValue = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};