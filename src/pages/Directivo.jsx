import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Directivo() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const hoy = new Date();
  const mañana = new Date(hoy);
  mañana.setDate(mañana.getDate() + 1);

  const ausenciasAprobadas = [
    { id: 1, docente: 'Laura Gómez', fecha: hoy, motivo: 'Asuntos Personales' },
    { id: 2, docente: 'Carlos Ruiz', fecha: mañana, motivo: 'Formación' },
    { id: 3, docente: 'Ana Martín', fecha: mañana, motivo: 'Médico' }
  ];

  const peticionesPendientes = [
    { id: 101, docente: 'Pedro Sánchez', fecha: '2023-12-05', motivo: 'Formación' },
  ];

  const mostrarAusenciasEnCalendario = ({ date, view }) => {
    if (view === 'month') {
      const ausenciasDelDia = ausenciasAprobadas.filter(
        (ausencia) => ausencia.fecha.toDateString() === date.toDateString()
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

  const resolverPeticion = (id, accion) => {
    alert(`Petición ${id} ${accion}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Jefatura de Estudios</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Calendario Global */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Calendario Global de Ausencias</h3>
          
          {/* estilos para el contenedor */}
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
              .filter(a => a.fecha.toDateString() === fechaSeleccionada.toDateString())
              .map(ausencia => (
                <li key={ausencia.id} className="bg-white p-3 rounded shadow-sm border-l-4 border-red-500">
                  <p className="font-semibold">{ausencia.docente}</p>
                  <p className="text-sm text-gray-600">{ausencia.motivo}</p>
                </li>
            ))}
            
            {ausenciasAprobadas.filter(a => a.fecha.toDateString() === fechaSeleccionada.toDateString()).length === 0 && (
              <p className="text-sm text-gray-500 italic">No hay ausencias planificadas para este día.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Gestor de Peticiones Pendientes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Peticiones Pendientes de Resolución</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b">Docente</th>
                <th className="p-3 border-b">Fecha</th>
                <th className="p-3 border-b">Motivo</th>
                <th className="p-3 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {peticionesPendientes.map(req => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{req.docente}</td>
                  <td className="p-3">{req.fecha}</td>
                  <td className="p-3">{req.motivo}</td>
                  <td className="p-3 flex gap-2">
                    <button 
                      onClick={() => resolverPeticion(req.id, 'Aprobada')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                    >
                      Aprobar
                    </button>
                    <button 
                      onClick={() => resolverPeticion(req.id, 'Denegada')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      Denegar
                    </button>
                  </td>
                </tr>
              ))}
              {peticionesPendientes.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">No hay peticiones pendientes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}