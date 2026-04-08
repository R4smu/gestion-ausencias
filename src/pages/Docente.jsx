import { useState } from 'react';

export default function Docente() {
  const [historial, setHistorial] = useState([
    { id: 1, fecha: '2023-11-15', motivo: 'Cita Médica', estado: 'Aprobada' }
  ]);

  const solicitarPermiso = (e) => {
    e.preventDefault();

    alert("Solicitud enviada a Jefatura");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Panel Docente</h2>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-blue-800">Días Disponibles</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Nueva Solicitud</h3>
          <form onSubmit={solicitarPermiso} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input type="date" required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Motivo</label>
              <select required className="w-full border p-2 rounded">
                <option value="">Selecciona un motivo...</option>
                <option value="medico">Asistencia Médica</option>
                <option value="personales">Asuntos Personales</option>
                <option value="formacion">Formación</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Justificante (Opcional)</label>
              <input type="file" className="w-full" />
            </div>
            <button type="submit" className="bg-blue-600 text-white py-2 rounded mt-2 hover:bg-blue-700">
              Enviar Solicitud
            </button>
          </form>
        </div>

        {/* Historial */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Mis Solicitudes</h3>
          <ul className="divide-y">
            {historial.map(item => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.fecha}</p>
                  <p className="text-sm text-gray-600">{item.motivo}</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {item.estado}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}