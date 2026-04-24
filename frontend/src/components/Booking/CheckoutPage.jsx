import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Wallet, CreditCard, Landmark, CheckCircle, Lock, Loader2, Minus, Plus, DollarSign } from 'lucide-react';
import Nav from "../Navbar/Nav"; // Tu Navbar
import clienteAxios from '../../config/axios';

export default function CheckoutPage({ onBack }) {
    const navigate = useNavigate();
    const location = useLocation();
    const handleBack = onBack || (() => navigate(-1));

    // Obtener datos del state de navegación
    const selectedItems = location.state?.selectedItems || [];
    const tour = selectedItems[0] || {}; // Tomar el primer item seleccionado

    const [step, setStep] = useState('form'); // 'form' o 'confirmation'
    const [paymentMethod, setPaymentMethod] = useState('tarjeta');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [errorCoupon, setErrorCoupon] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');

    // Nuevo estado para cantidad de personas
    const [cantidadPersonas, setCantidadPersonas] = useState(1);

    // Nuevo estado para datos de tarjeta
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvv: '',
        holder: '',
        type: '', // Visa, MasterCard, etc.
        category: '', // Débito, Crédito
    });
    const [cardError, setCardError] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fecha: '',
        notas: '',
    });

    // Estado para configuración de correo para Efectivo
    const emailConfig = {
        emailAgencia: 'contacto@xperience.com', // Correo de la agencia (valor por defecto)
    };

    // Catálogo de cupones válidos
    const coupons = [
        { code: "XP10", type: "percent", value: 10, label: "10% de descuento" },
        { code: "EXPLORA10", type: "percent", value: 10, label: "10% de descuento" },
        { code: "BIENVENIDO500", type: "fixed", value: 500, label: "$500 de descuento" },
    ];

    // Cálculos dinámicos
    const precioBase = parseFloat(tour.precio?.replace('$', '') || tour.price || 0);
    const capacidadMaxima = tour.capacidad || tour.capacity || 10; // Asumir capacidad máxima
    const subtotal = precioBase * cantidadPersonas;

    const discount = appliedCoupon
        ? appliedCoupon.type === "percent"
            ? (subtotal * appliedCoupon.value) / 100
            : appliedCoupon.value
        : 0;

    const totalPrice = Math.max(subtotal - discount, 0);

    // Función para manejar cantidad de personas
    const handleCantidadChange = (delta) => {
        const nuevaCantidad = cantidadPersonas + delta;
        if (nuevaCantidad >= 1 && nuevaCantidad <= capacidadMaxima) {
            setCantidadPersonas(nuevaCantidad);
        }
    };

    // Función para detectar tipo de tarjeta
    const detectCardType = (number) => {
        const num = number.replace(/\s/g, '');
        if (/^4/.test(num)) return 'Visa';
        if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'MasterCard';
        if (/^3[47]/.test(num)) return 'American Express';
        return '';
    };

    // Función para detectar si es débito o crédito (aproximación para Argentina)
    const detectCardCategory = (number) => {
        const num = number.replace(/\s/g, '');
        // En Argentina, las tarjetas de débito Visa suelen tener ciertos rangos
        // Esta es una aproximación simplificada - en producción necesitarías una base de datos de BIN
        if (/^4[0-4]/.test(num)) {
            return 'Débito'; // Visa débito común en Argentina
        }
        if (/^4[5-9]/.test(num) || /^5/.test(num)) {
            return 'Crédito'; // Visa crédito y MasterCard
        }
        return 'Crédito'; // Default para otros casos
    };

    // Validación de tarjeta usando algoritmo Luhn
    const validateCard = (number) => {
        const num = number.replace(/\s/g, '');
        if (num.length < 13 || num.length > 19) return false;
        let sum = 0;
        let shouldDouble = false;
        for (let i = num.length - 1; i >= 0; i--) {
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

    // Manejar cambios en datos de tarjeta
    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'number') {
            newValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            const type = detectCardType(newValue);
            const category = detectCardCategory(newValue);
            setCardData(prev => ({ ...prev, [name]: newValue, type, category }));
        } else {
            setCardData(prev => ({ ...prev, [name]: newValue }));
        }
        setCardError('');
    };

    const handleApplyCoupon = () => {
        setErrorCoupon("");
        const found = coupons.find(
            (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
        );

        if (!found) {
            setErrorCoupon("Cupón inválido o expirado.");
            setAppliedCoupon(null);
            return;
        }
        setAppliedCoupon(found);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.nombre || !formData.email || !formData.telefono) {
            setApiError("Por favor, completa los campos obligatorios (Nombre, Email, Teléfono).");
            return;
        }

        // Validar tarjeta si es tarjeta
        if (paymentMethod === 'tarjeta' && !validateCard(cardData.number)) {
            setCardError("Número de tarjeta inválido.");
            return;
        }

        setIsSubmitting(true);
        setApiError('');

        try {
            let paymentResponse;

            if (paymentMethod === 'efectivo') {

                // 🟡 DATOS ARMADOS DESDE FRONTEND (SIMULACIÓN)
                const reservaFake = {
                    title: tour.nombre || tour.name,
                    date: formData.fecha || new Date().toISOString().split('T')[0],
                    travelers: `${cantidadPersonas} Personas`,
                    code: `#XP-${Math.floor(Math.random() * 100000)}`,
                    image: tour.image,
                    email: formData.email,
                    total: totalPrice
                };

                console.log('🟡 Reserva simulada (sin backend):', reservaFake);

                /*
                // 🔵 BACKEND REAL (DESCOMENTAR CUANDO ESTÉ LISTO)
                const reservaData = {
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono,
                    fecha: formData.fecha,
                    notas: formData.notas,
                    items: [tour],
                    total: totalPrice,
                    paymentMethod: paymentMethod,
                    cantidadPersonas: cantidadPersonas,
                    tourId: tour.id,
                };
            
                await clienteAxios.post("/api/reserva/public/efectivo", reservaData);
                */

                // 🚀 REDIRECCIÓN
                navigate('/Exito', {
                    state: reservaFake
                });

                return;
            }
            else if (paymentMethod === 'mercadopago') {
                // Llamar a microservicio de pagos
                paymentResponse = await clienteAxios.post("/api/pagos-servicios", {
                    amount: totalPrice,
                    description: `Reserva para ${tour.name}`,
                    email: formData.email,
                    // Otros datos necesarios
                });
                // Verificar si la transacción fue exitosa
                if (paymentResponse.data.status !== 'approved') {
                    throw new Error("Pago no aprobado");
                }
                // Enviar correo de confirmación
                // TODO: Implementar envío de correo aquí
                // await clienteAxios.post("/api/send-email", { ... });
            }
            else if (paymentMethod === 'tarjeta') {
                // Para Tarjeta: guardar reserva con datos de tarjeta
                await clienteAxios.post("/api/reserva", {
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono,
                    fecha: formData.fecha || new Date().toISOString().split('T')[0],
                    notas: formData.notas,
                    items: [tour],
                    total: totalPrice,
                    paymentMethod: paymentMethod,
                    cuponApli: appliedCoupon ? appliedCoupon.code : null,
                    cantidadPersonas: cantidadPersonas,
                    tourId: tour.id,
                    capacidadUtilizada: cantidadPersonas,
                    descuentoAplicado: discount,
                    metodoPago: paymentMethod,
                    datosTarjeta: {
                        tipo: cardData.type,
                        categoria: cardData.category,
                        ultimosDigitos: cardData.number.slice(-4),
                        vencimiento: cardData.expiry
                    },
                    emailAgencia: null,
                    fechaReserva: new Date().toISOString(),
                });
            }

            if (paymentMethod === 'efectivo') {
                navigate('/reserva-confirmada', {
                    state: {
                        title: tour.nombre || tour.name,
                        date: formData.fecha,
                        travelers: `${cantidadPersonas} Personas`,
                        code: `#XP-${Math.floor(Math.random() * 100000)}`,
                        image: tour.image,
                    }
                });
                return;
            }

            setStep('confirmation');
        } catch (err) {
            console.error("Error procesando reserva:", err);
            setApiError(err.response?.data?.message || "No se pudo procesar la reserva. Intentá nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }).format(value);

    // ---------------------------------------------------------------------------
    // VISTA DE ÉXITO (Modo Claro)
    // ---------------------------------------------------------------------------
    if (step === 'confirmation') {
        return (
            <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans flex flex-col">
                <Nav />
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-white max-w-xl w-full p-10 rounded-2xl text-center shadow-xl border border-slate-200">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="mb-4 text-3xl font-black text-slate-900">¡Reserva Confirmada!</h1>
                        <p className="text-slate-600 mb-8">
                            Tu aventura <strong className="text-slate-900">{tour.nombre || tour.name}</strong> ha sido reservada.
                            Recibirás los detalles en <span className="text-slate-900 font-semibold">{formData.email}</span>.
                        </p>
                        {/* Apartado para manejo de correo */}
                        <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-green-700 text-sm mb-6">
                            <strong>Correo enviado:</strong> Se ha enviado un correo de confirmación a {formData.email} con los detalles de tu reserva.
                            {/* TODO: Aquí se puede agregar lógica adicional para reenvío de correo o personalización */}
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl text-left space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm uppercase tracking-wider font-semibold">Total Pagado</span>
                                <span className="text-orange-600 font-bold text-lg">{formatCurrency(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm uppercase tracking-wider font-semibold">Método</span>
                                <span className="text-slate-800 font-medium capitalize">{paymentMethod === 'tarjeta' ? 'Tarjeta' : paymentMethod === 'efectivo' ? 'Efectivo' : 'Mercado Pago'}</span>
                            </div>
                            {paymentMethod === 'efectivo' && (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm uppercase tracking-wider font-semibold">Contacto Agencia</span>
                                    <span className="text-slate-800 font-medium">{emailConfig.emailAgencia}</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onBack}
                            className="w-full bg-gradient-to-r from-orange-500 to-[#d86015] hover:scale-105 transition-transform text-white py-4 rounded-full font-bold shadow-md"
                        >
                            Volver al Inicio
                        </button>

                        {/** 
                        *  <button
                            onClick={onBack}
                            className="w-full bg-gradient-to-r from-orange-500 to-[#d86015] hover:scale-105 transition-transform text-white py-4 rounded-full font-bold shadow-md"
                        >
                            Volver al Inicio
                        </button>
                       */}
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // VISTA PRINCIPAL DEL CHECKOUT (Modo Claro)
    // ---------------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans relative pb-20">
            {/* Navbar original */}
            <Nav />

            {/* Main */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                {/* Header Personalizado */}
                <div className="relative mb-10 mt-4 flex justify-center items-center w-full">
                    <button
                        onClick={handleBack}
                        className="absolute left-0 z-10 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-[#d86015] px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-xl hover:scale-105 transition-all"
                    >
                        ← Volver
                    </button>
                    <h1 className="text-4xl font-black text-center m-0 text-slate-900">
                        Confirmar Reserva
                    </h1>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Info Personal */}
                        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                    <User className="text-orange-600 w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Información de Titular de reserva</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre</label>
                                    <input
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 transition-all outline-none placeholder:text-slate-400"
                                        placeholder="Ej. Maximiliano"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Apellidos</label>
                                    <input
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 transition-all outline-none placeholder:text-slate-400"
                                        placeholder="Ej. Leguiza"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 transition-all outline-none placeholder:text-slate-400"
                                        placeholder="email@gmail.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 transition-all outline-none placeholder:text-slate-400"
                                        placeholder="+54 9 261 000 - 0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fecha de Reserva</label>
                                    <input
                                        type="date"
                                        name="fecha"
                                        value={formData.fecha}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 transition-all outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notas Adicionales</label>
                                    <textarea
                                        name="notas"
                                        value={formData.notas}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 transition-all outline-none min-h-[120px] resize-none placeholder:text-slate-400"
                                        placeholder="¿Algún requerimiento especial o alergia?"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Pago */}
                        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                                    <Wallet className="text-teal-600 w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Método de Pago</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
                                    { id: 'efectivo', label: 'Efectivo', icon: DollarSign },
                                    { id: 'mercadopago', label: 'Mercado Pago', icon: Wallet }
                                ].map((method) => {
                                    const isSelected = paymentMethod === method.id;
                                    const Icon = method.icon;
                                    return (
                                        <div
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`cursor-pointer flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 transition-all ${isSelected
                                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-orange-600' : 'text-slate-400'}`} />
                                            <span className={`text-xs font-bold uppercase tracking-widest ${isSelected ? 'text-orange-700' : 'text-slate-500'}`}>
                                                {method.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Campos de tarjeta para Tarjeta */}
                            {paymentMethod === 'tarjeta' && (
                                <div className="mt-8 space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900">Datos de la Tarjeta</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Número de Tarjeta</label>
                                            <input
                                                type="text"
                                                name="number"
                                                value={cardData.number}
                                                onChange={handleCardChange}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                                className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 transition-all outline-none placeholder:text-slate-400"
                                            />
                                            {cardData.type && <span className="text-xs text-slate-500 mt-1 block">{cardData.type}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fecha de Vencimiento</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={cardData.expiry}
                                                onChange={handleCardChange}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 transition-all outline-none placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CVV</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={cardData.cvv}
                                                onChange={handleCardChange}
                                                placeholder="123"
                                                maxLength="4"
                                                className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 transition-all outline-none placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre del Titular</label>
                                            <input
                                                type="text"
                                                name="holder"
                                                value={cardData.holder}
                                                onChange={handleCardChange}
                                                placeholder="Como aparece en la tarjeta"
                                                className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-4 transition-all outline-none placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                    {cardError && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                                            {cardError}
                                        </div>
                                    )}
                                    {/* Representación gráfica de la tarjeta */}
                                    {cardData.number && (
                                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-xl">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="text-lg font-bold">{cardData.type || 'Tarjeta'} {cardData.category && `(${cardData.category})`}</div>
                                                <div className="text-xl font-mono">{cardData.number.slice(-4) || '****'}</div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-xs uppercase tracking-wider">Titular</div>
                                                    <div className="text-sm font-medium">{cardData.holder || 'Nombre del Titular'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs uppercase tracking-wider">Vence</div>
                                                    <div className="text-sm font-medium">{cardData.expiry || 'MM/YY'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Nota para Mercado Pago */}
                            {paymentMethod === 'mercadopago' && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
                                    Serás redirigido a Mercado Pago para completar el pago de forma segura.
                                </div>
                            )}

                            {apiError && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium">
                                    {apiError}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT COLUMN (Resumen) */}
                    <aside className="lg:col-span-5">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 sticky top-24">
                            <h2 className="text-2xl font-bold mb-8 text-slate-900">Resumen de Orden</h2>

                            {/* Detalles del Tour */}
                            <div className="flex gap-4 mb-8">
                                <div className="w-24 h-24 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                                    {tour.image ? (
                                        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                                    )}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="font-bold text-lg leading-tight mb-1 text-slate-900">{tour.nombre || tour.name || "Aventura Seleccionada"}</h3>
                                    <p className="text-slate-500 text-sm mb-2 font-medium">Capacidad: {cantidadPersonas} Persona(s) / Máx {capacidadMaxima}</p>
                                    {/* Selector de cantidad de personas */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <button
                                            onClick={() => handleCantidadChange(-1)}
                                            disabled={cantidadPersonas <= 1}
                                            className="w-8 h-8 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 rounded-full flex items-center justify-center text-slate-600"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-medium">{cantidadPersonas}</span>
                                        <button
                                            onClick={() => handleCantidadChange(1)}
                                            disabled={cantidadPersonas >= capacidadMaxima}
                                            className="w-8 h-8 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 rounded-full flex items-center justify-center text-slate-600"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-orange-600 font-bold">{formatCurrency(precioBase)}</p>
                                </div>
                            </div>

                            {/* Cupón */}
                            <div className="flex gap-3 mb-8">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Código de cupón"
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 text-slate-900 rounded-full px-5 py-3 text-sm transition-all outline-none placeholder:text-slate-400"
                                    />
                                    {errorCoupon && <span className="absolute -bottom-5 left-4 text-xs text-red-500 font-medium">{errorCoupon}</span>}
                                </div>
                                <button
                                    onClick={handleApplyCoupon}
                                    className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 rounded-full transition-colors text-xs tracking-wider uppercase shrink-0 shadow-sm"
                                >
                                    Aplicar
                                </button>
                            </div>

                            <hr className="border-slate-200 mb-6" />

                            {/* Desglose */}
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

                            {/* Total Final */}
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-lg uppercase tracking-wider text-slate-900">Total Final</span>
                                <span className="text-4xl font-black text-orange-600">{formatCurrency(totalPrice)}</span>
                            </div>

                            {/* Botón Confirmar */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-orange-500 to-[#d86015] hover:scale-[1.02] text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-transform disabled:opacity-70 disabled:hover:scale-100 shadow-lg"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> PROCESANDO...</>
                                ) : (
                                    <><CheckCircle className="w-5 h-5" /> CONFIRMAR RESERVA</>
                                )}
                            </button>

                            <p className="text-center text-[10px] text-slate-500 mt-5 uppercase tracking-widest px-2 leading-relaxed font-semibold">
                                Al confirmar, aceptas nuestros protocolos de seguridad y términos de servicio.
                            </p>
                        </div>

                        {/* Candado de Seguridad */}
                        <div className="flex items-center justify-center gap-2 mt-8 text-slate-400 text-[10px] tracking-widest uppercase font-bold">
                            <Lock className="w-3 h-3" />
                            <span>Transacción encriptada y segura</span>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}