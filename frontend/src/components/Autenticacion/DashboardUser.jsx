import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { CalendarDays, MapPin, Loader2, Ticket, Compass, Download, XCircle } from 'lucide-react'; 
import Nav from "../Navbar/Nav"; 
// 1. IMPORTA TU CLIENTE AXIOS CONFIGURADO
// Asegúrate de que esta ruta relativa sea correcta hacia tu archivo src/config/axios.js
import clienteAxios from "../../config/axios"; 

export default function DashboardUser() {
    const { auth } = useAuth();

    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelingId, setCancelingId] = useState(null); 

    useEffect(() => {
        const obtenerReservas = async () => {
            try {
                setLoading(true);
                // 2. USA AXIOS EN LUGAR DE FETCH. 
                // Ya no necesitas poner el dominio completo ni los headers manualmente (el interceptor lo hace).
                const { data } = await clienteAxios.get("/api/reserva/mis-reservas");
                
                // Axios ya convierte automáticamente la respuesta a JSON
                setReservas(data);
            } catch (err) {
                // Axios guarda el mensaje de error del backend en err.response.data.message
                console.error("Error al conectar con la BD:", err);
                const msg = err.response?.data?.message || "No se pudor conectar con el servidor";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        if (auth) {
            obtenerReservas();
        }
    }, [auth]);

    // --------------------------------------------------------
    // FUNCIONALIDADES DE LOS BOTONES CORREGIDAS
    // --------------------------------------------------------

    const handleCancelarReserva = async (idReserva) => {
        const confirmar = window.confirm("¿Estás seguro que deseas cancelar esta aventura? Esta acción no se puede deshacer.");
        if (!confirmar) return;

        try {
            setCancelingId(idReserva); 
            
            // 3. USA AXIOS PATCH AQUÍ TAMBIÉN. Sin URL quemada.
            await clienteAxios.patch(`/api/reserva/${idReserva}/cancel`);

            // Si fue exitoso (Axios no lanzó error), actualizamos la UI
            setReservas(reservasAnteriores => 
                reservasAnteriores.map(res => 
                    res._id === idReserva ? { ...res, estado: 'cancelada' } : res
                )
            );

        } catch (err) {
            console.error("Error cancelando:", err);
            const msg = err.response?.data?.message || "No se pudo cancelar la reserva.";
            alert(msg);
        } finally {
            setCancelingId(null); 
        }
    };

    // 4. Lógica para Descargar Comprobante (Esta no requería cambios de red, se mantiene igual)
    const handleDescargarTicket = (reserva) => {
        const nombreActividad = reserva.items && reserva.items.length > 0
            ? reserva.items.map(item => item.nombre).join(' + ')
            : 'Actividad Xperience';
            
        const fechaFormateada = new Date(reserva.fecha).toLocaleDateString('es-AR');

        const contenidoTicket = `
=========================================
      TICKET DE RESERVA - XPERIENCE
=========================================
Identificación de Reserva: ${reserva._id}
Estado: ${reserva.estado.toUpperCase()}
Cliente: ${reserva.nombre} ${reserva.apellido || ''}
Email: ${reserva.email}
=========================================
        Datos de la Experiencia
=========================================        
Actividad: ${nombreActividad}
Fecha: ${fechaFormateada}
Lugar: Mendoza, Argentina

TOTAL ABONADO: $${reserva.total}
Método de Pago: ${reserva.paymentMethod || 'No especificado'}
=========================================
¡Gracias por confiar en nosotros!
        `;

        const blob = new Blob([contenidoTicket], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Ticket_Xperience_${reserva._id}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    // --------------------------------------------------------
    // El resto del renderizado se mantiene igual
    // --------------------------------------------------------

    const getEstadoStyles = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'confirmada': case 'confirmed': 
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'pendiente': case 'pending': 
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'cancelada': case 'cancelled': 
                return 'bg-red-500/10 text-red-400 border-red-500/20 opacity-75';
            default: 
                return 'bg-neutral-800 text-neutral-300 border-neutral-700';
        }
    };

    const formatearDinero = (monto) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(monto || 0);
    };

    if (loading) {
        return (
            <>
                <Nav />
                <div className="min-h-screen bg-card-dark text-white flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
                    <p className="text-neutral-400 font-medium tracking-wide animate-pulse">Cargando tus aventuras...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Nav />
                <div className="min-h-screen bg-card-dark text-white flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 mb-2">
                        <div className="text-red-500 text-3xl font-bold">⚠️</div>
                    </div>
                    <h2 className="text-xl font-semibold text-white">No pudimos cargar tus datos</h2>
                    <p className="text-neutral-400 max-w-md">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-500 transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                    >
                        Reintentar
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Nav />
            <main className="min-h-screen bg-card-white text-white p-6 md:p-12 lg:px-24">
                <header className="mb-12 pb-6 border-b border-neutral-800/80">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 tracking-tight mb-3">
                        Mi cuenta
                    </h1>
                    <p className="text-black text-lg md:text-xl">
                        Bienvenido, <span className="text-orange-500 font-semibold">{auth?.nombre || auth?.email?.split("@")[0]}</span>! Aquí tienes el historial de tus experiencias.
                    </p>
                </header>

                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-orange-500 flex items-center gap-3">
                            <Compass className="text-orange-600 h-8 w-8" /> 
                            Mis Reservas
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {reservas.map((res) => {
                            const fechaFormateada = new Date(res.fecha).toLocaleDateString('es-AR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });

                            const nombreActividad = res.items && res.items.length > 0
                                ? res.items.map(item => item.nombre).join(' + ')
                                : 'Actividad Especial Xperience';

                            const isCancelada = res.estado?.toLowerCase() === 'cancelada';

                            return (
                                <article
                                    key={res._id}
                                    className={`group relative bg-[#111111] p-6 md:p-8 rounded-2xl border border-neutral-800 transition-all duration-300 flex flex-col xl:flex-row xl:items-center gap-6 justify-between overflow-hidden ${!isCancelada && 'hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(234,88,12,0.05)]'}`}
                                >
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCancelada ? 'bg-red-600' : 'bg-orange-600/0 group-hover:bg-orange-600'} transition-colors duration-300`}></div>

                                    {/* INFO PRINCIPAL */}
                                    <div className="flex-1 pl-2">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getEstadoStyles(res.estado)}`}>
                                                {res.estado}
                                            </span>
                                            <span className="flex items-center gap-1 text-neutral-500 text-xs font-mono bg-neutral-900 px-2 py-1 rounded-md">
                                                <Ticket className="h-3 w-3" /> ID: {res._id}
                                            </span>
                                        </div>

                                        <h3 className={`text-2xl md:text-3xl font-bold mb-4 tracking-tight ${isCancelada ? 'text-neutral-500 line-through' : 'text-white'}`}>
                                            {nombreActividad}
                                        </h3>

                                        <div className="flex flex-col sm:flex-row gap-y-3 gap-x-8 text-sm text-neutral-400">
                                            <div className="flex items-center gap-2">
                                                <MapPin className={`h-5 w-5 ${isCancelada ? 'text-neutral-600' : 'text-orange-500'}`} />
                                                <span className="font-medium">Mendoza, Argentina</span>
                                            </div>
                                            <div className="flex items-center gap-2 capitalize">
                                                <CalendarDays className={`h-5 w-5 ${isCancelada ? 'text-neutral-600' : 'text-orange-500'}`} />
                                                <span className="font-medium">{fechaFormateada}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PRECIO Y BOTONES DE ACCIÓN */}
                                    <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between xl:justify-center gap-6 pt-6 xl:pt-0 border-t xl:border-t-0 border-neutral-800 xl:pl-8 w-full xl:w-auto">
                                        
                                        <div className="text-left sm:text-right xl:text-right">
                                            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Total Abonado</p>
                                            <p className={`text-3xl md:text-4xl font-black tracking-tight ${isCancelada ? 'text-neutral-600' : 'text-white'}`}>
                                                {formatearDinero(res.total)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                            {/* Botón Descargar Ticket */}
                                            <button 
                                                onClick={() => handleDescargarTicket(res)}
                                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm transition-colors w-full sm:w-auto border border-neutral-700 hover:border-neutral-500"
                                            >
                                                <Download className="h-4 w-4" />
                                                Descargar Ticket
                                            </button>

                                            {/* Botón Cancelar (Solo si no está cancelada ya) */}
                                            {!isCancelada && (
                                                <button 
                                                    onClick={() => handleCancelarReserva(res._id)}
                                                    disabled={cancelingId === res._id}
                                                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 font-medium text-sm transition-all w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {cancelingId === res._id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4" />
                                                    )}
                                                    {cancelingId === res._id ? "Cancelando..." : "Cancelar Reserva"}
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {reservas.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 bg-[#111111] rounded-3xl border border-dashed border-neutral-800">
                            <div className="bg-neutral-900 p-6 rounded-full mb-6">
                                <Compass className="h-12 w-12 text-neutral-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Sin aventuras a la vista</h3>
                            <p className="text-neutral-400 text-lg max-w-md text-center">
                                Aún no tienes reservas registradas. ¡Es el momento perfecto para planear tu próxima experiencia!
                            </p>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}