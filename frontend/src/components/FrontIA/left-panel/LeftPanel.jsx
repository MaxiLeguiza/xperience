import InitialState from "./InitialState";
import ActiveState from "./ActiveState";

export default function LeftPanel({ expedition }) {
  return (
    <section className="w-full md:w-1/2 h-[calc(100vh-8rem)] relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/80 shadow-2xl shadow-black/30">
      {!expedition ? <InitialState /> : <ActiveState expedition={expedition} />}
    </section>
  );
}
