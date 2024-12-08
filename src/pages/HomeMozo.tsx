import NavBar from "../components/NavBar";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import Fondotodo from "../components/fondotodo";
import { useState } from "react";

// Iconos
import { MdDinnerDining, MdTableBar } from "react-icons/md";

const HomeMozo = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pestaniaelegida, setPestaniaElegida] = useState("mesas");

  const botones = [
    {
      icon: <MdTableBar size={30} />,
      text: "Mesas",
      pestania: "mesas",
    },
    {
      icon: <MdDinnerDining size={30} />,
      text: "Pedidos",
      pestania: "pedidos",
    },
  ];

  const mesas = [];
  const pedidos = [];

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Navbar */}
      <NavBar onStateChange={setMenuAbierto} rol={"Mozo"} />
      {/* Menu desplegable */}
      <SideBarMenuDuenio menuAbierto={menuAbierto} />
      {/* Contenido de la pagina */}
      <div className="h-full w-full flex-1 flex flex-col z-10 mt-8 mb-6">
        <div className="flex flex-row justify-center px-6 gap-4">
          {botones.map((item) => (
            <div
              key={item.pestania}
              onClick={() => setPestaniaElegida(item.pestania)}
              className={`${
                pestaniaelegida == item.pestania
                  ? "bg-fondoBoton"
                  : "bg-white"
              } group h-auto w-full flex flex-row items-end justify-center gap-3 py-3 shadow-xl rounded-3xl active:border-zinc-300 active:bg-fondoBoton transition-all duration-100`}
            >
              <div
                className={`${
                  pestaniaelegida == item.pestania
                    ? "text-white drop-shadow-md transition-all duration-100"
                    : "text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
                }`}
              >
                {item.icon}
              </div>
              <p
                className={`${
                  pestaniaelegida == item.pestania
                    ? "text-white"
                    : "text-zinc-800"
                } drop-shadow-md text-xl group-active:text-white transition-all duration-100`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>{/* CONTENIDO ACA */}</div>
      <Fondotodo />
    </div>
  );
};

export default HomeMozo;
