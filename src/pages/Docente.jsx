import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Docente() {
  const { user } = useContext(AuthContext);
  
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [diasDisponibles, setDiasDisponibles] = useState(4);

  const cargarDatosDocente = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/ausencias');
      if (response.ok) {
        const data = await response.json();
        const misAusencias = data.filter(ausencia => ausencia.docente === user?.name);
        setHistorial(misAusencias);
      }

      if (user?.name) {
        const diasResponse = await fetch(`http://localhost:8080/api/ausencias/dias/${user.name}`);
        if (diasResponse.ok) {
          const dias = await diasResponse.json();
          setDiasDisponibles(dias);
        }
      }
    } catch (error) {
      console.error("Error al cargar los datos del docente desde la API:", error);
    }
  };

  useEffect(() => {
    cargarDatosDocente();
  }, [user?.name]);

  const solicitarPermiso = async (e) => {
    e.preventDefault();

    if (motivo === 'Asuntos Personales' && diasDisponibles <= 0) {
      alert("No puedes solicitar más días de Asuntos Personales. Has agotado tu límite anual.");
      return;
    }

    const formData = new FormData();
    formData.append('docente', user.name);
    formData.append('fecha', fecha);
    formData.append('motivo', motivo);
    if (archivo) {
      formData.append('archivo', archivo);
    }

    try {
      const response = await fetch('http://localhost:8080/api/ausencias', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert("¡Solicitud guardada en el CPD del centro con éxito!");
        setFecha('');
        setMotivo('');
        setArchivo(null);
        document.getElementById('archivo-justificante').value = ''; 
        cargarDatosDocente();
      } else {
        const errorText = await response.text();
        alert(errorText || "Hubo un problema al procesar la solicitud.");
      }
    } catch (error) {
      console.error("Error de conexión con el backend:", error);
      alert("No se pudo conectar con el servidor backend.");
    }
  };

  const obtenerEstiloEstado = (estado) => {
    if (estado === 'Pendiente') return 'bg-yellow-100 text-yellow-800';
    if (estado === 'Aprobada') return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Panel Docente ({user?.name})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-blue-800">Días Disponibles</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{diasDisponibles}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Nueva Solicitud</h3>
          <form onSubmit={solicitarPermiso} className="flex flex-col gap-4">
            <div>
              <label htmlFor="fecha-ausencia" className="block text-sm font-medium mb-1">Fecha</label>
              <input 
                id="fecha-ausencia"
                type="date" 
                required 
                className="w-full border p-2 rounded" 
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="motivo-ausencia" className="block text-sm font-medium mb-1">Motivo</label>
              <select 
                id="motivo-ausencia"
                required 
                className="w-full border p-2 rounded"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              >
                <option value="">Selecciona un motivo...</option>
                <option value="Asistencia Médica">Asistencia Médica</option>
                <option value="Asuntos Personales">Asuntos Personales</option>
                <option value="Formación">Formación</option>
              </select>
            </div>
            
            {/* Campo para adjuntar justificante */}
            <div>
              <label htmlFor="archivo-justificante" className="block text-sm font-medium mb-1">
                Justificante (Opcional)
              </label>
              <input 
                id="archivo-justificante"
                type="file" 
                className="w-full text-sm border p-2 rounded bg-gray-50" 
                onChange={(e) => setArchivo(e.target.files[0])}
              />
              <p className="text-xs text-gray-500 mt-1">Sube un PDF o imagen si es necesario.</p>
            </div>

            <button type="submit" className="bg-blue-600 text-white py-2 rounded mt-2 hover:bg-blue-700 transition">
              Enviar Solicitud
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Mis Solicitudes</h3>
          {historial.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No tienes solicitudes registradas.</p>
          ) : (
            <ul className="divide-y">
              {historial.map(item => (
                <li key={item.id} className="py-4 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.fecha}</p>
                      <p className="text-sm text-gray-600">{item.motivo}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerEstiloEstado(item.estado)}`}>
                      {item.estado}
                    </span>
                  </div>
                  
                  {item.feedback && item.feedback !== 'Sin comentarios' && (
                    <div className="mt-2 text-xs bg-blue-50 text-blue-900 p-2 rounded border-l-4 border-blue-500">
                      <strong>Comentario:</strong> {item.feedback}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}