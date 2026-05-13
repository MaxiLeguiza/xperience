import { useState } from "react";
import LeftPanel from "../components/FrontIA/left-panel/LeftPanel";
import ChatPanel from "../components/FrontIA/chat/ChatPanel";
import Nav from "../components/Navbar/Nav";

export default function Chat() {
  const [expedition, setExpedition] = useState(null);
  /*const [expedition, setExpedition] = useState({
    name: "Lago Potrerillos",
    activity: "kayaking",
    climate: "Árido de montaña",
    difficulty: "Baja/Media",
    region: "Mendoza, Argentina",
    description: "Remonta las serenas aguas turquesas del Lago Potrerillos, rodeado por la majestuosidad de los Andes. Disfruta de la paz y vistas espectaculares en este embalse paradisíaco."
  });*/

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.16),_transparent_27%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_right,_rgba(59,130,246,0.12),_transparent_40%)]" />

      <Nav />

      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 pb-4 pt-8 md:px-6 md:flex-row md:pb-1">
        <LeftPanel expedition={expedition} />
        <ChatPanel expedition={expedition} setExpedition={setExpedition} />
      </main>
    </div>
  );
}