import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Directivo() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [ausencias, setAusencias] = useState([]); 
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});

  const cargarAusencias = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/ausencias');
      if (response.ok) {
        const data = await response.json();
        setAusencias(data);
      }
    } catch (error) {
      console.error("Error al cargar las ausencias de Jefatura:", error);
    }
  };

  useEffect(() => {
    cargarAusencias();
  }, []);

  const ausenciasAprobadas = ausencias.filter(a => a.estado === 'Aprobada');
  const peticionesPendientes = ausencias.filter(a => a.estado === 'Pendiente');

  const mostrarAusenciasEnCalendario = ({ date, view }) => {
    if (view === 'month') {
      const ausenciasDelDia = ausenciasAprobadas.filter(
        (ausencia) => new Date(ausencia.fecha).toDateString() === date.toDateString()
      );
      if (ausenciasDelDia.length > 0) {
        return (
          <div className="mt-1 flex flex-col gap-1">
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1 rounded-sm w-full truncate">
              {ausenciasDelDia.length} Ausencia{ausenciasDelDia.length > 1 ? 's' : ''}
            </span>
          </div>
        );
      }
    }
    return null;
  };

  const resolverPeticion = async (id, accion) => {
    const comentario = feedbacks[id] || "Sin comentarios";
    const estadoFinal = accion === 'Aprobada' ? 'Aprobada' : 'Denegada';

    try {
      const response = await fetch(`http://localhost:8080/api/ausencias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: estadoFinal,
          feedback: comentario
        })
      });

      if (response.ok) {
        alert(`Petición #${id} resuelta como ${estadoFinal} con éxito.`);
        cargarAusencias(); 
      } else {
        alert("Error al procesar la resolución en el servidor.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  const resolverMasivo = async (accion) => {
    if (seleccionadas.length === 0) return alert("Selecciona al menos una petición.");
    
    const estadoFinal = accion === 'aprobado' ? 'Aprobada' : 'Denegada';

    try {
      await Promise.all(seleccionadas.map(id => {
        const comentario = feedbacks[id] || "Resolución masiva por Jefatura de Estudios";
        return fetch(`http://localhost:8080/api/ausencias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: estadoFinal, feedback: comentario })
        });
      }));

      alert(`Se han procesado ${seleccionadas.length} peticiones de forma masiva.`);
      setSeleccionadas([]); 
      cargarAusencias();    
    } catch (error) {
      console.error("Error en la resolución masiva:", error);
      alert("Hubo un problema al procesar la acción masiva.");
    }
  };

  const toggleSeleccion = (id) => {
    if (seleccionadas.includes(id)) {
      setSeleccionadas(seleccionadas.filter(item => item !== id));
    } else {
      setSeleccionadas([...seleccionadas, id]);
    }
  };

  const seleccionarTodas = () => {
    if (seleccionadas.length === peticionesPendientes.length) {
      setSeleccionadas([]);
    } else {
      setSeleccionadas(peticionesPendientes.map(p => p.id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Jefatura de Estudios</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Calendario Global */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Calendario Global de Ausencias</h3>
          <div className="flex justify-center [&_.react-calendar]:border-none [&_.react-calendar]:w-full [&_.react-calendar]:font-sans [&_.react-calendar__tile--active]:bg-blue-600 [&_.react-calendar__tile--active]:text-white [&_.react-calendar__tile]:rounded-md [&_.react-calendar__tile]:p-2 [&_.react-calendar__tile:hover]:bg-blue-50">
            <Calendar 
              onChange={setFechaSeleccionada} 
              value={fechaSeleccionada}
              tileContent={mostrarAusenciasEnCalendario}
              className="shadow-sm border rounded-lg p-4"
            />
          </div>
        </div>

        {/* Panel lateral */}
        <div className="bg-gray-50 p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Ausencias del {fechaSeleccionada.toLocaleDateString()}
          </h3>
          <ul className="flex flex-col gap-3">
            {ausenciasAprobadas
              .filter(a => new Date(a.fecha).toDateString() === fechaSeleccionada.toDateString())
              .map(ausencia => (
                <li key={ausencia.id} className="bg-white p-3 rounded shadow-sm border-l-4 border-red-500">
                  <p className="font-semibold">{ausencia.docente}</p>
                  <p className="text-sm text-gray-600">{ausencia.motivo}</p>
                </li>
            ))}
            {ausenciasAprobadas.filter(a => new Date(a.fecha).toDateString() === fechaSeleccionada.toDateString()).length === 0 && (
              <p className="text-sm text-gray-500 italic">No hay ausencias planificadas.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Gestor de Peticiones Pendientes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-xl font-bold">Gestor de Peticiones</h3>
          
          <div className="flex gap-2">
            <button onClick={() => resolverMasivo('aprobado')} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition">
              Aprobar Seleccionadas
            </button>
            <button onClick={() => resolverMasivo('denegado')} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition">
              Denegar Seleccionadas
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b text-center">
                  <input 
                    type="checkbox" 
                    aria-label="Seleccionar todas las peticiones"
                    checked={seleccionadas.length === peticionesPendientes.length && peticionesPendientes.length > 0} 
                    onChange={seleccionarTodas} 
                  />
                </th>
                <th className="p-3 border-b">Docente</th>
                <th className="p-3 border-b">Fecha y Motivo</th>
                <th className="p-3 border-b text-center">Doc.</th>
                <th className="p-3 border-b">Feedback / Comentarios</th>
                <th className="p-3 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {peticionesPendientes.map(req => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-center">
                    <input 
                      type="checkbox" 
                      aria-label={`Seleccionar petición de ${req.docente}`}
                      checked={seleccionadas.includes(req.id)} 
                      onChange={() => toggleSeleccion(req.id)} 
                    />
                  </td>
                  <td className="p-3 font-medium">{req.docente}</td>
                  <td className="p-3">
                    <div>{req.fecha.toString()}</div>
                    <div className="text-xs text-gray-500">{req.motivo}</div>
                  </td>
                  
                  {/* Enlace para visualizar el archivo subido si existe */}
                  <td className="p-3 text-center">
                    {req.archivoAdjunto ? (
                      <a 
                        href={`http://localhost:8080/api/ausencias/archivos/${req.archivoAdjunto}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-semibold flex flex-col items-center"
                        title="Ver justificante"
                      >
                        <span>Ver Archivo</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <input 
                      type="text" 
                      placeholder="Añadir comentario..." 
                      className="border p-1 w-full text-sm rounded"
                      value={feedbacks[req.id] || ''}
                      onChange={(e) => setFeedbacks({...feedbacks, [req.id]: e.target.value})}
                    />
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => resolverPeticion(req.id, 'Aprobada')} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                      ✓
                    </button>
                    <button onClick={() => resolverPeticion(req.id, 'Denegada')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {peticionesPendientes.length === 0 && (
            <p className="p-4 text-sm text-gray-500 text-center italic">No hay peticiones de ausencia pendientes de revisar.</p>
          )}
        </div>
      </div>
    </div>
  );
}