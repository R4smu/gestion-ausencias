import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null, 'docente', o 'directivo'

  const login = (role) => setUser({ role, name: role === 'docente' ? 'Prof. Pepe' : 'Jefatura' });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}