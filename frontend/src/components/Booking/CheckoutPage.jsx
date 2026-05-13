import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Wallet,
  CheckCircle,
  Lock,
  Loader2,
  Minus,
  Plus,
  DollarSign,
  Trash2
} from 'lucide-react';
import Nav from '../Navbar/Nav';
import clienteAxios from '../../config/axios';
import paymentsAxios from '../../config/paymentsAxios';

export default function CheckoutPage({ onBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleBack = onBack || (() => navigate(-1));

  const initialItems = location.state?.selectedItems || [];
  const [selectedItems, setSelectedItems] = useState(initialItems);

  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [errorCoupon, setErrorCoupon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '', fecha: '', notas: '',
  });

  const emailConfig = { emailAgencia: 'contacto@xperience.com' };

  const coupons = [
    { code: 'XP10', type: 'percent', value: 10 },
    { code: 'EXPLORA10', type: 'percent', value: 10 },
    { code: 'BIENVENIDO500', type: 'fixed', value: 500 },
  ];

  const precioBase = selectedItems.reduce((acc, item) => {
    const precioUnitario = parseFloat(
      String(item.precio || item.price || 0)
        .replace(/[^\d,.-]/g, '')
        .replace(',', '.')
    );
    return acc + (isNaN(precioUnitario) ? 0 : precioUnitario);
  }, 0);

  const capacidadMinimaEntreItems = selectedItems.reduce((min, item) => {
    const cap = item.capacidad || item.capacity || 10;
    return cap < min ? cap : min;
  }, 999);

  const capacidadMaxima = selectedItems.length > 0 ? capacidadMinimaEntreItems : 10;

  const subtotal = precioBase * cantidadPersonas;
  const discount = appliedCoupon ? appliedCoupon.type === 'percent' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value : 0;
  const totalPrice = Math.max(subtotal - discount, 0);

  const formatCurrency = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(value || 0));

  const handleCantidadChange = (delta) => {
    const nextValue = cantidadPersonas + delta;
    if (nextValue >= 1 && nextValue <= capacidadMaxima) { setCantidadPersonas(nextValue); }
  };

  const handleRemoveItem = (idToRemove) => {
    const newItems = selectedItems.filter(item => item.id !== idToRemove);
    setSelectedItems(newItems);
    if(newItems.length === 0) navigate(-1);
  };

  const handleApplyCoupon = () => {
    setErrorCoupon('');
    const found = coupons.find((coupon) => coupon.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!found) { setErrorCoupon('Cupón inválido o expirado.'); setAppliedCoupon(null); return; }
    setAppliedCoupon(found);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildReservaPayload = () => ({
    nombre: formData.nombre,
    apellido: formData.apellido,
    email: formData.email,
    telefono: formData.telefono,
    fecha: formData.fecha || new Date().toISOString().split('T')[0],
    notas: formData.notas,
    items: selectedItems.map(item => ({
       id: item.id || '',
       nombre: item.nombre || item.name || 'Aventura',
       precio: typeof item.precio === 'string' ? item.precio : formatCurrency(item.precio || item.price || 0),
       capacidad: cantidadPersonas,
       image: item.image || ''
    })),
    total: totalPrice,
    paymentMethod,
    cantidadPersonas,
    tourId: selectedItems.map(i => i.id).join(','),
    capacidadUtilizada: cantidadPersonas,
    descuentoAplicado: discount,
    metodoPago: paymentMethod,
    emailAgencia: paymentMethod === 'Pago en destino' ? emailConfig.emailAgencia : null,
    fechaReserva: new Date().toISOString(),
  });

  const handleCreateMpPreference = async () => {
    setIsSubmitting(true);
    setApiError('');
    try {
      const itemsPayload = selectedItems.map((item) => ({
        id: item.id || '0',
        title: item.nombre || item.name || 'Reserva',
        quantity: cantidadPersonas,
        unit_price: parseFloat(String(item.precio || item.price || 0).replace(/[^\d,.-]/g, '').replace(',', '.')),
        currency_id: 'ARS',
      }));

      const payer = { name: formData.nombre || 'Cliente', surname: formData.apellido || '', email: formData.email };
      const response = await paymentsAxios.post('/payments/create-preference', { items: itemsPayload, payer });
      const initPoint = response?.data?.init_point;
      if (!initPoint) throw new Error('No se pudo iniciar el checkout de Mercado Pago.');
      window.location.href = initPoint;
    } catch (error) {
      setApiError(error.response?.data?.message || error.message || 'Error con Mercado Pago.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.email || !formData.telefono) {
      setApiError('Por favor, completa los campos obligatorios: nombre, email y teléfono.');
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const reservaPayload = buildReservaPayload();
      let response;
      if (paymentMethod === 'Pago en destino') {
        response = await clienteAxios.post('/api/reserva/public/efectivo', reservaPayload);
      } else if (paymentMethod === 'mercadopago') {
        await handleCreateMpPreference();
        return;
      }

      const reserva = response?.data?.reserva || response?.data || null;

      navigate('/exito', {
        state: {
          title: selectedItems.length > 1 ? "Itinerario Múltiple" : selectedItems[0]?.nombre,
          date: formData.fecha,
          travelers: `${cantidadPersonas} Persona(s)`,
          code: reserva?._id || reserva?.id || `XP-${Math.floor(Math.random() * 100000)}`,
          image: selectedItems[0]?.image,
          total: totalPrice,
          email: formData.email,
          reserva,
        },
      });
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Error procesando reserva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F1F5F9] text-slate-900 font-sans overflow-hidden">
      
      <div className="flex-shrink-0 z-50">
        <Nav />
      </div>
      
      {/* Redujimos el padding general de py-6 a py-4 para ganar espacio vertical */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-6 py-4 flex flex-col min-h-0">
        
        {/* Redujimos margen mb-6 a mb-4 */}
        <div className="flex-shrink-0 relative mb-4 flex justify-center items-center w-full">
          <button
            onClick={handleBack}
            className="absolute left-0 z-10 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-[#d86015] px-4 py-2 rounded-full text-xs font-semibold text-white shadow-md hover:scale-105 transition-all"
          >
            Volver
          </button>
          <h1 className="text-2xl lg:text-3xl font-black text-center m-0 text-slate-900">
            Confirmar Reserva
          </h1>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          <div className="lg:col-span-7 flex flex-col gap-4 h-full overflow-y-auto no-scrollbar pb-6 pr-2">
            
            {/* Formulario Titular - Paddings reducidos p-5 en vez de p-6 */}
            <section className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-200 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="text-orange-600 w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Información del titular</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm" placeholder="Nombre" />
                <input name="apellido" value={formData.apellido} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm" placeholder="Apellido" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm" placeholder="Correo electrónico" />
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm" placeholder="Teléfono" />
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm" />
                <div />
                <textarea name="notas" value={formData.notas} onChange={handleChange} className="md:col-span-2 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none min-h-[60px] resize-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm" placeholder="Notas adicionales (opcional)" />
              </div>
            </section>

            {/* Formulario Método de Pago */}
            <section className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-200 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <Wallet className="text-teal-600 w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Método de Pago</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'Pago en destino', label: 'En destino', icon: DollarSign },
                  { id: 'mercadopago', label: 'Mercado Pago', icon: Wallet },
                ].map((method) => {
                  const Icon = method.icon;
                  const selected = paymentMethod === method.id;
                  return (
                    <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id)} className={`cursor-pointer flex items-center justify-start gap-3 py-3 px-4 rounded-xl border-2 transition-all ${selected ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                      <Icon className={`w-5 h-5 ${selected ? 'text-orange-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold uppercase tracking-widest">{method.label}</span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'mercadopago' && (
                <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs">
                  <span className="font-bold">Importante: </span> Serás redirigido a Mercado Pago de forma segura.
                </div>
              )}
              {paymentMethod === 'Pago en destino' && (
                <div className="mt-3 p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-xs">
                  <span className="font-bold">Pago Presencial: </span> Abonarás el total directamente con el guía.
                </div>
              )}
              {apiError && <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs text-center font-medium">{apiError}</div>}
            </section>
          </div>

          {/* COLUMNA DERECHA: Resumen de Orden Ultra Compacto */}
          <aside className="lg:col-span-5 h-full flex flex-col pb-4 pr-1">
            <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
              <h2 className="text-lg font-bold mb-3 text-slate-900 flex-shrink-0">Resumen de Orden</h2>

              {/* 🔥 ITINERARIO MÚLTIPLE COMPACTO (MAX 160px para 2 items exactos) 🔥 */}
              <div className="overflow-y-auto no-scrollbar space-y-2 pr-1 max-h-[160px]">
                {selectedItems.map((item, index) => {
                  const isInfluencer = !!item.influencer; 
                  return (
                    <div key={`${item.id}-${index}`} className="flex gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100 relative group transition-colors hover:border-slate-200">
                      <button onClick={() => handleRemoveItem(item.id)} className="absolute top-1 right-1 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-all shadow-sm opacity-0 group-hover:opacity-100 z-10">
                         <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Imagen compacta */}
                      <div className="w-14 h-14 bg-slate-200 rounded-lg overflow-hidden shrink-0 shadow-inner">
                        {item.image ? (
                          <img src={item.image} alt={item.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center flex-1 pr-5">
                        {isInfluencer ? (
                          <span className="text-[7px] font-black uppercase text-pink-600 tracking-wider mb-0.5">Recomendación Influencer</span>
                        ) : (
                          <span className="text-[7px] font-black uppercase text-slate-500 tracking-wider mb-0.5">Guía Oficial Local</span>
                        )}
                        <h3 className="font-bold text-xs leading-tight mb-0.5 text-slate-900 line-clamp-1">
                          {item.nombre || item.name}
                        </h3>
                        <p className="text-orange-600 font-black text-xs">
                          {typeof item.precio === 'string' ? item.precio : formatCurrency(item.precio || item.price)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CONTROLES INFERIORES: Márgenes y espaciados reducidos para entrar en pantalla */}
              <div className="flex-shrink-0 pt-3 mt-3 border-t border-slate-100 flex flex-col gap-3">
                
                {/* Control de Personas Compacto */}
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Pasajeros (aplica a todos)</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleCantidadChange(-1)} disabled={cantidadPersonas <= 1} className="w-6 h-6 bg-white shadow-sm border border-slate-200 hover:bg-slate-100 disabled:opacity-50 rounded-full flex items-center justify-center text-slate-600 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center text-slate-800">{cantidadPersonas}</span>
                    <button type="button" onClick={() => handleCantidadChange(1)} disabled={cantidadPersonas >= capacidadMaxima} className="w-6 h-6 bg-white shadow-sm border border-slate-200 hover:bg-slate-100 disabled:opacity-50 rounded-full flex items-center justify-center text-slate-600 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Cupones Compacto */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Código promocional" className="w-full bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs outline-none focus:border-slate-400 transition-colors" />
                    {errorCoupon && <span className="absolute -bottom-4 left-3 text-[8px] uppercase tracking-wider text-red-500 font-bold">{errorCoupon}</span>}
                  </div>
                  <button type="button" onClick={handleApplyCoupon} className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-4 rounded-full transition-colors text-[9px] tracking-wider uppercase shrink-0 shadow-sm">Aplicar</button>
                </div>

                {/* Subtotales y Descuentos Compacto */}
                <div className="space-y-1.5 text-xs font-medium mt-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal itinerario ({selectedItems.length})</span>
                    <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-teal-600 bg-teal-50 px-2 py-1 rounded-md border border-teal-100">
                      <span className="font-bold text-[9px] uppercase mt-0.5">Desc. ({appliedCoupon.code})</span>
                      <span className="font-bold text-xs">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 mt-1"></div>

                {/* Total Final y Botón */}
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-900">Total Final</span>
                  <span className="text-2xl font-black text-orange-500 tracking-tight leading-none">{formatCurrency(totalPrice)}</span>
                </div>

                <button type="button" onClick={handleSubmit} disabled={isSubmitting || selectedItems.length === 0} className="w-full bg-gradient-to-r from-orange-500 to-[#d86015] hover:scale-[1.02] text-white py-2.5 rounded-full font-bold flex items-center justify-center gap-2 transition-transform disabled:opacity-70 disabled:hover:scale-100 shadow-lg shadow-orange-500/20 text-sm">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> PROCESANDO...</> : <><CheckCircle className="w-4 h-4" /> CONFIRMAR</>}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[8px] tracking-widest uppercase font-bold mt-0.5">
                  <Lock className="w-2.5 h-2.5" /><span>Transacción segura</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}