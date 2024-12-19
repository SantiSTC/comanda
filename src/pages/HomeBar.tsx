import NavBar from "../components/NavBar";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import Fondotodo from "../components/fondotodo";
import { useEffect, useState } from "react";
import { modificar, traer } from "../services/firestore";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa";
import { PiEmptyBold } from "react-icons/pi";

const HomeBar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [usuarios, setusuarios] = useState<any[]>([]);
  const [pedidosPendientesDeBar, setPedidosPendientesDeBar] = useState<any[]>(
    []
  );

  useEffect(() => {
    traer("pedidos", "", (data) => {
      setPedidos(data);
      const pedidosPendientes = data.filter(
        (item) => item.estadoDelPedido == "pedidoEsperandoCocinaBar"
      );
      const pedidosPendientesCocina = pedidosPendientes.filter((item) =>
        requiereBar(item)
      );
      setPedidosPendientesDeBar(pedidosPendientesCocina); // Actualiza el estado una sola vez
    });
  }, []);

  const requiereBar = (pedido: any): boolean => {
    return pedido.contenidoDelPedido.some(
      (item: any) => item.tipo === "bebida"
    );
  };

  const formatearFecha = (timestamp: number): string => {
    const fecha = new Date(timestamp);
    const dia = fecha.getDate().toString().padStart(2, "0"); // Día con 2 dígitos
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Mes con 2 dígitos (0-indexed)
    const anio = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, "0"); // Horas con 2 dígitos
    const minutos = fecha.getMinutes().toString().padStart(2, "0"); // Minutos con 2 dígitos

    return `${dia}/${mes}/${anio} - ${horas}:${minutos}`;
  };

  const marcarPedidoComoListo = (pedido: any, estadoAAsignar: string) => {
    pedido.bebidaLista = true;
    if (pedido.comidaLista) {
      pedido.estadoDelPedido = estadoAAsignar;
    }
    modificar("pedidos", pedido).then(() => {
      if(pedido.comidaLista && pedido.bebidaLista) {
        Swal.fire({
          title: "Listo",
          text: "Pedido marcado como listo para entregar",
          icon: "success",
          heightAuto: false,
          timer: 3000,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#D94908",
        });
      } else {
        Swal.fire({
          title: "Listo",
          text: "Pedido marcado como bebida lista",
          icon: "success",
          heightAuto: false,
          timer: 3000,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#D94908",
        });
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Navbar */}
      <NavBar onStateChange={setMenuAbierto} rol={"Chef"} />
      {/* Menu desplegable */}
      <SideBarMenuDuenio menuAbierto={menuAbierto} />
      {/* Contenido de la pagina */}
      <div className="h-full w-full flex-1 flex flex-col z-10">
        <p className="text-4xl font-extrabold text-zinc-700 text-start px-6 mb-8 mt-9">
          Pedidos pendientes
        </p>
        {pedidosPendientesDeBar.length > 0 && (
          <div className="mt-7 px-6 w-full flex flex-col items-center gap-2 flex-1 mb-40 overflow-y-auto">
            {pedidosPendientesDeBar.map((pedido) => (
              <div className="w-full rounded-xl bg-white border border-zinc-100 px-4 py-3 z-[999]">
                <p className="text-black text-xl font-medium">
                  Pedido de:{" "}
                  <b className="text-customOrange font-medium">
                    {pedido.emailUsuario}
                  </b>
                </p>
                <p className="text-black text-xl font-medium">
                  Mesa: #
                  <b className="text-customOrange font-medium">
                    {pedido.mesaUsuario}
                  </b>
                </p>
                <p className="text-black text-lg mt-0.5 italic">
                  Hora del pedido: {formatearFecha(pedido.time)}
                </p>
                <div className="w-full flex flex-row justify-between items-center pr-2 mt-3">
                  <p className="text-lime-600 text-xl font-bold text-center">
                    {pedido.estadoDelPedido
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .toUpperCase()}
                  </p>
                </div>
                <div className="flex flex-row gap-4 justify-center mt-2 z-50">
                  <div
                    onClick={() =>
                      marcarPedidoComoListo(pedido, "pedidoListoParaEntregar")
                    }
                    className="bg-lime-600 rounded-xl py-2 px-3 flex items-center flex-row gap-2 active:scale-95 transition-all"
                  >
                    <p className="text-white font-semibold text-xl">
                      Pedido listo
                    </p>
                    <FaCheck size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {pedidosPendientesDeBar.length == 0 && (
          <div className="w-full flex justify-center items-center flex-col gap-6 pt-20">
            <PiEmptyBold size={80} className="text-customOrange" />
            <p className="text-zinc-800 text-xl text-center px-8">
              No hay pedidos esperando bar
            </p>
          </div>
        )}
      </div>
      <Fondotodo />
    </div>
  );
};

export default HomeBar;
