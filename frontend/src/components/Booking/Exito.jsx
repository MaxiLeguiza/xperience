import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import Nav from '../Navbar/Nav';

export default function Exito() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelled, setCancelled] = useState(
    state?.reserva?.estado === 'cancelada',
  );

  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (!state) {
      navigate('/home');
    }
  }, [state, navigate]);

  const reserva = state?.reserva || null;

  const summary = useMemo(
    () => ({
      title: state?.title || 'Expedicion',
      date: state?.date || 'Sin fecha',
      travelers: state?.travelers || '1 Persona',
      code: state?.code || '#XP-00000',
      image:
        state?.image ||
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
      total: state?.total || 0,
      email: state?.email || reserva?.email || '',
      status:
        reserva?.estado === 'cancelada' || cancelled
          ? 'cancelada'
          : 'confirmada',
    }),
    [state, reserva, cancelled],
  );

  const handleCancel = async () => {
    if (!reserva?._id && !reserva?.id) {
      setCancelError(
        'No se encontro el identificador de la reserva para cancelarla.',
      );
      return;
    }

    const confirmed = window.confirm(
      'Vas a cancelar la reserva. Se enviara un correo de cancelacion al cliente. Queres continuar?',
    );

    if (!confirmed) return;

    try {
      setIsCancelling(true);
      setCancelError('');

      const reservaId = reserva._id || reserva.id;
      await clienteAxios.patch(`/api/reserva/${reservaId}/cancel`);
      setCancelled(true);
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      setCancelError(
        error.response?.data?.message ||
          'No se pudo cancelar la reserva. Intenta nuevamente.',
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const handleModify = () => {
    navigate('/carrito', {
      state: {
        selectedItems: reserva?.items || [],
        reserva,
        fromExito: true,
      },
    });
  };

  if (!state) return null;

  return (
    /* Reducción de min-h-screen a h-screen y overflow-hidden para forzar 1 pantalla */
    <div className="relative h-screen overflow-hidden bg-[#e4e4eb] text-white flex flex-col">
      {/* Degradé de verde a blanco debajo del nav hasta la reserva */}
      <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-b from-green-500 via-white to-[#e4e4eb] pointer-events-none z-0" />

      <div className="relative z-10"><Nav /></div>

      {/* Ajuste de pt-24 a pt-20, reducción general de paddings y altura dinámica */}
      <main className="relative z-10 pt-20 pb-4 px-4 max-w-6xl mx-auto flex-1 flex flex-col justify-center w-full">
        {/* Reducción de mb-12 a mb-6 */}
        <section className="text-center mb-6">
          <div className="relative mb-3 flex justify-center">
            {/* Reducción de tamaños del círculo del ícono: w-24->w-16, w-20->w-12 */}
            <div
              className={`absolute w-16 h-16 blur-xl rounded-full ${
                summary.status === 'cancelada'
                  ? 'bg-red-500/30'
                  : 'bg-green-500/40'
              }`}
            />
            <div
              className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-white/20 ${
                summary.status === 'cancelada'
                  ? 'bg-red-500'
                  : 'bg-gradient-to-br from-green-400 to-green-600'
              }`}
            >
              <Icon
                name={
                  summary.status === 'cancelada' ? 'cancel' : 'check_circle'
                }
                className="text-white text-2xl"
              />
            </div>
          </div>

          {/* Reducción de fuente del título: text-4xl->text-2xl */}
          <h1 className="text-2xl md:text-3xl font-black text-black mb-2">
            {summary.status === 'cancelada'
              ? 'Reserva Cancelada'
              : 'Reserva Confirmada'}
          </h1>

          {/* Reducción de fuente de la descripción y márgenes */}
          <p className="text-black text-sm max-w-2xl mx-auto leading-tight">
            {summary.status === 'cancelada'
              ? `La reserva fue cancelada correctamente. Se envio un correo a ${summary.email} con la confirmacion.`
              : `Tu expedicion fue procesada con exito. Se envio un correo a ${summary.email} con los detalles.`}
          </p>
        </section>

        {/* Reducción de gap-8 a gap-4 */}
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Reducción de space-y-6 a space-y-4 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#141a22] rounded-xl overflow-hidden border border-white/5 shadow-xl">
              {/* Reducción de altura de la imagen: h-64 -> h-36 */}
              <div className="relative h-36">
                <img
                  src={summary.image}
                  alt={summary.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />

                <div className="absolute bottom-3 left-4">
                  <span
                    className={`text-black text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider ${
                      summary.status === 'cancelada'
                        ? 'bg-red-400'
                        : 'bg-cyan-400'
                    }`}
                  >
                    {summary.status === 'cancelada'
                      ? 'Cancelada'
                      : 'Confirmada'}
                  </span>
                  <h2 className="text-lg font-bold mt-1">{summary.title}</h2>
                </div>
              </div>

              {/* Reducción de padding p-6 -> p-4 y gap-5 -> gap-3 */}
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <Info icon="calendar_today" label="Fecha" value={summary.date} />
                <Info
                  icon="group"
                  label="Viajeros"
                  value={summary.travelers}
                />
                <Info icon="qr_code" label="Codigo" value={summary.code} />
                <Info
                  icon="payments"
                  label="Total"
                  value={formatCurrency(summary.total)}
                />
              </div>
            </div>

            {/* Reducción de padding p-5 -> p-4 */}
            <div className="bg-[#1f2630] p-4 rounded-xl border border-cyan-400/30 flex gap-3 items-center">
              <Icon
                name={summary.status === 'cancelada' ? 'mail' : 'info'}
                className="text-cyan-400"
              />
              <div>
                <h3 className="font-bold text-sm">
                  {summary.status === 'cancelada'
                    ? 'Cancelacion confirmada'
                    : 'Informacion de Preparacion'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {summary.status === 'cancelada'
                    ? 'El cliente recibira el correo y ya no deberia presentarse al recorrido.'
                    : 'El cliente recibio un correo con los datos de la reserva y el codigo.'}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {/* Reducción de padding p-6 -> p-4 */}
            <div className="bg-[#1f2630] p-4 rounded-xl border border-white/5">
              <h3 className="font-bold mb-3 text-base">Gestionar mi Reserva</h3>

              {/* Reducción de espacio entre botones */}
              <div className="space-y-2">
                <Action
                  icon="edit_calendar"
                  title="Modificar"
                  subtitle="Volver al checkout"
                  onClick={handleModify}
                  disabled={summary.status === 'cancelada'}
                />

                <Action
                  icon={isCancelling ? 'hourglass_top' : 'cancel'}
                  title={
                    summary.status === 'cancelada'
                      ? 'Reserva cancelada'
                      : isCancelling
                        ? 'Cancelando...'
                        : 'Cancelar'
                  }
                  subtitle={
                    summary.status === 'cancelada'
                      ? 'El correo ya fue enviado'
                      : 'Cancelar y notificar'
                  }
                  onClick={handleCancel}
                  disabled={summary.status === 'cancelada' || isCancelling}
                  danger={summary.status !== 'cancelada'}
                />
              </div>

              {cancelError && (
                <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {cancelError}
                </div>
              )}
            </div>

            {/* Reducción de padding p-6 -> p-4 */}
            <div className="bg-[#141a22] p-4 rounded-xl border border-white/5">
              <h3 className="font-bold mb-1 text-sm">Siguiente paso</h3>
              <p className="text-xs text-gray-400 leading-tight">
                {summary.status === 'cancelada'
                  ? 'Si queres volver a vender este cupo, ya podes ofrecerlo de nuevo porque la reserva quedo liberada.'
                  : 'Si el cliente pide cambios, podes volver al checkout o cancelar la reserva desde aca.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Botón flotante ajustado en tamaño y posición para no tapar contenido crítico */}
      <div className="absolute bottom-4 right-4 hidden md:block">
        <button
          onClick={() => navigate('/home')}
          className="bg-orange-500 px-4 py-2 text-sm rounded-lg font-bold hover:scale-105 transition shadow-lg"
        >
          Explorar mas aventuras
        </button>
      </div>
    </div>
  );
}

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

/* Reducción de paddings p-3 -> p-2 */
function Info({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-black/20 px-3 py-2">
      <p className="text-gray-400 text-[10px] uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-1 mt-1 break-all text-sm font-medium">
        <Icon name={icon} className="text-orange-500 text-base" />
        <span>{value}</span>
      </div>
    </div>
  );
}

/* Reducción de paddings p-4 -> p-3 */
function Action({
  icon,
  title,
  subtitle,
  onClick,
  disabled = false,
  danger = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex justify-between items-center p-3 rounded-lg transition text-left ${
        disabled
          ? 'bg-[#111822] opacity-60 cursor-not-allowed'
          : danger
            ? 'bg-[#141a22] hover:bg-[#26151a] border border-red-500/20'
            : 'bg-[#141a22] hover:bg-[#1a222c]'
      }`}
    >
      <div className="flex gap-3 items-center">
        <Icon
          name={icon}
          className={danger && !disabled ? 'text-red-400 text-xl' : 'text-white text-xl'}
        />
        <div>
          <p className="font-bold text-sm">{title}</p>
          <p className="text-[11px] text-gray-400">{subtitle}</p>
        </div>
      </div>
      <Icon name="chevron_right" className="text-xl text-gray-500" />
    </button>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}