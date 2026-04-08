export default function Directivo() {
  const pendientes = [
    { id: 101, docente: 'Laura Gómez', fecha: '2023-11-20', motivo: 'Asuntos Personales' },
    { id: 102, docente: 'Carlos Ruiz', fecha: '2023-11-21', motivo: 'Formación' },
  ];

  const resolverPeticion = (id, accion) => {
    alert(`Petición ${id} ${accion}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Jefatura de Estudios</h2>

      {/* Calendario Global (Placeholder visual) */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-bold mb-4">Calendario Global de Ausencias</h3>
        <div className="h-48 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
          [Aquí se integrará el componente React-Calendar]
        </div>
      </div>

      {/* Gestor de Peticiones */}
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
              {pendientes.map(req => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{req.docente}</td>
                  <td className="p-3">{req.fecha}</td>
                  <td className="p-3">{req.motivo}</td>
                  <td className="p-3 flex gap-2">
                    <button 
                      onClick={() => resolverPeticion(req.id, 'Aprobada')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Aprobar
                    </button>
                    <button 
                      onClick={() => resolverPeticion(req.id, 'Denegada')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Denegar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}