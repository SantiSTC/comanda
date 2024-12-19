import NavBar from "../components/NavBar";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import Fondotodo from "../components/fondotodo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import QRReader from "../components/QRReader";
import { getCurrentUser } from "../services/auth";
import { guardar, modificar, traer } from "../services/firestore";
import QrReader from "modern-react-qr-reader";
import SwipeableItem from "../components/SwipeableItem";

// Iconos
import { BiSolidFoodMenu } from "react-icons/bi";
import { IoIosChatboxes } from "react-icons/io";
import { RiStarSFill } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";
import { FaGamepad, FaPlus } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import { PiSealQuestionFill } from "react-icons/pi";
import { FaMoneyBill1Wave, FaMoneyCheck } from "react-icons/fa6";

const HomeCliente = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [qrMesa, setQrMesa] = useState<string | null>(null);

  const [usuarios, setUsuarios] = useState<any[]>([]);

  const [personasEnMesaEstablecido, setPersonasEnMesaEstablecido] = useState(false);
  const [personasEnMesa, setPersonasEnMesa] = useState(0);

  // Estados del cliente
  const [estadoEnRestaurant, setEstadoEnRestaurant] = useState<string>("nulo");

  const [usuarioActual, setUsuarioActual] = useState<any>({});
  const [pedidoActual, setPedidoActual] = useState<any>({});

  // Estados cuando (estadoEnRestaurant == enMesa)
  const [pestaniaEnMesa, setPestaniaEnMesa] = useState("home");
  const [menu, setMenu] = useState<any[]>([]);
  const [comidas, setComidas] = useState<any[]>([]);
  const [bebidas, setBebidas] = useState<any[]>([]);
  const [pedidoAuxiliar, setPedidoAuxiliar] = useState<any[]>([]);
  const [precioTotal, setPrecioTotal] = useState("");
  const [tiempoDeElaboracionTotal, setTiempoDeElaboracionTotal] = useState(0);

  const [pedidos, setPedidos] = useState<any[]>([]);

  const [propina, setPropina] = useState(0);
  const [propinaPorcentaje, setPropinaPorcentaje] = useState("");

  // const bandera

  const leerQrMesa = (data: string) => {
    setQrMesa(data);
    return data;
  };

  const leerQrEntrada = (data: string) => {
    if (data == "enEspera") {
      setEstadoEnRestaurant(data);

      let currentUser = getCurrentUser();
      usuarios.map((item) => {
        if (item.email == currentUser?.email) {
          item.estadoEnRestaurant = data;
          modificar("usuarios", item);
        }
      });
    } else {
      Swal.fire({
        title: "No puedes hacer esto aun",
        text: "Debes escanear el QR de la entrada para comenzar",
        icon: "error",
        heightAuto: false,
        timer: 5000,
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#D94908",
      });
    }
  };

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

  useEffect(() => {
    traer("usuarios", "", (data) => {
      setUsuarios(data);
    });
    traer("menu", "", (data) => {
      setMenu(data);
      const comidas = data.filter((item) => item.tipo == "comida");
      const bebidas = data.filter((item) => item.tipo == "bebida");
      setComidas(comidas);
      setBebidas(bebidas);
    });
    traer("pedidos", "", (data) => {
      setPedidos(data);
    });
  }, []);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const usuario = usuarios.find((item) => item.email === currentUser.email);
      setUsuarioActual(usuario);
      if (usuario && (usuario.estadoEnRestaurant !== estadoEnRestaurant)) {
        // Solo actualiza si el estado local es diferente al de la base de datos
        setEstadoEnRestaurant(usuario.estadoEnRestaurant);
      }
    }
  }, [usuarios]); // Ejecuta cuando los datos de usuarios cambien

  const asignarCantidadDePersonas = () => {
    let currentUser = getCurrentUser();
    usuarios.map((item) => {
      if (item.email == currentUser?.email) {
        item.personasEnMesa = personasEnMesa;
        modificar("usuarios", item);
      }
    });
    setPersonasEnMesaEstablecido(true);
  };

  useEffect(() => {
    if (usuarioActual.mesaAsignada && qrMesa) {  
      alert("qrMesa" + qrMesa);
      alert("mesaAsignada" + usuarioActual.mesaAsignada)
      if (qrMesa === usuarioActual.mesaAsignada) {
        setQrMesa("");

        const updatedUser = {
          ...usuarioActual,
          estadoEnRestaurant: "enMesa",
        };

        modificar("usuarios", updatedUser).then(() => {
          Swal.fire({
            title: "Bienvenido a tu mesa",
            text: "Ahora podras acceder al menu, hacer consultas a los mozos, y mas",
            icon: "success",
            heightAuto: false,
            timer: 5000,
            confirmButtonText: "Entendido",
            confirmButtonColor: "#D94908",
          });
        });
      } else {
        Swal.fire({
          title: "Esa no es tu mesa",
          text: "Asegurate de escanear el QR de la mesa que te asignaron",
          icon: "error",
          heightAuto: false,
          timer: 5000,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#D94908",
        });
      }
    }
  }, [qrMesa, usuarioActual]);

  useEffect(() => {
    console.log(usuarioActual);
  }, []);

  const manejarScaneoQrEnMesa = (data: string | null) => {
    if (data) {
      if (data == usuarioActual.mesaAsignada) {
        setPestaniaEnMesa("menu");
      } else {
        Swal.fire({
          title: "Ese no es el QR de tu mesa",
          text: "Debes escanear el QR de tu mesa",
          icon: "error",
          heightAuto: false,
          timer: 5000,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#D94908",
        });
      }
    }
  };

  const agregarAlPedidoAuxiliar = (plato: any) => {
    setPedidoAuxiliar((prevPedidoAuxiliar) => [...prevPedidoAuxiliar, plato]);
  };

  const obtenerPrecioTotalDelPedido = (pedido: any) => {
    return pedido.reduce(
      (suma: number, plato: any) => suma + parseFloat(plato.precio),
      0
    );
  };

  const obtenerMayorTiempoElaboracion = (): number => {
    return pedidoAuxiliar.reduce((mayor, plato) => {
      const tiempoActual = parseInt(plato.tiempoElaboracion, 10);
      return tiempoActual > mayor ? tiempoActual : mayor;
    }, 0);
  };

  useEffect(() => {
    setPrecioTotal(obtenerPrecioTotalDelPedido(pedidoAuxiliar));
    setTiempoDeElaboracionTotal(obtenerMayorTiempoElaboracion());
  }, [pedidoAuxiliar]);

  const handleSwipe = (id: number) => {
    setPedidoAuxiliar((prevArray) =>
      prevArray.filter((item) => item.id !== id)
    );
  };

  const requiereCocina = (pedidos: any[]): boolean => {
    return pedidos.some((item) => item.tipo === "comida");
  };

  const requiereBar = (pedidos: any[]) => {
    return pedidos.some((item) => item.tipo === "bebida");
  };

  const enviarPedido = () => {
    let objPedido = {
      contenidoDelPedido: pedidoAuxiliar,
      emailUsuario: usuarioActual.email,
      mesaUsuario: usuarioActual.mesaAsignada,
      estadoDelPedido: "pendienteDeAprobacionDeMozo",
      time: Date.now(),
      comidaLista: !requiereCocina(pedidoAuxiliar),
      bebidaLista: !requiereBar(pedidoAuxiliar),
      encuestaRealizada: false,
    };

    guardar("pedidos", objPedido).then(() => {
        // usuarioActual.pedidos.push(objPedido);
        // usuarioActual.estadoEnRestaurant = "esperandoComida";

        usuarioActual.estadoEnRestaurant = "esperandoComida"
        usuarioActual.pedidos.push(objPedido);

        modificar("usuarios", usuarioActual).then(() => {
          Swal.fire({
            title: "Todo listo",
            text: "Pedido enviado con exito",
            icon: "success",
            heightAuto: false,
            timer: 3000,
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#D94908",
          }).then(() => {
            setPestaniaEnMesa("home");
          });
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Parece que hubo un error...",
          text: err,
          icon: "error",
          heightAuto: false,
          timer: 5000,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#D94908",
        });
      });
  };

  const manejarScaneoQrEstadoPedido = (data: string | null) => {
    if (data) {
      if (data == usuarioActual.mesaAsignada) {
        setPedidoActual(
          pedidos.find((item) => item.emailUsuario === usuarioActual.email)
        );
        setPestaniaEnMesa("verEstado");
      } else {
        Swal.fire({
          title: "Ese no es el QR de tu mesa",
          text: "Debes escanear el QR de tu mesa para ver el menu",
          icon: "error",
          heightAuto: false,
          timer: 5000,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#D94908",
        });
      }
    }
  };

  useEffect(() => {
    if (usuarioActual) {
      setPedidoActual(
        pedidos.find((item) => item.emailUsuario === usuarioActual.email)
      );

      if (usuarioActual.pedidos && pedidoActual) {
        usuarioActual.pedidos.map((pedido: any) => {
          if ((pedido.time == pedidoActual.time)) {
            pedido.estadoDelPedido = pedidoActual.estadoDelPedido;
            modificar("usuarios", usuarioActual);
          }
        });
      }

      if (pedidoActual) {
        if (pedidoActual.estadoDelPedido == "pedidoFinalizado") {
          Swal.fire({
            title: "Pago recibido",
            text: "Muchas gracias por venir. Te esperamos pronto de vuelta.",
            icon: "success",
            heightAuto: false,
            timer: 9000,
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#D94908",
          }).then(() => {
            usuarioActual.mesaAsignada = "";
            usuarioActual.personasEnMesa = 0;
            usuarioActual.estadoEnRestaurant = "nulo";

            // setPedidoActual({});

            modificar("usuarios", usuarioActual).then(() => {
              window.location.href = "/homecliente";
            });
          });
        } else if(pedidoActual == "pedidoEsperandoCocinaBar") {
          usuarioActual.estadoEnRestaurant = "esperandoComida";
          modificar("usuarios", usuarioActual);
        }
      }
    }
  }, [pedidos]);

  const marcarPedidoComoEntregado = () => {
    pedidoActual.estadoDelPedido = "pedidoEntregado";
    modificar("pedidos", pedidoActual).then(() => {
      usuarioActual.estadoEnRestaurant = "comidaEntregada";
      modificar("usuarios", usuarioActual).then(() => {
        setEstadoEnRestaurant("comidaEntregada");
      });
    });
  };

  const marcarEncuestaHecha = () => {
    pedidoActual.encuestaRealizada = true;

    modificar("pedidos", pedidoActual).then(() => {
      window.location.href = "/encuestas/" + usuarioActual.email;
    });
  };

  const pedirLaCuenta = () => {
    pedidoActual.estadoDelPedido = "cuentaPedida";
    modificar("pedidos", pedidoActual).then(() => {
      setPestaniaEnMesa("pagando");
    });
  };

  const marcarComoPagado = (metodo: string, monto?: number) => {
    if (metodo == "efectivo-debito") {
      pedidoActual.estadoDelPedido = "pagado";
      modificar("pedidos", pedidoActual).then(() => {
        usuarioActual.estadoEnRestaurant = "pedidoPagado";
        modificar("usuarios", usuarioActual).then(() => {
          Swal.fire({
            title: "Pago enviado",
            text: "Espera a que un mozo confirme la recepción del pago",
            icon: "success",
            heightAuto: false,
            timer: 3000,
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#D94908",
          });
        });
      });
    } else {
      // INTEGRAR MP ACA -----------------------------------------------------------------------------------------------------------------------
    }
  };

  const manejarScaneoQrPropina = (data: string | null) => {
    if (data) {
      if (data.split("-")[0] == "propina") {
        setPropinaPorcentaje(data.split("-")[1]);
        setPropina(
          (obtenerPrecioTotalDelPedido(pedidoActual.contenidoDelPedido) / 100) *
            parseInt(data.split("-")[1])
        );
      } else {
        Swal.fire({
          title: "Ese no es un QR de propina",
          text: "Asegurate de escanear los QRs de propina",
          icon: "error",
          heightAuto: false,
          timer: 5000,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#D94908",
        });
      }
    }
  };

  useEffect(() => {
    if (pedidoActual) {
      if (pedidoActual.estadoDelPedido == "cuentaPedida") {
        setPestaniaEnMesa("pagando");
      }
    }
  }, []);

  return (
    <div>
      {estadoEnRestaurant != "nulo" && (
        <div>
          {estadoEnRestaurant == "pedidoPagado" && (
            <div>
              {/* ESPERA MIENTRAS EL MOZO CONFIRMA EL PEDIDO */}
            </div>
          )}
          {(estadoEnRestaurant == "esperandoComida" ||
            estadoEnRestaurant == "comidaEntregada") && (
            <div className="min-h-screen w-full bg-slate-50 flex flex-col pb-[76px] overflow-y-auto">
              <NavBar onStateChange={setMenuAbierto} rol={estadoEnRestaurant} />
              {/* Menu desplegable */}
              <SideBarMenuDuenio menuAbierto={menuAbierto} />
              {/* Contenido del Panel de Control */}
              <div className="h-full w-full flex-1 flex flex-col z-10 px-6 pb-20">
                <p
                  onClick={() => alert(pedidoActual.estadoDelPedido)}
                  className="text-4xl font-bold text-zinc-700 text-end mb-2 mt-9"
                >
                  Mesa{" "}
                  <b className="text-customOrange">
                    #{usuarioActual.mesaAsignada}
                  </b>
                </p>
                <p className="text-xl font-medium italic text-zinc-700 text-end">
                  {usuarioActual.nombre}
                </p>
                {pestaniaEnMesa == "home" && (
                  <div>
                    <p
                      onClick={() => alert("ppppp: " + pedidoActual.estadoDelPedido)}
                      className="text-base font-light text-center text-zinc-700 mt-4"
                    >
                      Escaneá el QR para ver el estado de tu pedido
                    </p>
                    <div className="w-full">
                      <div className="flex flex-col justify-center gap-3 mt-4">
                        <QrReader
                          delay={500}
                          onScan={manejarScaneoQrEstadoPedido}
                          facingMode="environment"
                          style={{ width: "100%" }}
                        />
                        <div className="w-full flex flex-row gap-4 items-center justify-center bg-white border border-zinc-200 py-2 rounded-xl active:shadow-xl active:border-none transition-all">
                          <IoIosChatboxes
                            className="text-customOrange drop-shadow-sm"
                            size={35}
                          />
                          <p className="text-zinc-800 text-xl font-medium">
                            Consultar al mozo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {pestaniaEnMesa == "verEstado" && (
                  <div className="h-screen w-screen absolute z-[50] top-0 left-0 flex justify-center items-center bg-white/10 backdrop-blur-md">
                    <div className="w-[90%] p-6 flex flex-col rounded-xl shadow-sm items-center bg-white">
                      {pedidoActual.estadoDelPedido ==
                        "pendienteDeAprobacionDeMozo" && (
                        <p className="text-zinc-800 text-2xl font-semibold">
                          El pedido está{" "}
                          <b className="font-semibold text-customOrange">
                            esperando la aprobacion de los mozos
                          </b>
                        </p>
                      )}
                      {pedidoActual.estadoDelPedido ==
                        "pedidoEsperandoCocinaBar" && (
                        <p className="text-zinc-800 text-3xl font-semibold text-center">
                          Tu pedido está{" "}
                          <b className="font-semibold text-customOrange">
                            en el horno
                          </b>
                        </p>
                      )}
                      {/* pedidoListoParaEntregar */}
                      {pedidoActual.estadoDelPedido ==
                        "pedidoListoParaEntregar" && (
                        <p className="text-zinc-800 text-3xl font-semibold text-center">
                          Tu pedido está{" "}
                          <b className="font-semibold text-customOrange">
                            listo y a punto de serte entregado
                          </b>
                        </p>
                      )}
                      {pedidoActual.estadoDelPedido == "pedidoEntregado" && (
                        <p className="text-zinc-800 text-3xl font-semibold text-center">
                          <b className="font-semibold text-customOrange drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                            Ya tenés tu pedido
                          </b>
                        </p>
                      )}
                      {pedidoActual.estadoDelPedido != "pendienteDeAprobacionDeMozo" && (
                        <div>
                          {(estadoEnRestaurant != "comidaEntregada" && pedidoActual.estadoDelPedido != "pedidoEntregado" && pedidoActual.estadoDelPedido != "pedidoEsperandoCocinaBar") && (
                              <div
                                onClick={marcarPedidoComoEntregado}
                                className={`w-full flex flex-col items-center bg-white border border-customOrange mt-6 py-8 rounded-xl active:border-2 active:scale-95 transition-all bg-cover bg-center bg-[url(https://img.freepik.com/foto-gratis/vista-superior-mesa-llena-comida_23-2149209253.jpg?t=st=1734120404~exp=1734124004~hmac=4cd5e8751c04cab55184d29721248997c5851aeaf53893d8f4bfaba1240872b6&w=740)]`}
                              >
                                <p className="text-white font-semibold text-3xl drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]">
                                  Mi pedido llegó
                                </p>
                              </div>
                            )}
                          {pedidoActual.estadoDelPedido ==
                            "pedidoEntregado" && (
                            <div
                              onClick={pedirLaCuenta}
                              className={`w-full bg-gradient-to-br from-lime-500 to-lime-600 flex flex-row gap-4 shadow-md items-center justify-center mt-6 py-8 rounded-xl active:scale-95 transition-all`}
                            >
                              <p className="text-white font-semibold text-3xl">
                                Pedir la cuenta
                              </p>
                              <FaMoneyBill1Wave
                                size={47}
                                className="text-white"
                              />
                            </div>
                          )}
                          {pedidoActual.estadoDelPedido == "cuentaPedida" && (
                            <div className="h-screen w-screen absolute z-[50] top-0 left-0 flex justify-center items-center bg-white/10 backdrop-blur-md">
                              <div className="w-[90%] max-h-[65vh] overflow-y-auto flex flex-col items-center gap-2 bg-white p-6 shadow-md rounded-xl">
                                <p className="text-3xl font-bold text-customOrange">
                                  Pagar
                                </p>
                                <p className="text-zinc-800 text-center mb-2">
                                  Escaneá el QR que corresponda a la propina que
                                  quieras agregar (10% - 20% - 30%)
                                </p>
                                <QrReader
                                  delay={500} // Intervalo en milisegundos entre intentos de escaneo
                                  onScan={manejarScaneoQrPropina} // Callback para manejar los datos escaneados
                                  facingMode="environment" // Usar la cámara trasera
                                  style={{ width: "100%" }}
                                />
                                <p
                                  onClick={() => alert(propina)}
                                  className="text-2xl font-bold mt-4 text-zinc-800 text-start w-full"
                                >
                                  Detalles del pedido
                                </p>
                                <div className="h-px w-full bg-zinc-400 -mt-1"></div>
                                <div className="w-full flex -mt-1 flex-col gap-1 px-1 pt-1.5">
                                  {pedidoActual.contenidoDelPedido.map(
                                    (item: any) => (
                                      <div className="w-full flex flex-row justify-between items-center">
                                        <p className="text-zinc-800 text-lg">
                                          {item.plato.replace("-", " ")}
                                        </p>
                                        <p className="text-customOrange text-lg font-bold">
                                          ${item.precio}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                                <div className="h-px w-full bg-zinc-400 -mt-1"></div>
                                <div className="w-full flex justify-between items-center">
                                  <p className="text-zinc-800 text-lg">
                                    Propina:
                                  </p>
                                  <p className="text-customOrange text-lg font-bold">
                                    ${propina} - ({propinaPorcentaje}%)
                                  </p>
                                </div>
                                <div className="h-px w-full bg-zinc-400 -mt-1"></div>
                                <div className="w-full flex justify-between items-center">
                                  <p className="text-zinc-800 text-2xl">
                                    Total:
                                  </p>
                                  <p className="text-customOrange text-3xl font-bold underline decoration-black">
                                    $
                                    {obtenerPrecioTotalDelPedido(
                                      pedidoActual.contenidoDelPedido
                                    ) + propina}
                                  </p>
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                  <button
                                    onClick={() =>
                                      marcarComoPagado(
                                        "efectivo-debito",
                                        obtenerPrecioTotalDelPedido(
                                          pedidoActual.contenidoDelPedido
                                        ) + propina
                                      )
                                    }
                                    className="h-12 w-full flex flex-row items-center justify-center gap-3 rounded-xl bg-fondoBoton text-white text-lg font-semibold"
                                  >
                                    <p>Pagar efectivo/debito</p>
                                    <FaMoneyCheck
                                      size={32}
                                      className="text-white"
                                    />
                                  </button>
                                  <button className="h-12 w-full flex flex-row items-center justify-center gap-2 rounded-xl bg-azulMp text-white text-lg font-semibold">
                                    <p>Pagar con Mercado Pago</p>
                                    <img
                                      src="/mp.png"
                                      alt=""
                                      className="h-8 w-auto"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          {pedidoActual.estadoDelPedido == "pagado" && (
                            <p className="text-customOrange font-semibold text-3xl text-center">
                              Espera un momento mientras un mozo confirma la
                              recepción de tu pago...
                            </p>
                          )}
                          {pedidoActual.estadoDelPedido != "cuentaPedida" &&
                            pedidoActual.estadoDelPedido != "pagado" && (
                              <p className="italic font-light text-center text-zinc-800 mt-7">
                                Mientras tanto podes acceder a estas otras
                                opciones:
                              </p>
                            )}
                          <div className="flex flex-row w-full justify-center items-center gap-3 mt-4 z-[101]">
                            {!pedidoActual.encuestaRealizada && (
                              <div
                                onClick={marcarEncuestaHecha}
                                className="group py-8 w-full flex flex-col gap-2 justify-center items-center bg-fondoBoton rounded-xl active:scale-95 transition-all"
                              >
                                <PiSealQuestionFill
                                  size={55}
                                  className="text-white "
                                />
                                <p className="text-white text-lg font-medium text-center">
                                  Encuestas
                                </p>
                              </div>
                            )}
                            {pedidoActual.estadoDelPedido != "cuentaPedida" &&
                              pedidoActual.estadoDelPedido != "pagado" && (
                                <div className="group py-8 w-full flex flex-col gap-2 justify-center items-center bg-fondoBoton rounded-xl active:scale-95 transition-all">
                                  <FaGamepad
                                    size={55}
                                    className="text-white "
                                  />
                                  <p className="text-white text-lg font-medium text-center">
                                    Juegos
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {pestaniaEnMesa != "home" && (
                  <div
                    onClick={() => setPestaniaEnMesa("home")}
                    className="group bg-zinc-800 active:bg-white flex flex-row items-center gap-2 py-2 px-3 rounded-xl absolute left-6 bottom-4 transition-all z-50"
                  >
                    <AiFillHome
                      className="text-white group-active:text-customOrange transition-all"
                      size={30}
                    />
                    <p className="text-xl font-semibold text-white group-active:text-customOrange transition-all">
                      Volver
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {estadoEnRestaurant == "enMesa" && (
            <div className="min-h-screen w-full bg-slate-50 flex flex-col pb-[76px] overflow-y-auto">
              <NavBar onStateChange={setMenuAbierto} rol={estadoEnRestaurant} />
              {/* Menu desplegable */}
              <SideBarMenuDuenio menuAbierto={menuAbierto} />
              {/* Contenido del Panel de Control */}
              <div className="h-full w-full flex-1 flex flex-col z-10 px-6 pb-20">
                <p className="text-4xl font-bold text-zinc-700 text-end mb-2 mt-9">
                  Mesa{" "}
                  <b className="text-customOrange">
                    #{usuarioActual.mesaAsignada}
                  </b>
                </p>
                <p className="text-xl font-medium italic text-zinc-700 text-end">
                  {usuarioActual.nombre}
                </p>
                {pestaniaEnMesa == "home" && (
                  <div>
                    <p className="text-base font-light text-center text-zinc-700 mt-4">
                      Escaneá nuevamente el QR para acceder al menú
                    </p>
                    <div className="w-full">
                      <div className="flex flex-col justify-center gap-3 mt-4">
                        <QrReader
                          delay={500} // Intervalo en milisegundos entre intentos de escaneo
                          onScan={manejarScaneoQrEnMesa} // Callback para manejar los datos escaneados
                          facingMode="environment" // Usar la cámara trasera
                          style={{ width: "100%" }}
                        />
                        <div className="w-full flex flex-row gap-4 items-center justify-center bg-white border border-zinc-200 py-2 rounded-xl active:shadow-xl active:border-none transition-all">
                          <IoIosChatboxes
                            className="text-customOrange drop-shadow-sm"
                            size={35}
                          />
                          <p className="text-zinc-800 text-xl font-medium">
                            Consultar al mozo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {pestaniaEnMesa == "menu" && (
                  <div>
                    <div className="relative max-h-[50vh] overflow-y-auto">
                      <p className="text-base font-light text-center text-zinc-700 mt-4">
                        Selecciona lo que mas te guste del menu para agregarlo a
                        tu pedido
                      </p>
                      <div className="flex flex-col justify-center gap-3 mt-4">
                        <p className="text-zinc-600 font-light text-center">
                          ----- Comidas -----
                        </p>
                        {comidas.map((plato) => (
                          <div className="w-full flex flex-col justify-center p-5 rounded-xl bg-white border border-zinc-200">
                            <div className="w-full flex flex-row gap-1.5 justify-center items-center">
                              <img
                                className="w-full h-10 rounded-md object-cover"
                                src="/platos/pizza.jpg"
                                alt=""
                              />
                              <img
                                className="w-full h-10 rounded-md object-cover"
                                src="/platos/pizza.jpg"
                                alt=""
                              />
                              <img
                                className="w-full h-10 rounded-md object-cover"
                                src="/platos/pizza.jpg"
                                alt=""
                              />
                            </div>
                            <p className="text-xl text-zinc-700 font-medium mt-2">
                              {plato.plato.replace("-", " ")}
                            </p>
                            <p className=" text-zinc-700 font-light">
                              {plato.desc}
                            </p>
                            <p className=" text-zinc-600">
                              Tiempo de elaboracion:{" "}
                              <b className="text-customOrange">
                                {plato.tiempoElaboracion}
                              </b>{" "}
                              minutos
                            </p>
                            <p className="text-zinc-700 text-xl font-medium mt-1">
                              Precio:{" "}
                              <b className="text-customOrange text-2xl font-bold">
                                ${plato.precio}
                              </b>
                            </p>
                            <div
                              onClick={() => agregarAlPedidoAuxiliar(plato)}
                              className="w-full flex flex-row gap-2 items-center justify-center px-3 py-1.5 mt-3 rounded-xl bg-fondoBoton active:scale-90 transition-all"
                            >
                              <FaPlus size={20} className="text-white" />
                              <p className="text-xl font-bold text-white">
                                Agregar al pedido
                              </p>
                            </div>
                          </div>
                        ))}
                        <p className="text-zinc-600 font-light text-center">
                          ----- Bebidas -----
                        </p>
                        {bebidas.map((plato) => (
                          <div className="w-full flex flex-col justify-center p-5 rounded-xl bg-white border border-zinc-200">
                            <div className="w-full flex flex-row gap-1.5 justify-center items-center">
                              <img
                                className="w-full h-10 rounded-md object-cover"
                                src="/bebidas/cerveza.jpeg"
                                alt=""
                              />
                              <img
                                className="w-full h-10 rounded-md object-cover"
                                src="/bebidas/cerveza.jpeg"
                                alt=""
                              />
                              <img
                                className="w-full h-10 rounded-md object-cover"
                                src="/bebidas/cerveza.jpeg"
                                alt=""
                              />
                            </div>
                            <p className="text-xl text-zinc-700 font-medium mt-2">
                              {plato.plato.replace("-", " ")}
                            </p>
                            <p className=" text-zinc-700 font-light">
                              {plato.desc}
                            </p>
                            <p className=" text-zinc-600">
                              Tiempo de elaboracion:{" "}
                              <b className="text-customOrange">
                                {plato.tiempoElaboracion}
                              </b>{" "}
                              minutos
                            </p>
                            <p className="text-zinc-700 text-xl font-medium mt-1">
                              Precio:{" "}
                              <b className="text-customOrange text-2xl font-bold">
                                ${plato.precio}
                              </b>
                            </p>
                            <div
                              onClick={() => agregarAlPedidoAuxiliar(plato)}
                              className="w-full flex flex-row gap-2 items-center justify-center px-3 py-1.5 mt-3 rounded-xl bg-fondoBoton active:scale-90 transition-all"
                            >
                              <FaPlus size={20} className="text-white" />
                              <p className="text-xl font-bold text-white">
                                Agregar al pedido
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-2 mt-4 bg-white py-2 px-3 rounded-lg shadow-sm">
                      <div className="flex flex-row items-center justify-between">
                        <p className="text-zinc-800 text-2xl font-bold">
                          Total:{" "}
                        </p>
                        <p className="text-customOrange text-3xl font-bold">
                          ${precioTotal}
                        </p>
                      </div>
                      <p
                        onClick={() => setPestaniaEnMesa("verPedido")}
                        className="text-zinc-800 text-center text-lg underline decoration-customOrange active:text-customOrange active:scale-95 transition-all"
                      >
                        Ver el pedido
                      </p>
                    </div>
                  </div>
                )}
                {pestaniaEnMesa == "verPedido" && (
                  <div>
                    <div className="relative max-h-[60vh] overflow-y-auto rounded-lg flex items-center flex-col">
                      <p
                        onClick={() => console.log(pedidoAuxiliar)}
                        className="text-base font-light text-center text-zinc-700 mt-4"
                      >
                        Revisa tu pedido y confirmalo para enviarlo a cocina
                      </p>
                      <p
                        onClick={() => alert(tiempoDeElaboracionTotal)}
                        className="text-xs font-light text-end w-full text-red-600 mt-2"
                      >
                        (Desliza un plato hacia la izquierda para eliminarlo)
                      </p>
                      <div className="bg-white rounded-xl w-full flex flex-col items-center mt-3 py-4">
                        <div className="w-full flex flex-row justify-between items-center px-6">
                          <p className="text-zinc-800 text-lg">Plato</p>
                          <p className="text-zinc-800 text-lg">Precio</p>
                        </div>
                        <div className="h-px w-[90%] bg-customOrange"></div>
                        <div className="w-full flex flex-col justify-center gap-2 mt-4">
                          {pedidoAuxiliar.map((itemDelPedido) => (
                            <div>
                              <SwipeableItem
                                item={itemDelPedido}
                                onSwipe={handleSwipe}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-2 mt-4 bg-white py-3 px-6 rounded-lg shadow-sm">
                        <div className="flex flex-row items-center justify-between">
                          <p className="text-zinc-800 text-lg font-medium">
                            Tiempo de elaboración:{" "}
                          </p>
                          <p className="text-zinc-800 text-xl font-medium">
                            <b className="font-medium text-customOrange">
                              {tiempoDeElaboracionTotal}
                            </b>{" "}
                            minutos
                          </p>
                        </div>
                        <div className="h-px w-full bg-zinc-800"></div>
                        <div className="flex flex-row items-center justify-between">
                          <p className="text-zinc-800 text-2xl font-bold">
                            Precio total:{" "}
                          </p>
                          <p className="text-customOrange text-3xl font-bold">
                            ${precioTotal}
                          </p>
                        </div>
                        {pedidoAuxiliar.length > 0 && (
                          <button
                            onClick={enviarPedido}
                            className="bg-fondoBoton rounded-xl h-10 text-white font-medium text-lg active:scale-95 transition-all"
                          >
                            Enviar pedido
                          </button>
                        )}
                        {pedidoAuxiliar.length == 0 && (
                          <button className="bg-zinc-600 rounded-xl h-10 text-white font-medium text-lg">
                            Agrega platos a tu pedido
                          </button>
                        )}
                      </div>
                    </div>
                    <div
                      onClick={() => setPestaniaEnMesa("menu")}
                      className="group bg-zinc-800 active:bg-white flex flex-row items-center gap-2 py-2 px-3 rounded-xl absolute left-6 bottom-4 transition-all z-50"
                    >
                      <MdMenuBook
                        className="text-white group-active:text-customOrange transition-all"
                        size={30}
                      />
                      <p className="text-xl font-semibold text-white group-active:text-customOrange transition-all">
                        Volver al menú
                      </p>
                    </div>
                  </div>
                )}
                {pestaniaEnMesa != "home" && pestaniaEnMesa != "verPedido" && (
                  <div
                    onClick={() => setPestaniaEnMesa("home")}
                    className="group bg-zinc-800 active:bg-white flex flex-row items-center gap-2 py-2 px-3 rounded-xl absolute left-6 bottom-4 transition-all z-50"
                  >
                    <AiFillHome
                      className="text-white group-active:text-customOrange transition-all"
                      size={30}
                    />
                    <p className="text-xl font-semibold text-white group-active:text-customOrange transition-all">
                      Volver
                    </p>
                  </div>
                )}
              </div>
              <Fondotodo />
            </div>
          )}
          {estadoEnRestaurant == "mesaAsignada" && (
            <div className="min-h-screen w-full bg-slate-50 flex flex-col pb-[76px] overflow-y-auto">
              <QRReader
                onScanSuccess={leerQrMesa}
                text={`Mesa #${usuarioActual.mesaAsignada}`}
                verOpiniones={false}
                subtext="Dirigite hacia tu mesa y escanea el QR de la misma para comenzar."
              />
            </div>
          )}
          {estadoEnRestaurant == "enEspera" && (
            <div className="min-h-screen w-full bg-slate-50 flex flex-col pb-[76px] overflow-y-auto relative">
              {!personasEnMesaEstablecido && (
                <div className="h-screen w-full absolute flex justify-center items-center z-50 bg-white/20 backdrop-blur-md">
                  <div className="h-auto w-[90%] rounded-lg bg-white flex flex-col items-center gap-4 p-6 z-50">
                    <p className="text-zinc-800 text-2xl font-semibold text-center">
                      ¿Cuántas personas van a ser?
                    </p>
                    <input
                      value={personasEnMesa}
                      onChange={(event) =>
                        setPersonasEnMesa(parseInt(event.target.value))
                      }
                      type="number"
                      className="w-full h-9 rounded-md bg-transparent border border-zinc-200 text-black"
                    />
                    <button
                      onClick={asignarCantidadDePersonas}
                      className="w-full h-9 rounded-md bg-fondoBoton font-semibold"
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              )}
              <NavBar onStateChange={setMenuAbierto} rol={""} />
              {/* Menu desplegable */}
              <SideBarMenuDuenio menuAbierto={menuAbierto} />
              {/* Contenido del Panel de Control */}
              <div className="h-full w-full flex-1 flex flex-col items-center z-10 px-6 pb-8">
                <p className="text-3xl font-bold text-zinc-700 text-center mt-5">
                  Espera a que el{" "}
                  <b className="italic text-customOrange">Maitre</b> te asigne
                  una mesa
                </p>
                <iframe
                  src="https://giphy.com/embed/QBd2kLB5qDmysEXre9"
                  width="480"
                  height="288"
                  frameBorder="0"
                  className="giphy-embed scale-75"
                  allowFullScreen
                ></iframe>
                <p className="text-lg font-medium text-zinc-700 text-center">
                  Mientras tanto, puedes revisar las opiniones de antiguos
                  clientes
                </p>
                <div className="group h-auto w-full bg-white border border-zinc-100 flex flex-col items-center justify-center gap-1 py-4 mb-4 mt-3 shadow-xl rounded-3xl active:border-zinc-300 active:bg-fondoBoton transition-all duration-100">
                  <RiStarSFill
                    className="text-customOrange drop-shadow-sm group-active:text-white transition-all duration-100"
                    size={59}
                  />
                  <p className="drop-shadow-md text-xl text-zinc-800 group-active:text-white transition-all duration-100">
                    Ver opiniones
                  </p>
                </div>
                <p className="text-3xl font-bold text-zinc-700 text-center mt-3">
                  Gracias por tu paciencia
                </p>
              </div>
              <Fondotodo />
            </div>
          )}
        </div>
      )}
      {estadoEnRestaurant == "nulo" && (
        <div>
          {usuarioActual && (
            <div>
              {usuarioActual.estado == "aceptado" && (
                <div>
                  <QRReader
                    onScanSuccess={leerQrEntrada}
                    text={"Escanea el QR de la entrada para comenzar"}
                  />
                </div>
              )}
              {usuarioActual.estado == "pendiente" && (
                <div className="h-screen w-full bg-slate-50 flex flex-col z-30">
                  <NavBar rol={""} />
                  <div className="flex w-full h-full flex-col items-center justify-center">
                    <img
                      src="/pendiente.gif"
                      alt=""
                      className="w-40 h-auto -translate-y-20"
                    />
                    <div className="-translate-y-16 flex flex-col gap-4 text-center px-8">
                      <p className="text-2xl font-semibold text-zinc-800">
                        Tu cuenta esta{" "}
                        <b className="font-semibold text-customOrange">
                          pendiente de autorizacion
                        </b>
                      </p>
                      <p className="text-xl text-zinc-800">
                        Tranquilo{" "}
                        <b className="font-normal text-customOrange">
                          {usuarioActual.nombre.split(" ")[0]}
                        </b>
                        . Te avisaremos cuando este lista
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {usuarioActual.estado == "rechazado" && (
                <div className="h-screen w-full bg-slate-50 flex flex-col z-30">
                  <NavBar rol={""} />
                  <div className="flex w-full h-full flex-col items-center justify-center">
                    <img
                      src="/rechazado.gif"
                      alt=""
                      className="w-40 h-auto -translate-y-20"
                    />
                    <div className="-translate-y-16 flex flex-col gap-4 text-center px-8">
                      <p className="text-2xl font-semibold text-zinc-800">
                        Tu cuenta fue{" "}
                        <b className="font-semibold text-customOrange">
                          rechazada
                        </b>
                      </p>
                      <p className="text-xl text-zinc-800">
                        Lo sentimos{" "}
                        <b className="font-normal text-customOrange">
                          {usuarioActual.nombre.split(" ")[0]}
                        </b>
                        . Comunicate con el restaurant si crees que esto es
                        injusto.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeCliente;
