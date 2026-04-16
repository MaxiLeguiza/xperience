import { useState } from 'react';
import { MapPin, Plus, Trash2, Route, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Location {
  id: number;
  name: string;
  sport: string;
  x: number; // Percentage position 0-100
  y: number; // Percentage position 0-100
}

interface RouteData {
  id: number;
  name: string;
  points: { x: number; y: number }[];
  color: string;
}

export function MapSection() {
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: 'Pico del Águila', sport: 'Parapente', x: 30, y: 40 },
    { id: 2, name: 'Costa Brava', sport: 'Surf', x: 70, y: 25 },
    { id: 3, name: 'Sierra Nevada', sport: 'Snowboard', x: 45, y: 75 },
    { id: 4, name: 'Montserrat', sport: 'Escalada', x: 60, y: 55 },
  ]);

  const [routes, setRoutes] = useState<RouteData[]>([
    {
      id: 1,
      name: 'Ruta Norte',
      points: [{ x: 30, y: 40 }, { x: 70, y: 25 }],
      color: '#ef4444'
    },
    {
      id: 2,
      name: 'Ruta Sur',
      points: [{ x: 45, y: 75 }, { x: 60, y: 55 }],
      color: '#d86015'
    }
  ]);

  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const handleAddLocation = () => {
    const newLocation: Location = {
      id: locations.length + 1,
      name: `Nueva Ubicación ${locations.length + 1}`,
      sport: 'Deporte Extremo',
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
    };
    setLocations([...locations, newLocation]);
    setIsAddingLocation(false);
  };

  const handleRemoveLocation = (id: number) => {
    setLocations(locations.filter(loc => loc.id !== id));
    if (selectedLocation === id) {
      setSelectedLocation(null);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingLocation) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newLocation: Location = {
      id: locations.length + 1,
      name: `Ubicación ${locations.length + 1}`,
      sport: 'Deporte Extremo',
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
    
    setLocations([...locations, newLocation]);
    setIsAddingLocation(false);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-[#ef4444]/10 to-[#d86015]/10 rounded-full border border-[#ef4444]/20">
            <span className="text-sm text-[#ef4444]">Explora el Mundo</span>
          </div>
          <h2 className="mb-4 text-black text-[96px]">Mapa de Aventuras</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-[20px]">
            Descubre y gestiona las mejores ubicaciones para deportes extremos. Crea rutas personalizadas y explora nuevos destinos.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar con controles */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-xl border-[#ef4444]/20 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-[#ef4444] to-[#d86015] rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-black">Gestión de Ubicaciones</h3>
              </div>

              <Button 
                onClick={() => setIsAddingLocation(true)}
                className="w-full mb-6 bg-gradient-to-r from-[#ef4444] to-[#d86015] hover:from-[#ef4444]/90 hover:to-[#d86015]/90 text-white hover:scale-105 transition-all"
                disabled={isAddingLocation}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Ubicación
              </Button>

              {isAddingLocation && (
                <div className="mb-6 p-4 bg-[#ef4444]/10 rounded-lg border border-[#ef4444]/30">
                  <p className="text-sm mb-3">Haz clic en el mapa para agregar una ubicación</p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setIsAddingLocation(false)} 
                      variant="outline" 
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Navigation className="w-4 h-4 text-slate-600" />
                  <h4 className="text-sm">Ubicaciones Activas ({locations.length})</h4>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className={`p-3 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                        selectedLocation === location.id ? 'border-[#ef4444] bg-[#ef4444]/10' : ''
                      }`}
                      onClick={() => setSelectedLocation(location.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm">{location.name}</p>
                          <p className="text-xs text-slate-500">{location.sport}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLocation(location.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <Route className="w-4 h-4 text-slate-600" />
                  <h4 className="text-sm">Rutas Disponibles</h4>
                </div>
                <div className="space-y-2">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className="flex items-center gap-2 p-2 bg-white border rounded"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: route.color }}
                      />
                      <span className="text-sm">{route.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-[600px] bg-gradient-to-br from-[#ef4444]/10 via-slate-100 to-[#d86015]/10 shadow-xl border-[#ef4444]/20 hover:shadow-2xl transition-shadow">
              <div 
                className="relative w-full h-full cursor-crosshair"
                onClick={handleMapClick}
              >
                {/* Grid lines para efecto de mapa */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Decorative terrain elements */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-400 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-400 rounded-full blur-3xl" />
                  <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-purple-400 rounded-full blur-2xl" />
                </div>

                {/* Routes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {routes.map((route) => {
                    const path = route.points.map((point, i) => 
                      `${i === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`
                    ).join(' ');
                    
                    return (
                      <path
                        key={route.id}
                        d={path}
                        fill="none"
                        stroke={route.color}
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                    );
                  })}
                </svg>

                {/* Location Markers */}
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 ${
                      selectedLocation === location.id ? 'scale-125 z-20' : 'z-10'
                    }`}
                    style={{ 
                      left: `${location.x}%`, 
                      top: `${location.y}%` 
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation(location.id);
                    }}
                  >
                    <div className="relative group cursor-pointer">
                      {/* Marker pin */}
                      <div className={`flex flex-col items-center ${
                        selectedLocation === location.id ? 'animate-bounce' : ''
                      }`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                          selectedLocation === location.id 
                            ? 'bg-[#ef4444] ring-4 ring-[#ef4444]/30' 
                            : 'bg-[#d86015] hover:bg-[#d86015]/90'
                        }`}>
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-[#d86015]" />
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
                          <p className="font-semibold">{location.name}</p>
                          <p className="text-xs text-slate-300">{location.sport}</p>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900" />
                        </div>
                      </div>

                      {/* Pulse effect for selected */}
                      {selectedLocation === location.id && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                          <div className="w-10 h-10 bg-[#ef4444] rounded-full animate-ping opacity-75" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <h4 className="text-xs mb-2">Leyenda</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>Ubicación</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-blue-500" style={{ borderTop: '2px dashed' }} />
                      <span>Ruta</span>
                    </div>
                  </div>
                </div>

                {/* Instructions overlay when adding */}
                {isAddingLocation && (
                  <div className="absolute inset-0 bg-[#ef4444]/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                    <div className="bg-white px-6 py-4 rounded-lg shadow-xl">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#ef4444]" />
                        Haz clic en el mapa para agregar una ubicación
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
