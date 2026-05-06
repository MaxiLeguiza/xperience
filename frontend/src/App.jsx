// src/App.jsx
import React from "react";
import MapView from "./components/MapView";
import Home from "./pages/home";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import OlvidePassword from "./pages/OlvidePassword";
import NuevoPassword from "./pages/NuevoPassword";
import SearchBooking from "./components/SearchBooking";
import SearchResults from "./components/Booking/SearchResults";
import Exito from "./components/Booking/Exito";
import TourRecorridos from "./components/Recorridos/TourRecorridos";
import WeatherCard from "./components/clima/WeatherCard";
import RedeemPage from "./routes/RedeemPage";
import InfluencerProfile from "./components/Influencers/InfluencerProfile";
import { Routes, Route } from "react-router-dom";
import ListInfluencer from "./components/Influencers/ListInfluencer";
import Nav from "./components/Navbar/Nav";
import InfluencerCard from "./components/Influencers/InfluencerCard";
import LandingPage from "./pages/LandingPage";
import CheckoutPage from "./components/Booking/CheckoutPage";


// CAMBIO 1: Importamos ProtectedRoute para proteger rutas que requieren autenticación
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <Routes>
            {/* CAMBIO 2: LandingPage ahora es la PRIMERA página (ruta "/")
          Todos los usuarios nuevos o sin sesión verán esta página primero.
          El botón "Inicia tu Aventura" los llevará a /login */}
            <Route path="/" element={<LandingPage />} />

            {/* CAMBIO 3: Home ahora está protegida (ruta "/home")
          Solo usuarios logueados pueden acceder.
          Si intentan acceder sin sesión, serán redirigidos a /login */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            {/* Navbar */}
            <Route path="/nav" element={<Nav />} />

            {/* CAMBIO 4: Rutas de autenticación (públicas)
          Usuarios sin sesión pueden acceder a estas páginas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/olvide-password" element={<OlvidePassword />} />
            <Route path="/nuevo-password/:token" element={<NuevoPassword />} />

            {/* CAMBIO 5: Rutas de búsqueda y resultados (protegidas)
          Solo usuarios logueados pueden buscar y ver resultados */}
            <Route path="/buscar" element={<ProtectedRoute><SearchBooking /></ProtectedRoute>} />
            {/* <Route path="/resultados" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} /> */}

            {/* CAMBIO 6: Rutas de carrito y reservas (protegidas)
          Solo usuarios logueados pueden hacer reservas */}
            <Route path="/carrito" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/exito" element={<ProtectedRoute><Exito /></ProtectedRoute>} />

            {/* CAMBIO 7: Rutas de recorridos y clima (protegidas)
          Solo usuarios logueados pueden ver recorridos y clima */}
            <Route path="/recorridos" element={<ProtectedRoute><TourRecorridos /></ProtectedRoute>} />
            <Route path="/clima" element={<ProtectedRoute><WeatherCard /></ProtectedRoute>} />

            {/* CAMBIO 8: Rutas de influencers (protegidas)
          Solo usuarios logueados pueden ver perfiles e información */}
            <Route path="/redeem" element={<ProtectedRoute><RedeemPage /></ProtectedRoute>} />
            <Route path="/ListInfluencer" element={<ProtectedRoute><ListInfluencer /></ProtectedRoute>} />
            <Route path="/Influencers" element={<ProtectedRoute><InfluencerProfile /></ProtectedRoute>} />
            <Route path="/InfluencerCard" element={<ProtectedRoute><InfluencerCard /></ProtectedRoute>} />
        </Routes>
    );
}
