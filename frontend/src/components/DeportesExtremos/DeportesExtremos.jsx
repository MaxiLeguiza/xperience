import React, { useState, useEffect } from 'react';

function DeportesExtremos() {
    const [topExtremeSports, setTopExtremeSports] = useState([]);

    useEffect(() => {
        setTopExtremeSports([
            { id: 1, title: "Parapente", lugar: "Carhuaz", duration: "2h 30m" },
            { id: 2, title: "Rafting", lugar: "Río Mendoza", duration: "4h 00m" },
            { id: 3, title: "Trekking", lugar: "Cerro Arco", duration: "1h 45m" },
        ]);
    }, []);

    return (
        <div id="deportes" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Deportes Extremos</h3>
            <div className="space-y-4">
                {topExtremeSports.map((sport) => (
                    <div
                        key={sport.id}
                        className="bg-gradient-to-r from-orange-400 via-red-500 to-black text-white p-4 rounded-xl shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg,  #FF4500, #FF0000 , #000000)',
                        }}
                    >
                        <h4 className="font-semibold">{sport.title}</h4>
                        <p className="text-sm opacity-90">Lugar: {sport.lugar}</p>
                        <p className="text-sm opacity-90">Duración: {sport.duration}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DeportesExtremos;
