import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Wallet,
  CreditCard,
  CheckCircle,
  Lock,
  Loader2,
  Minus,
  Plus,
  DollarSign,
} from 'lucide-react';
import Nav from '../Navbar/Nav';
import clienteAxios from '../../config/axios';
import paymentsAxios from '../../config/paymentsAxios';

export default function CheckoutPage({ onBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleBack = onBack || (() => navigate(-1));

  const selectedItems = location.state?.selectedItems || [];
  const tour = selectedItems[0] || {};

  const [step, setStep] = useState('form');
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [errorCoupon, setErrorCoupon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [confirmationData, setConfirmationData] = useState(null);
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [cardError, setCardError] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: '',
    type: '',
    category: '',
  });
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha: '',
    notas: '',
  });


  const emailConfig = {
    emailAgencia: 'contacto@xperience.com',
  };

  const coupons = [
    { code: 'XP10', type: 'percent', value: 10 },
    { code: 'EXPLORA10', type: 'percent', value: 10 },
    { code: 'BIENVENIDO500', type: 'fixed', value: 500 },
  ];

  const precioBase = parseFloat(
    String(tour.precio || tour.price || 0).replace(/[^\d,.-]/g, '').replace(',', '.'),
  );
  const capacidadMaxima = tour.capacidad || tour.capacity || 10;
  const subtotal = precioBase * cantidadPersonas;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;
  const totalPrice = Math.max(subtotal - discount, 0);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const formatDisplayDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('es-AR');
  };

  const detectCardType = (number) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return 'Visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'MasterCard';
    if (/^3[47]/.test(num)) return 'American Express';
    return '';
  };

  const detectCardCategory = (number) => {
    const num = number.replace(/\s/g, '');
    if (/^4[0-4]/.test(num)) return 'Debito';
    if (/^4[5-9]/.test(num) || /^5/.test(num)) return 'Credito';
    return 'Credito';
  };

  const validateCard = (number) => {
    const num = number.replace(/\s/g, '');
    if (num.length < 13 || num.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;

    for (let i = num.length - 1; i >= 0; i -= 1) {
      let digit = parseInt(num.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const handleCantidadChange = (delta) => {
    const nextValue = cantidadPersonas + delta;
    if (nextValue >= 1 && nextValue <= capacidadMaxima) {
      setCantidadPersonas(nextValue);
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === 'number') {
      nextValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardData((prev) => ({
        ...prev,
        [name]: nextValue,
        type: detectCardType(nextValue),
        category: detectCardCategory(nextValue),
      }));
    } else {
      setCardData((prev) => ({ ...prev, [name]: nextValue }));
    }

    setCardError('');
  };

  const handleApplyCoupon = () => {
    setErrorCoupon('');
    const found = coupons.find(
      (coupon) => coupon.code.toUpperCase() === couponCode.trim().toUpperCase(),
    );

    if (!found) {
      setErrorCoupon('Cupon invalido o expirado.');
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(found);
  };






  const handleCreateMpPreference = async () => {
    setIsSubmitting(true);
    setApiError('');

    try {
      const items = (selectedItems.length > 0 ? selectedItems : [tour]).map((item) => ({
        id: item.id || item._id || tour.id || tour._id || '0',
        title: item.nombre || item.name || tour.nombre || tour.name || 'Reserva',
        quantity: cantidadPersonas,
        unit_price: precioBase,
        currency_id: 'ARS',
      }));

      const payer = {
        name: formData.nombre || 'Cliente',
        surname: formData.apellido || '',
        email: formData.email,
      };

      const response = await paymentsAxios.post('/payments/create-preference', {
        items,
        payer,
      });

      const initPoint = response?.data?.init_point;
      if (!initPoint) {
        throw new Error('No se pudo iniciar el checkout de Mercado Pago.');
      }

      window.location.href = initPoint;
    } catch (error) {
      console.error('Error creando preferencia MP:', error);
      setApiError(
        error.response?.data?.message ||
        error.message ||
        'No se pudo generar el pago de Mercado Pago. Intenta nuevamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeReservaItem = (item) => ({
    id: item.id || item._id || tour.id || tour._id || '',
    nombre: item.nombre || item.name || tour.nombre || tour.name || 'Aventura',
    precio:
      typeof item.precio === 'string'
        ? item.precio
        : formatCurrency(item.price || precioBase),
    capacidad: cantidadPersonas,
    image: item.image || tour.image || '',
  });

  const buildReservaPayload = () => {
    // INFORMACIÓN PARA GUARDAR EN BASE DE DATOS
    // Esta estructura debe ser guardada cuando se integre con BD
    return {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      fecha: formData.fecha || new Date().toISOString().split('T')[0],
      notas: formData.notas,
      items: (selectedItems.length > 0 ? selectedItems : [tour]).map(normalizeReservaItem),
      total: totalPrice,
      paymentMethod,
      cantidadPersonas,
      tourId: tour.id || tour._id || '',
      capacidadUtilizada: cantidadPersonas,
      descuentoAplicado: discount,
      metodoPago: paymentMethod,
      emailAgencia: paymentMethod === 'Pago en destino' ? emailConfig.emailAgencia : null,
      fechaReserva: new Date().toISOString(),
      // CAMPOS ADICIONALES PARA BD (pueden agregarse según necesidad):
      // - usuarioId: id del usuario autenticado
      // - estado: 'pendiente' | 'confirmada' | 'cancelada'
      // - historialPagos: array de transacciones
      // - datosTarjeta: solo cuando paymentMethod === 'tarjeta'
    };
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.email || !formData.telefono) {
      setApiError(
        'Por favor, completa los campos obligatorios: nombre, email y telefono.',
      );
      return;
    }

    if (paymentMethod === 'tarjeta' && !validateCard(cardData.number)) {
      setCardError('Numero de tarjeta invalido.');
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const reservaPayload = buildReservaPayload();
      let response;

      if (paymentMethod === 'Pago en destino') {
        // COMENTADO - DESTINADO PARA INTEGRACIÓN CON BASE DE DATOS:
        // response = await clienteAxios.post(
        //   '/api/reserva/public/Pago en destino',
        //   reservaPayload,
        // );
        // INSTRUCCIONES PARA DESCOMENTAR:
        // 1. Asegurate de que el endpoint '/api/reserva/public/Pago en destino' existe
        // 2. Valida que la respuesta contenga { reserva: {...} }
        // 3. Descomenta las líneas de arriba y comenta la línea de setConfirmationData
        // Por ahora, mostramos confirmación sin guardar en BD:
        navigate('/exito', {
          state: {
            title: tour.nombre || tour.name,
            date: formData.fecha,
            travelers: `${cantidadPersonas} Persona(s)`,
            code: 'XP-' + Math.floor(Math.random() * 100000),
            image: tour.image,
            total: totalPrice,
            email: formData.email,
          }
        });
        return;
      } else if (paymentMethod === 'tarjeta') {
        // COMENTADO - DESTINADO PARA INTEGRACIÓN CON BASE DE DATOS:
        // response = await clienteAxios.post('/api/reserva', {
        //   ...reservaPayload,
        //   datosTarjeta: {
        //     tipo: cardData.type,
        //     categoria: cardData.category,
        //     ultimosDigitos: cardData.number.slice(-4),
        //     vencimiento: cardData.expiry,
        //   },
        // });
        // INSTRUCCIONES PARA DESCOMENTAR:
        // 1. Asegurate de que el endpoint '/api/reserva' existe
        // 2. Valida que la respuesta contenga { reserva: {...} }
        // 3. Descomenta las líneas de arriba y comenta la línea de setConfirmationData
        // Por ahora, mostramos confirmación sin guardar en BD:
        navigate('/exito', {
          state: {
            title: tour.nombre || tour.name,
            date: formData.fecha,
            travelers: `${cantidadPersonas} Persona(s)`,
            code: 'XP-' + Math.floor(Math.random() * 100000),
            image: tour.image,
            total: totalPrice,
            email: formData.email,
          }
        });
        return;
      } else if (paymentMethod === 'mercadopago') {
        await handleCreateMpPreference();
        return;
      } else {
        throw new Error('Método de pago desconocido.');
      }

      // COMENTADO - DESTINADO PARA INTEGRACIÓN CON BASE DE DATOS:
      // const reserva = response?.data?.reserva || response?.data || null;
      // setConfirmationData(reserva);
      // setStep('confirmation');
      // INSTRUCCIONES: Cuando se integren los endpoints de arriba, descomenta estas líneas
    } catch (err) {
      console.error('Error procesando reserva:', err);
      setApiError(
        err.response?.data?.message ||
        err.message ||
        'No se pudo procesar la reserva. Intenta nuevamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans relative pb-20">
      <Nav />
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="relative mb-10 mt-4 flex justify-center items-center w-full">
          <button
            onClick={handleBack}
            className="absolute left-0 z-10 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-[#d86015] px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-xl hover:scale-105 transition-all"
          >
            Volver
          </button>
          <h1 className="text-4xl font-black text-center m-0 text-slate-900">
            Confirmar Reserva
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="text-orange-600 w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Informacion del titular
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-4 outline-none"
                  placeholder="Nombre"
                />
                <input
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-4 outline-none"
                  placeholder="Apellido"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-4 outline-none"
                  placeholder="Correo electronico"
                />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-4 outline-none"
                  placeholder="Telefono"
                />
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-4 outline-none"
                />
                <div />
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  className="md:col-span-2 w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-4 outline-none min-h-[120px] resize-none"
                  placeholder="Notas adicionales"
                />
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <Wallet className="text-teal-600 w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Metodo de Pago
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
                  { id: 'Pago en destino', label: 'Pago en destino', icon: DollarSign },
                  { id: 'mercadopago', label: 'Mercado Pago', icon: Wallet },
                ].map((method) => {
                  const Icon = method.icon;
                  const selected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`cursor-pointer flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 transition-all ${selected
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      <Icon
                        className={`w-8 h-8 mb-3 ${selected ? 'text-orange-600' : 'text-slate-400'
                          }`}
                      />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {method.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'tarjeta' && (
                <div className="mt-8 space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Datos de la Tarjeta
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="number"
                      value={cardData.number}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="md:col-span-2 w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-4 outline-none"
                    />
                    <input
                      type="text"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-4 outline-none"
                    />
                    <input
                      type="text"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-4 outline-none"
                    />
                    <input
                      type="text"
                      name="holder"
                      value={cardData.holder}
                      onChange={handleCardChange}
                      placeholder="Nombre del titular"
                      className="md:col-span-2 w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-4 outline-none"
                    />
                  </div>
                  {cardError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                      {cardError}
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'mercadopago' && (
                <div className="mt-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
                    <span className="font-bold">Importante: </span>  Al confirmar, serás redirigido a Mercado Pago para completar el pago de forma segura.
                  </div>
                </div>
              )}

              {apiError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium">
                  {apiError}
                </div>
              )}
            </section>
          </div>


          <aside className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 sticky top-24">
              <h2 className="text-2xl font-bold mb-8 text-slate-900">
                Resumen de Orden
              </h2>

              <div className="flex gap-4 mb-8">
                <div className="w-24 h-24 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                  {tour.image ? (
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-lg leading-tight mb-1 text-slate-900">
                    {tour.nombre || tour.name || 'Aventura Seleccionada'}
                  </h3>
                  <p className="text-slate-500 text-sm mb-2 font-medium">
                    Capacidad: {cantidadPersonas} Persona(s) / Max {capacidadMaxima}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => handleCantidadChange(-1)}
                      disabled={cantidadPersonas <= 1}
                      className="w-8 h-8 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 rounded-full flex items-center justify-center text-slate-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium">{cantidadPersonas}</span>
                    <button
                      type="button"
                      onClick={() => handleCantidadChange(1)}
                      disabled={cantidadPersonas >= capacidadMaxima}
                      className="w-8 h-8 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 rounded-full flex items-center justify-center text-slate-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-orange-600 font-bold">
                    {formatCurrency(precioBase)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Codigo de cupon"
                    className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm outline-none"
                  />
                  {errorCoupon && (
                    <span className="absolute -bottom-5 left-4 text-xs text-red-500 font-medium">
                      {errorCoupon}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 rounded-full transition-colors text-xs tracking-wider uppercase shrink-0 shadow-sm"
                >
                  Aplicar
                </button>
              </div>

              <hr className="border-slate-200 mb-6" />

              <div className="space-y-4 mb-6 text-sm font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-teal-600">
                    <span>Descuento ({appliedCoupon.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
              </div>

              <hr className="border-slate-200 mb-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg uppercase tracking-wider text-slate-900">
                  Total Final
                </span>
                <span className="text-4xl font-black text-orange-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-[#d86015] hover:scale-[1.02] text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-transform disabled:opacity-70 disabled:hover:scale-100 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> PROCESANDO...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> CONFIRMAR RESERVA
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-slate-500 mt-5 uppercase tracking-widest px-2 leading-relaxed font-semibold">
                Al confirmar, aceptas nuestros protocolos de seguridad y terminos
                de servicio.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8 text-slate-400 text-[10px] tracking-widest uppercase font-bold">
              <Lock className="w-3 h-3" />
              <span>Transaccion encriptada y segura</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
