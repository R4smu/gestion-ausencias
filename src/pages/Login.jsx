import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [consentimiento, setConsentimiento] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (!consentimiento) {
      alert("Debes aceptar el tratamiento de datos para continuar.");
      return;
    }
    login(role);
    navigate(role === 'docente' ? '/docente' : '/directivo');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Portal del Instituto</h1>
        
        <div className="mb-6 bg-blue-50 p-4 rounded text-sm text-gray-700">
          <label className="flex items-start gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1"
              checked={consentimiento}
              onChange={(e) => setConsentimiento(e.target.checked)}
            />
            <span>
              <strong>Consentimiento de Datos:</strong> Acepto que mis datos personales (nombre, correo corporativo y horarios) sean almacenados en el CPD del centro exclusivamente para la gestión de ausencias.
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleLogin('docente')}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Acceso Personal Docente
          </button>
          <button 
            onClick={() => handleLogin('directivo')}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Acceso Equipo Directivo
          </button>
        </div>
      </div>
    </div>
  );
}