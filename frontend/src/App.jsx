// src/App.jsx
import React from "react";
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
import RedeemPage from "./routes/RedeemPage";
import InfluencerProfile from "./components/Influencers/InfluencerProfile";
import { Routes, Route } from "react-router-dom";
import ListInfluencer from "./components/Influencers/ListInfluencer";
import Nav from "./components/Navbar/Nav";
import InfluencerCard from "./components/Influencers/InfluencerCard";

export default function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />
      {/* Navbar */}
      <Route path="/nav" element={<Nav />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Registrar />} />

      {/* Buscador */}
      {/* OJO: antes tenías otra vez path="/" -> lo cambio a /buscar para no pisar el Home */}
      <Route path="/buscar" element={<SearchBooking />} />
      <Route path="/resultados" element={<SearchResults />} />

      {/* Carrito / reservas */}
      <Route path="/carrito" element={<Cart />} />
      <Route path="/confirmacion" element={<Confirmacion />} />
      <Route path="/exito" element={<Exito />} />

      {/* Recorridos / Clima */}
      <Route path="/recorridos" element={<TourRecorridos />} />
      <Route path="/clima" element={<WeatherCard />} />

      {/* ✅ Ruta del QR */}
      <Route path="/redeem" element={<RedeemPage />} />
      {/*Listado influencer*/}
      <Route path="/ListInfluencer" element={<ListInfluencer />} />
      {/*Perfil influencer*/}
      <Route path="/Influencers" element={<InfluencerProfile />} />
      <Route path="/InfluencerCard" element={<InfluencerCard />} />


    </Routes>
  );
}
