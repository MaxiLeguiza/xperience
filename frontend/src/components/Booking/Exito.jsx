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
    navigate('/carrito', { state: { selectedItems: reserva?.items || [] } });
  };

  if (!state) return null;

  return (
    <div className="min-h-screen bg-[#090e15] text-white">
      {/*<header className="bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-6 py-4 fixed top-0 w-full z-50 border-b border-white/5">
        <div className="text-2xl font-black text-orange-500">Xperience</div>
        <div className="flex gap-4 text-gray-400">
          <Icon name="share" />
          <Icon name="print" />
        </div>
      </header>*/}
      <Nav />

      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <section className="text-center mb-12">
          <div className="relative mb-6 flex justify-center">
            <div
              className={`absolute w-24 h-24 blur-2xl rounded-full ${
                summary.status === 'cancelada'
                  ? 'bg-red-500/30'
                  : 'bg-orange-500/30'
              }`}
            />
            <div
              className={`relative w-20 h-20 rounded-full flex items-center justify-center ${
                summary.status === 'cancelada'
                  ? 'bg-red-500'
                  : 'bg-orange-500'
              }`}
            >
              <Icon
                name={
                  summary.status === 'cancelada' ? 'cancel' : 'check_circle'
                }
                className="text-black text-4xl"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-3">
            {summary.status === 'cancelada'
              ? 'Reserva Cancelada'
              : 'Reserva Confirmada'}
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {summary.status === 'cancelada'
              ? `La reserva fue cancelada correctamente. Se envio un correo a ${summary.email} con la confirmacion de la cancelacion.`
              : `Tu expedicion fue procesada con exito. Se envio un correo a ${summary.email} con todos los detalles de la reserva.`}
          </p>
        </section>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#141a22] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              <div className="relative h-64">
                <img
                  src={summary.image}
                  alt={summary.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />

                <div className="absolute bottom-5 left-5">
                  <span
                    className={`text-black text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                      summary.status === 'cancelada'
                        ? 'bg-red-400'
                        : 'bg-cyan-400'
                    }`}
                  >
                    {summary.status === 'cancelada'
                      ? 'Cancelada'
                      : 'Confirmada'}
                  </span>
                  <h2 className="text-2xl font-bold mt-3">{summary.title}</h2>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-5 text-sm">
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

            <div className="bg-[#1f2630] p-5 rounded-2xl border border-cyan-400/30 flex gap-3">
              <Icon
                name={summary.status === 'cancelada' ? 'mail' : 'info'}
                className="text-cyan-400"
              />
              <div>
                <h3 className="font-bold">
                  {summary.status === 'cancelada'
                    ? 'Cancelacion confirmada'
                    : 'Informacion de Preparacion'}
                </h3>
                <p className="text-sm text-gray-400">
                  {summary.status === 'cancelada'
                    ? 'El cliente recibira el correo de cancelacion y ya no deberia presentarse al recorrido.'
                    : 'El cliente recibio un correo con los datos de la reserva y el codigo generado.'}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1f2630] p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold mb-4 text-lg">Gestionar mi Reserva</h3>

              <div className="space-y-4">
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
                      ? 'El correo de cancelacion ya fue enviado'
                      : 'Cancelar y enviar correo'
                  }
                  onClick={handleCancel}
                  disabled={summary.status === 'cancelada' || isCancelling}
                  danger={summary.status !== 'cancelada'}
                />
              </div>

              {cancelError && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {cancelError}
                </div>
              )}
            </div>

            <div className="bg-[#141a22] p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold mb-3">Siguiente paso</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {summary.status === 'cancelada'
                  ? 'Si queres volver a vender este cupo, ya podes ofrecerlo de nuevo porque la reserva quedo liberada.'
                  : 'Si el cliente pide cambios, podes volver al checkout desde modificar o cancelar la reserva desde este panel.'}
              </p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-10 right-10 hidden md:block">
          <button
            onClick={() => navigate('/home')}
            className="bg-orange-500 px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
          >
            Explorar mas aventuras
          </button>
        </div>
      </main>
    </div>
  );
}

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-black/15 px-4 py-3">
      <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-2 mt-2 break-all">
        <Icon name={icon} className="text-orange-500" />
        <span>{value}</span>
      </div>
    </div>
  );
}

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
      className={`w-full flex justify-between items-center p-4 rounded-xl transition text-left ${
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
          className={danger && !disabled ? 'text-red-300' : 'text-white'}
        />
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      <Icon name="chevron_right" />
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
