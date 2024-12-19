import NavBar from "../components/NavBar";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import Fondotodo from "../components/fondotodo";
import { useEffect, useState } from "react";

// Iconos
import { MdDinnerDining, MdTableBar } from "react-icons/md";
import { modificar, traer } from "../services/firestore";
import { PiEmptyBold } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";

const HomeMozo = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mesas, setMesas] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [usuarios, setusuarios] = useState<any[]>([]);
  const [pedidosPendientesDeAceptar, setPedidosPendientesDeAceptar] = useState<
    any[]
  >([]);
  const [pedidosListosParaEntregar, setPedidosListosParaEntregar] = useState<
    any[]
  >([]);
  const [pedidosPagados, setPedidosPagados] = useState<any[]>([]);
  const [verSoloPendientes, setVerSoloPendientes] = useState("pendientes");

  useEffect(() => {
    traer("pedidos", "", (data) => {
      setPedidos(data);
      const pedidosAAceptar = data.filter(
        (item) => item.estadoDelPedido == "pendienteDeAprobacionDeMozo"
      );
      setPedidosPendientesDeAceptar(pedidosAAceptar); // Actualiza el estado una sola vez
    });

    traer("mesas", "", (data) => {
      setMesas(data);
    });

    traer("usuarios", "", (data) => {
      setusuarios(data);
    });
  }, []);

  const manejarEstadoDelPedido = (pedido: any, estadoAAsignar: string) => {
    pedido.estadoDelPedido = estadoAAsignar;
    modificar("pedidos", pedido).then(() => {
      Swal.fire({
        title: "Aprobado",
        text: "Pedido enviado a cocinar/bar",
        icon: "success",
        heightAuto: false,
        timer: 3000,
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#D94908",
      });
    });
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

  useEffect(() => {
    if (pedidos && usuarios) {
      pedidos.map((pedido) => {
        usuarios.map((usuario) => {
          if (pedido.emailUsuario == usuario.email) {
            usuario.pedidos.map((userOrder: any) => {
              if (userOrder.time == pedido.time) {
                userOrder.estadoDelPedido = pedido.estadoDelPedido;
                modificar("usuarios", usuario);
              }
            });
          }
        });
      });

      const pedidosListosParaEntregar = pedidos.filter(
        (item) => item.estadoDelPedido == "pedidoListoParaEntregar"
      );
      setPedidosListosParaEntregar(pedidosListosParaEntregar);

      const pedidosPagados = pedidos.filter(
        (item) => item.estadoDelPedido == "pagado"
      );
      setPedidosPagados(pedidosPagados);
    }
  }, [pedidos]);

  const obtenerPrecioTotalDelPedido = (pedido: any) => {
    return pedido.reduce(
      (suma: number, plato: any) => suma + parseFloat(plato.precio),
      0
    );
  };

  const confirmarPagoRecibido = (pedido: any) => {
    pedido.estadoDelPedido = "pedidoFinalizado";

    modificar("pedidos", pedido).then(() => {
      const mesaAModificar = mesas.find(
        (item) => item.comenzal === pedido.emailUsuario
      );

      mesaAModificar.comenzal = "";
      mesaAModificar.estado = "libre";

      modificar("mesas", mesaAModificar).then(() => {
        const usuario = usuarios.find(
          (user) => user.email == mesaAModificar.comenzal
        );

        usuario.mesaAsignada = "";
        usuario.personasEnMesa = 0;
        usuario.estadoEnRestaurant = "nulo";
      });
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Navbar */}
      <NavBar onStateChange={setMenuAbierto} rol={"Mozo"} />
      {/* Menu desplegable */}
      <SideBarMenuDuenio menuAbierto={menuAbierto} />
      {/* Contenido de la pagina */}
      <div className="w-full h-full">
        <div className="h-full w-full flex-1 flex flex-col px-6 z-50">
          <p className="text-4xl font-extrabold text-zinc-700 text-start mb-4 mt-8">
            Pedidos
          </p>
          <div className="w-full flex flex-row gap-1 justify-center items-center mb-4 z-50 bg-white rounded-lg py-2 shadow-sm">
            <div
              onClick={() => setVerSoloPendientes("todos")}
              className={`px-2 py-1 rounded-xl ${
                verSoloPendientes == "todos"
                  ? "bg-fondoBoton text-white"
                  : "text-black"
              }`}
            >
              <p className="text-sm">Todos</p>
            </div>
            <p className="text-black">|</p>
            <div
              onClick={() => setVerSoloPendientes("pendientes")}
              className={`px-2 py-1 rounded-xl ${
                verSoloPendientes == "pendientes"
                  ? "bg-fondoBoton text-white"
                  : "text-black"
              }`}
            >
              <p className="text-sm">Pendientes</p>
            </div>
            <p className="text-black">|</p>
            <div
              onClick={() => setVerSoloPendientes("entregar")}
              className={`px-2 py-1 rounded-xl ${
                verSoloPendientes == "entregar"
                  ? "bg-fondoBoton text-white"
                  : "text-black"
              }`}
            >
              <p className="text-sm">Para entregar</p>
            </div>
            <p className="text-black">|</p>
            <div
              onClick={() => setVerSoloPendientes("pagados")}
              className={`px-2 py-1 rounded-xl ${
                verSoloPendientes == "pagados"
                  ? "bg-fondoBoton text-white"
                  : "text-black"
              }`}
            >
              <p className="text-sm">Pagados</p>
            </div>
          </div>
          {verSoloPendientes == "pendientes" && (
            <div>
              <p className="text-lg text-zinc-700 text-start px-3">
                Revisa los pedidos pendientes de aprobacion
              </p>
              {pedidosPendientesDeAceptar.length > 0 && (
                <div className="mt-7 w-full flex flex-col items-center gap-2 flex-1 mb-40 overflow-y-auto">
                  {pedidosPendientesDeAceptar.map((pedido) => (
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
                            manejarEstadoDelPedido(
                              pedido,
                              "pedidoEsperandoCocinaBar"
                            )
                          }
                          className="bg-lime-600 rounded-xl py-2 px-3 flex items-center flex-row gap-2 active:scale-95 transition-all"
                        >
                          <p className="text-white font-semibold text-xl">
                            Aprobar
                          </p>
                          <FaCheck size={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {pedidosPendientesDeAceptar.length == 0 && (
                <div className="w-full flex justify-center items-center flex-col gap-6 pt-20">
                  <PiEmptyBold size={80} className="text-customOrange" />
                  <p className="text-zinc-800 text-xl text-center px-8">
                    No hay pedidos pendientes aceptacion
                  </p>
                </div>
              )}
            </div>
          )}
          {verSoloPendientes == "todos" && (
            <div>
              <p className="text-lg text-zinc-700 text-start px-3">
                Estos son todos los pedidos
              </p>
              <div className="mt-7 w-full flex flex-col items-center gap-2 max-h-[50vh] mb-40 z-[100000] overflow-y-auto">
                {pedidos.map((pedido) => (
                  <div className="w-full rounded-xl bg-white border border-zinc-100 px-4 py-3">
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
                  </div>
                ))}
              </div>
            </div>
          )}
          {verSoloPendientes == "entregar" && (
            <div>
              <p className="text-lg text-zinc-700 text-start px-3">
                Estos son los pedidos listos para entregar a la mesa
              </p>
              {pedidosListosParaEntregar.length > 0 && (
                <div className="mt-7 w-full flex flex-col items-center gap-2 max-h-[50vh] mb-40 z-[100000] overflow-y-auto">
                  {pedidosListosParaEntregar.map((pedido) => (
                    <div className="w-full rounded-xl bg-white border border-zinc-100 px-4 py-3">
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
                    </div>
                  ))}
                </div>
              )}
              {pedidosListosParaEntregar.length == 0 && (
                <div className="w-full flex justify-center items-center flex-col gap-6 pt-20">
                  <PiEmptyBold size={80} className="text-customOrange" />
                  <p className="text-zinc-800 text-xl text-center px-8">
                    No hay pedidos listos para entregar
                  </p>
                </div>
              )}
            </div>
          )}
          {verSoloPendientes == "pagados" && (
            <div className="max-h-[45vh] overflow-y-auto z-[10000]">
              <p className="text-lg text-zinc-700 text-start px-3">
                Estos son los pedidos pagados esperando confirmación
              </p>
              {pedidosPagados.length > 0 && (
                <div className="mt-7 w-full flex flex-col items-center gap-2 overflow-y-auto">
                  {pedidosPagados.map((pedido) => (
                    <div
                      key={pedido.emailUsuario}
                      className="w-full rounded-xl bg-white border border-zinc-100 px-4 py-3"
                    >
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
                      <p className="text-xl text-zinc-800 font-semibold">
                        Monto: $
                        <b className="text-customOrange">
                          {obtenerPrecioTotalDelPedido(
                            pedido.contenidoDelPedido
                          )}
                        </b>
                      </p>
                      <div className="w-full flex flex-row justify-between items-center pr-2 mt-0.5">
                        <p className="text-lime-600 text-xl font-bold text-center">
                          {pedido.estadoDelPedido
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                            .toUpperCase()}
                        </p>
                      </div>
                      <button
                        onClick={() => confirmarPagoRecibido(pedido)}
                        className="w-full h-10 z-[100000000000] flex justify-center items-center flex-row gap-4 text-white font-medium bg-lime-600 shadow-md mt-3 rounded-xl active:scale-95 transition-all"
                      >
                        Pago recibido
                        <FaCheck size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {pedidosPagados.length == 0 && (
                <div className="w-full flex justify-center items-center flex-col gap-6 pt-20">
                  <PiEmptyBold size={80} className="text-customOrange" />
                  <p className="text-zinc-800 text-xl text-center px-8">
                    No hay pedidos pendientes de confirmacion de pago
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Fondotodo />
    </div>
  );
};

export default HomeMozo;
