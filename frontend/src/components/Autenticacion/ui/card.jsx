// App.jsx — versión standalone (con lucide-react para íconos)
import React from "react";
import { MapPin, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";

/* -------------------- Mini UI primitives -------------------- */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-2xl bg-white shadow-lg", className)}
      {...props}
    />
  );
}
function CardHeader({ className, ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}
function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
}
function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-gray-500", className)} {...props} />;
}
function CardContent({ className, ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}
function CardFooter({ className, ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}

function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-white",
        "bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20",
        className
      )}
      {...props}
    />
  );
}

function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white",
        "bg-gray-900",
        className
      )}
      {...props}
    />
  );
}

/* -------------------- Imagen con fallback -------------------- */
function ImageWithFallback({ src, alt, className, fallbackSrc }) {
  const [error, setError] = React.useState(false);
  const finalSrc = !error
    ? src
    : fallbackSrc ||
      "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
               <rect width='100%' height='100%' fill='#FDBA74'/>
               <text x='50%' y='50%' font-family='sans-serif' font-size='32' fill='#9A3412' text-anchor='middle' dominant-baseline='middle'>Imagen no disponible</text>
             </svg>`
        );

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

// Item que enviaremos al carrito
const recorrido = {
  id: "recorrido-chacras-bici",
  nombre: "Ciclismo en Chacras de Coria",
  capacidad: 1,
  precio: "$12000",
};

/* -------------------- App -------------------- */
export default function CardUi() {
  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <Card className="w-full max-w-[280px] sm:max-w-xs overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <ImageWithFallback
            src="/chacras_de_coria.png"
            alt="Destino turístico"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 text-xs">
            Recomendado
          </Badge>
        </div>

        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Ciclismo en Chacras de Coria</CardTitle>
          <CardDescription className="flex items-center gap-1 text-xs">
            <MapPin className="w-3 h-3" />
            Chacras de Coria, Mendoza
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3">
          <p className="text-gray-600 text-sm">
            Ruta tranquila entre viñedos, con vistas únicas y guía local con
            tips
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              <Star className="w-4 h-4 text-gray-600 fill-gray-600" />
              <span className="ml-1 text-xs text-gray-600">4.0</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              2-3h
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Link to="/carrito" state={{ selectedItems: [recorrido] }}>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 transition-colors text-sm py-2">
              Reservar ahora
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
