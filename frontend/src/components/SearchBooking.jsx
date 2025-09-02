import React, { useState } from "react";

const SearchBooking = () => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [personas, setPersonas] = useState(1);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Buscando disponibinilidad ", { checkIn, checkOut, personas });
        // Aquí iría la lógica para buscar disponibilidad
    };
    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Buscar Disponibilidad
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
                {/* Check-in */}
                <div>
                    <label className="block text-gray-700 mb-1">Check-In</label>
                    <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Check-out */}
                <div>
                    <label className="block text-gray-700 mb-1">Check-Out</label>
                    <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Personas */}
                <div>
                    <label className="block text-gray-700 mb-1">Personas</label>
                    <input
                        type="number"
                        min="1"
                        value={personas}
                        onChange={(e) => setPersonas(e.target.value)}
                        className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-blue-700 transition"
                >
                    Buscar
                </button>
            </form>
        </div>
    );
};

export default SearchBooking;

