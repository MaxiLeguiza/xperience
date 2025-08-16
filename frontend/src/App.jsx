// src/App.jsx
import MapView from "./components/MapView";

export default function App() {
  return (
    <div className="parent">
      <div className="div1">Contenedor 1</div>
      <div className="div2">Contenedor 2</div>
      <div className="div3">Contenedor 3</div>

      {/* Contenedor 4: SOLO el mapa adentro */}
      <div className="div4">
        <div className="container4">
          <MapView />
        </div>
      </div>

      <div className="div5">Contenedor 5</div>
      <div className="div6">Contenedor 6</div>
    </div>
  );
}
