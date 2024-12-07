import NavBar from "../components/NavBar";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import Fondotodo from "../components/fondotodo";
import { useState } from "react";

// Iconos
import { BiSolidFoodMenu } from "react-icons/bi";
import { IoIosChatboxes } from "react-icons/io";

const HomeCliente = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const botones = [
    {
      icon: (
        <BiSolidFoodMenu 
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={50}
        />
      ),
      text: "Ver menú",
      redirectTo: "",
    },
    {
      icon: (
        <IoIosChatboxes
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Cosultar mozo",
      redirectTo: "",
    },
  ];
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      <NavBar onStateChange={setMenuAbierto} rol={""} />
      {/* Menu desplegable */}
      <SideBarMenuDuenio menuAbierto={menuAbierto} />
      {/* Contenido del Panel de Control */}
      <div className="h-full w-full flex-1 flex flex-col z-10">
        <p className="text-4xl font-bold text-zinc-700 text-start px-6 mb-8 mt-9">
          Mesa #101
        </p>
        <div className="flex flex-row justify-center px-6 gap-4 mt-6 mb-[76px]">
          {botones.map((item) => (
            <a
              href={item.redirectTo}
              className="group h-auto w-full bg-white border border-zinc-100 flex flex-col items-center justify-center gap-2 py-6 shadow-xl rounded-3xl active:border-zinc-300 active:bg-fondoBoton transition-all duration-100"
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

export default HomeCliente;
