import NavBar from "../components/NavBar";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import Fondotodo from "../components/fondotodo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Iconos
import { BiSolidFoodMenu } from "react-icons/bi";
import { IoIosChatboxes } from "react-icons/io";
import { RiQrCodeLine, RiStarSFill } from "react-icons/ri";
import { FaBookBookmark } from "react-icons/fa6";
import QRReader from "../components/QRReader";

const HomeCliente = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [escaneandoQR, setEscaneandoQR] = useState(false);

  const manejarQrScanExitoso = async (data: string) => {
    setQrData(data);
    setEscaneandoQR(false);
  };

  const botonesGrandes = [
    {
      icon: (
        <RiStarSFill
          className="text-customOrange drop-shadow-sm group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Ver opiniones",
      redirectTo: "",
    },
    {
      icon: (
        <FaBookBookmark
          className="text-customOrange drop-shadow-sm group-active:text-white transition-all duration-100"
          size={47}
        />
      ),
      text: "Reservas",
      redirectTo: "",
    },
  ];
  const botonesChicos = [
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

  useEffect(() => {
    Swal.fire({
      title: "Bienvenido",
      text: "RestOps",
      icon: "success",
      heightAuto: false,
      timer: 5000,
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#D94908",
    });
  }, []);

  return (
    <div>
      {!escaneandoQR && (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col pb-[76px] overflow-y-auto">
          <NavBar onStateChange={setMenuAbierto} rol={""} />
          {/* Menu desplegable */}
          <SideBarMenuDuenio menuAbierto={menuAbierto} />
          {/* Contenido del Panel de Control */}
          <div className="h-full w-full flex-1 flex flex-col z-10 px-6 pb-8">
            <p className="text-4xl font-bold text-zinc-700 text-start mb-8 mt-9">
              Mesa #{qrData}
            </p>
            <p className="text-4xl font-bold text-zinc-700 text-start mb-8 mt-9">
              Personas delante: <b className="text-customOrange">3</b>
            </p>
            <div className="w-full mt-auto">
              {!qrData && (
                <div
                  onClick={() => setEscaneandoQR(true)}
                  className="group h-auto w-full bg-white border border-zinc-100 flex flex-col items-center justify-center gap-1 py-4 mt-4 shadow-xl rounded-3xl active:border-zinc-300 active:bg-fondoBoton transition-all duration-100"
                >
                  <RiQrCodeLine
                    className="text-customOrange drop-shadow-sm group-active:text-white transition-all duration-100"
                    size={59}
                  />
                  <p className="drop-shadow-md text-xl text-zinc-800 group-active:text-white transition-all duration-100">
                    Solicitar mesa
                  </p>
                </div>
              )}
              {botonesGrandes.map((item) => (
                <a
                  key={item.text}
                  href={item.redirectTo}
                  className="group h-auto w-full bg-white border border-zinc-100 flex flex-col items-center justify-center gap-1 py-4 mt-4 shadow-xl rounded-3xl active:border-zinc-300 active:bg-fondoBoton transition-all duration-100"
                >
                  {item.icon}
                  <p className="drop-shadow-md text-xl text-zinc-800 group-active:text-white transition-all duration-100">
                    {item.text}
                  </p>
                </a>
              ))}
              <div className="flex flex-row justify-center gap-4 mt-4">
                {botonesChicos.map((item) => (
                  <a
                    href={item.redirectTo}
                    className="group h-auto w-full bg-white border border-zinc-100 flex flex-col items-center justify-center gap-1 py-4 shadow-xl rounded-3xl active:border-zinc-300 active:bg-fondoBoton transition-all duration-100"
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
      )}
      {escaneandoQR && <QRReader onScanSuccess={manejarQrScanExitoso} />}
    </div>
  );
};

export default HomeCliente;
