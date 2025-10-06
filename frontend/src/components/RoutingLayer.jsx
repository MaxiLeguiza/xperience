import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix íconos (Leaflet default)
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

/* ============== Íconos desde /public/images/markers ============== */
function makeIcon(url, size = [40, 40], anchor = [20, 40]) {
  return L.icon({
    iconUrl: url,
    iconRetinaUrl: url,
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -32],
    shadowUrl,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
}

const ICONS = {
  rafting: makeIcon("/images/markers/rafting.png", [40, 40], [20, 40]),
  cabalgata: makeIcon("/images/markers/cabalgata.svg", [44, 44], [22, 44]),
  ciclismo: makeIcon("/images/markers/ciclismo.svg", [40, 40], [20, 40]),
  parapente: makeIcon("/images/markers/parapente.svg", [40, 40], [20, 40]),
  trekking: makeIcon("/images/markers/trekking.png", [40, 40], [20, 40]),
  insti: makeIcon("/images/markers/insti.png", [40, 40], [20, 40]),
  default: new L.Icon.Default(),
};

const iconFor = (p) =>
  p?.icon
    ? makeIcon(p.icon)
    : ICONS[(p?.category || "").toLowerCase()] ?? ICONS.default;

// Icono para resultados del buscador
const DEST_ICON = makeIcon("/images/markers/trekking.png", [40, 40], [20, 40]);

// Icono de ubicación (azul)
const LOCATE_ICON = L.divIcon({
  className: "",
  html: `
    <div style="
      width:18px;height:18px;border-radius:9999px;background:#1a73e8;
      border:3px solid #fff;box-shadow:0 0 0 4px rgba(26,115,232,0.30);
      transform:translate(-50%,-50%);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const RoutingLayer = ({ from, to, onRouteInfo }) => {
  const map = useMap();
  const controlRef = useRef();

  useEffect(() => {
    if (!from || !to) return;

    if (controlRef.current) {
      map.removeControl(controlRef.current);
      controlRef.current = null;
    }

    controlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.location.lat, to.location.lng),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      show: false,
      fitSelectedRoutes: true,
      lineOptions: { styles: [{ color: "#1a73e8", weight: 5, opacity: 0.85 }] },
      createMarker: (i, wp) =>
        i === 0
          ? L.marker(wp.latLng, { icon: LOCATE_ICON })
          : L.marker(wp.latLng, { icon: DEST_ICON }),
    }).addTo(map);

    controlRef.current.on("routesfound", function (e) {
      const route = e.routes[0];
      if (onRouteInfo) {
        onRouteInfo({
          duration: route.summary.totalTime,
          distance: route.summary.totalDistance,
        });
      }
    });

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
      if (onRouteInfo) onRouteInfo(null);
    };
  }, [from, to, map, onRouteInfo]);

  return null;
};

export default RoutingLayer;
export { iconFor };