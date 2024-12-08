import NavBar from "../components/NavBar";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import Fondotodo from "../components/fondotodo";
import { useState } from "react";

// Iconos
import { BiSolidFoodMenu } from "react-icons/bi";
import { IoIosChatboxes } from "react-icons/io";
import { RiQrCodeLine } from "react-icons/ri";

const HomeCliente = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const botones = [
    {
      icon: (
        <BiSolidFoodMenu
          className="text-customOrange drop-shadow-sm group-active:text-white transition-all duration-100"
          size={50}
        />
      ),
      text: "Ver menú",
      redirectTo: "",
    },
    {
      icon: (
        <IoIosChatboxes
          className="text-customOrange drop-shadow-sm group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Cosultar mozo",
      redirectTo: "",
    },
  ];
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col pb-[76px]">
      <NavBar onStateChange={setMenuAbierto} rol={""} />
      {/* Menu desplegable */}
      <SideBarMenuDuenio menuAbierto={menuAbierto} />
      {/* Contenido del Panel de Control */}
      <div className="h-full w-full flex-1 flex flex-col z-10 px-6 pb-8">
        <p className="text-4xl font-bold text-zinc-700 text-start mb-8 mt-9">
          Mesa #101
        </p>
        <p className="text-4xl font-bold text-zinc-700 text-start mb-8 mt-9">
          Personas delante: <b className="text-customOrange">3</b>
        </p>
        <div className="w-full mt-auto">
          <a
            href={""}
            className="group h-auto w-full bg-white border border-zinc-100 flex flex-col items-center justify-center gap-2 py-6 shadow-xl rounded-3xl active:border-zinc-300 active:bg-fondoBoton transition-all duration-100"
          >
            <RiQrCodeLine
              size={60}
              className="text-customOrange drop-shadow-sm group-active:text-white transition-all duration-100"
            />
            <p className="drop-shadow-md text-xl text-zinc-800 group-active:text-white transition-all duration-100">
              {"Solicitar mesa"}
            </p>
          </a>
          <div className="flex flex-row justify-center gap-4 mt-6">
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
      </div>
      <Fondotodo />
    </div>
  );
};

export default HomeCliente;
