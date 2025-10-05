import React from "react";
import activities from "./data/activities.json";
import MapView from "./components/MapView";
import Home from "./pages/home";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import SearchBooking from "./components/SearchBooking";
import SearchResults from "./components/Booking/SearchResults";
import Cart from "./components/Booking/Cart";          
import Confirmacion from "./components/Booking/Confirmacion";
import Exito from "./components/Booking/Exito";
import TourRecorridos from "./components/Recorridos/TourRecorridos";
import WeatherCard from "./components/clima/WeatherCard";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";


export default function App() {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="registrar" element={<Registrar />} />
      {/* Página principal con el buscador */}
      <Route path="/" element={<SearchBooking />} />
      {/* Página de resultados */}
      <Route path="/resultados" element={<SearchResults />} />
      {/* <Route path="olvide-password" element={<OlvidePassword />} />
      <Route path="olvide-password/:token" element={<NuevoPassword />} />
      <Route path="confirmar/:id" element={<ConfirmarCuenta />} /> */}
      {/* Carrito de reservas */}
      <Route path="/carrito" element={<Cart />} />

      {/* Confirmación de reserva */}
      <Route path="/confirmacion" element={<Confirmacion />} />
      {/* Página de éxito */}
      <Route path="/exito" element={<Exito />} /> {/* Nueva ruta */}
      {/* Página de recorridos */}
      <Route path="/recorridos" element={<TourRecorridos />} />
      {/*Clima */}
      <Route path = "/clima" element={<WeatherCard />} />


    </Routes>

  );
}
