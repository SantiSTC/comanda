import { useState } from "react";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import NavBar from "../components/NavBar";
import Fondotodo from "../components/fondotodo";

// Iconos
import { IoStatsChart } from "react-icons/io5";
import { FaBookBookmark } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { MdTableBar, MdDeliveryDining } from "react-icons/md";
import { RxLapTimer } from "react-icons/rx";

const HomeDuenio = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const botones = [
    {
      icon: (
        <RxLapTimer
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Lista de espera",
      redirectTo: "",
    },
    {
      icon: (
        <FaBookBookmark
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Reservas",
      redirectTo: "",
    },
    {
      icon: (
        <FaUsers
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Usuarios",
      redirectTo: "",
    },
    {
      icon: (
        <MdTableBar
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Mesas",
      redirectTo: "",
    },
    {
      icon: (
        <MdDeliveryDining
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Delivery",
      redirectTo: "",
    },
    {
      icon: (
        <IoStatsChart
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Reportes",
      redirectTo: "",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      <NavBar onStateChange={setMenuAbierto} rol={"Dueño"} />
      {/* Menu desplegable */}
      <SideBarMenuDuenio menuAbierto={menuAbierto} />
      {/* Contenido del Panel de Control */}
      <div className="h-full w-full flex-1 flex flex-col z-10">
        <p className="text-4xl font-extrabold text-zinc-700 text-start px-6 mb-8 mt-9">
          Panel de Control
        </p>
        <div className="grid grid-cols-2 h-auto items-center px-6 gap-4 mt-1 overflow-y-auto">
          {botones.map((item) => (
            <a
              key={item.text}
              href={item.redirectTo}
              className="group h-auto w-full bg-white border border-zinc-200 flex flex-col items-center justify-center gap-2 py-6 rounded-3xl active:border-zinc-300 active:bg-fondoBoton transition-all duration-100"
            >
              {item.icon}
              <p className="drop-shadow-md text-xl text-zinc-800 group-active:text-white transition-all duration-100">
                {item.text}
              </p>
            </a>
          ))}
        </div>
      </div>
      <Fondotodo />
    </div>
  );
};

export default HomeDuenio;
