import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consentimiento, setConsentimiento] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!consentimiento) {
      alert("Debes aceptar el tratamiento de datos para continuar.");
      return;
    }

    if (!email.endsWith('@iesalbarregas.es')) {
      alert("Por favor, introduce un correo corporativo válido del centro (@iesalbarregas.es).");
      return;
    }

    const role = login(email);
    
    if (role === 'directivo') {
      navigate('/directivo');
    } else {
      navigate('/docente');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Portal del Instituto</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium mb-1 text-gray-700">
              Correo Electrónico Corporativo
            </label>
            <input 
              id="login-email"
              type="email" 
              required
              placeholder="ej: pepe.perez@iesalbarregas.es"
              className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium mb-1 text-gray-700">
              Contraseña
            </label>
            <input 
              id="login-password"
              type="password" 
              required
              placeholder="••••••••"
              className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded text-sm text-gray-700 my-2 border border-blue-100">
            <label htmlFor="check-consentimiento" className="flex items-start gap-2 cursor-pointer">
              <input 
                id="check-consentimiento"
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

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 p-3 bg-gray-50 border rounded text-xs text-gray-500">
          <p className="font-semibold mb-1">Credenciales de ejemplo para pruebas:</p>
          <ul className="list-disc pl-4 space-y-1 mb-2">
            <li>Para entrar como <strong>Docente</strong>: <code>tunombre + @iesalbarregas.es</code></li>
            <li>Para entrar como <strong>Directivo</strong>: <code>directivo@iesalbarregas.es</code></li>
          </ul>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="italic text-gray-400">
              * Nota: Al tratarse de un entorno de demostración (MVP), el campo de <strong>contraseña</strong> admite cualquier valor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}