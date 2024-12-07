import NavBar from "../components/NavBar";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import Fondotodo from "../components/fondotodo";
import { useState } from "react";

const HomeBar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Navbar */}
      <NavBar onStateChange={setMenuAbierto} rol={"Bar"} />
      {/* Menu desplegable */}
      <SideBarMenuDuenio menuAbierto={menuAbierto} />
      {/* Contenido de la pagina */}
      <div className="h-full w-full flex-1 flex flex-col z-10">
        <p className="text-4xl font-extrabold text-zinc-700 text-start px-6 mb-8 mt-9">
          Pedidos pendientes
        </p>
      </div>
      <Fondotodo />
    </div>
  );
};

export default HomeBar;
