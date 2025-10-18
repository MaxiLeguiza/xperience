import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function InfluencerCard() {
    const [topInfluencers, setTopInfluencers] = useState([]);

    useEffect(() => {
        setTopInfluencers([
            {
                id: 1,
                nombre: "Carlos A.",
                usuario: "@carlos_aventura",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNzD-FcvpRdhM9ug8_GLJOuedf1AOgNikGAwtHQhPaBV529A1cHBdYwEJBoXMqWR6U7crUoi7jQ_iymGPpbrbBSY00Z5R24Y0fhIMVlPBro5Ys4qShv6sZ10iKiTjltuSxQLEDAbR2PXmQ9W7FRsroyZv_MnGO_D7MB9TOEqDBSTZKoi3JXHG_KhVrnVJrpjLcXajYpHptgwSEnXL7oUoevMzhPGSNAZJT9fotGaCcY68JZthiakdwRoZRRfxUWopxD7pK8MWoVLQ",
            },
            {
                id: 2,
                nombre: "Elena Viajera",
                usuario: "@elena_explora",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBM_4OzOG71nzIxtjfKUATPVoF3pzzUZjvrErvVcrI2EDewzo6BabR1KT_y0D6HZCIRmn7iwu0NLDIXlpQCBxoDWXL2OQxskKrUODPbetpWjOr1FLAwg4AxD8LjILBBmCpZBpFIJz5F3RCwtGyKs8vezmZ3sf8_ccPLIvui80uIr5BG72AAM0i3Ee0spuvTR7WqrhHbtvRSw4WTMr_Jfp7W3ZWS_g4Z1bxeba1M_qGzYFJDzKeWXDIwcFHKhrANws10g9LmagVvjQ4",
            },
            {
                id: 3,
                nombre: "Marco Polo",
                usuario: "@marcopolotrips",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCyHoxIYQO6wFjYi0Mn0i42LD9VSaPI3rL5PnyGE2nCv7FdOHSAqiSZxagEFgYSqZfkAoZC6BBiAborVIrcYKty1xrC118ypw09mhknzmW8fDXq1lkTN7TCzVcn4SHdspJc305YOhuaScDF0qXrPqtLldGIeTexgHsxqlrb2Ifjc9cZ5JWsNAeE3OF5fUsquiuC3w7Hy6g_u34TOdnKCHzwrqhGaH4G2yjTOTRcwCbPSeqCdkcZdfDNa6fks7r7j3lt9HOxDg6zG4",
            },
        ]);
    }, []);

    return (
        <div id="influencers" className="bg-white p-3 rounded-lg shadow-md flex-1">
            <h3 className="text-xl font-semibold mb-8 text-gray-900 text-center">Influencers</h3>
            <div className="space-y-4">
                {topInfluencers.map((inf) => (
                    <div key={inf.id} className="flex items-center space-x-4 bg-white text-gray-900 p-6 rounded-lg shadow-xl border-l-4 border-orange-500">
                   {/**  style={{ background: 'linear-gradient(135deg,  #16697A, #011a51)',}}> COlores de patillas  */}
                        <img src={inf.img} alt={`Foto de ${inf.nombre}`} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <h4 className="font-semibold text-black">{inf.nombre}</h4>
                            <p className="text-sm text-gray-400">{inf.usuario}</p>
                        </div>
                    </div>
                ))}
                <Link to="/ListInfluencer">
                    <button className="w-full text-orange-600 hover:underline text-sm font-medium mt-6">Ver más</button>
                </Link>
            </div>
        </div>
    );
}

export default InfluencerCard;
