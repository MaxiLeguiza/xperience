import { Link } from "react-router-dom"; // o Next.js: import Link from "next/link";

export default function Navbar() {
  return (
    <aside className="w-64 bg-blue-600 text-white flex flex-col p-6 rounded-lg">
      {/* Logo o título */}
      <h1 className="text-2xl font-bold mb-8">MiApp</h1>

      {/* Links */}
      <nav className="flex flex-col space-y-4">
        <Link to="/perfil" className="hover:bg-blue-700 px-3 py-2 rounded-md">
          Perfil / Home
        </Link>
        <Link
          to="/agendas"
          className="hover:bg-blue-700 px-3 py-2 rounded-md"
        >
          Agendas / Registro de excursiones
        </Link>
        <Link
          to="/promociones"
          className="hover:bg-blue-700 px-3 py-2 rounded-md"
        >
          Promociones
        </Link>
        <Link to="/about" className="hover:bg-blue-700 px-3 py-2 rounded-md">
          About
        </Link>
      </nav>
    </aside>
  );
}
