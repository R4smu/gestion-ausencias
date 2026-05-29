import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Docente from './pages/Docente';
import Directivo from './pages/Directivo';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/" />;
  if (user.role !== roleRequired) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {user && (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <span className="font-bold">App Ausencias IES Albarregas - {user.name}</span>
          <button onClick={logout} className="bg-red-600 px-4 py-1 rounded">Cerrar Sesión</button>
        </nav>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/docente" element={<PrivateRoute roleRequired="docente"><Docente /></PrivateRoute>} />
        <Route path="/directivo" element={<PrivateRoute roleRequired="directivo"><Directivo /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}