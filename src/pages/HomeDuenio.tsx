import { useEffect, useState } from "react";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import NavBar from "../components/NavBar";
import Fondotodo from "../components/fondotodo";
import { guardar, modificar, traer } from "../services/firestore";

// Iconos
import { IoStatsChart } from "react-icons/io5";
import { FaBookBookmark, FaCheck } from "react-icons/fa6";
import { FaPlus, FaUsers, FaUsersSlash } from "react-icons/fa";
import { MdTableBar, MdDeliveryDining } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import Swal from "sweetalert2";

const HomeDuenio = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pestania, setPestania] = useState("home");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuariosPendientes, setUsuariosPendientes] = useState<any[]>([]);
  const [verSoloPendientes, setVerSoloPendientes] = useState(true);
  const [mesas, setMesas] = useState<any[]>([]);

  const [agregandoMesa, setAgregandoMesa] = useState(false);
  const [numeroDeMesaAAgregar, setNumeroDeMesaAAgregar] = useState("");
  const [capacidadDeMesaAAgregar, setCapacidadDeMesaAAgregar] = useState(0);

  useEffect(() => {
    traer("mesas", "", (data) => {
      setMesas(data);
    });
  }, []);

  const botones = [
    {
      icon: (
        <FaBookBookmark
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Reservas",
      pestania: "reservas",
    },
    {
      icon: (
        <FaUsers
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Usuarios",
      pestania: "usuarios",
    },
    {
      icon: (
        <MdTableBar
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Mesas",
      pestania: "mesas",
    },
    {
      icon: (
        <MdDeliveryDining
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Delivery",
      pestania: "delivery",
    },
    {
      icon: (
        <IoStatsChart
          className="text-customOrange drop-shadow-md group-active:text-white transition-all duration-100"
          size={60}
        />
      ),
      text: "Reportes",
      pestania: "reportes",
    },
  ];

  useEffect(() => {
    traer("usuarios", "", (data) => {
      setUsuarios(data);
      const usuariosFiltrados = data.filter(
        (item) => item.estado == "pendiente"
      );
      setUsuariosPendientes(usuariosFiltrados); // Actualiza el estado una sola vez
    });
  }, []);

  const manejarEstadoUsuario = (user: any, estadoAAsignar: string) => {
    user.estado = estadoAAsignar;
    modificar("usuarios", user).then(() => {
      console.log("Estado modificado con exito");
    });
  };

  const agregarMesa = () => {
    let objMesa = {
      capacidad: capacidadDeMesaAAgregar,
      estado: "libre",
      numeroDeMesa: numeroDeMesaAAgregar,
      comenzal: "",
    };

    guardar("mesas", objMesa).then(() => {
      setAgregandoMesa(false);
      setNumeroDeMesaAAgregar("");
      setCapacidadDeMesaAAgregar(0);

      Swal.fire({
        title: "Perfecto",
        text: "Mesa agregada con exito",
        icon: "success",
        heightAuto: false,
        timer: 5000,
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#D94908",
      });
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      <NavBar onStateChange={setMenuAbierto} rol={"Dueño"} />
      {/* Menu desplegable */}
      <SideBarMenuDuenio menuAbierto={menuAbierto} />
      {/* Contenido del Panel de Control */}
      {pestania == "home" && (
        <div className="h-full w-full flex-1 flex flex-col z-10">
          <p className="text-4xl font-extrabold text-zinc-700 text-start px-6 mb-8 mt-9">
            Panel de Control
          </p>
          <div className="grid grid-cols-2 h-auto items-center px-6 gap-4 mt-1 overflow-y-auto">
            {botones.map((item) => (
              <div
                key={item.text}
                onClick={() => setPestania(item.pestania)}
                className="group h-auto w-full bg-white border border-zinc-200 flex flex-col items-center justify-center gap-2 py-6 rounded-3xl active:border-zinc-300 active:bg-fondoBoton transition-all duration-100"
              >
                {item.icon}
                <p className="drop-shadow-md text-xl text-zinc-800 group-active:text-white transition-all duration-100">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {pestania == "usuarios" && (
        <div className="h-full w-full flex-1 flex flex-col z-10 px-6">
          <p className="text-4xl font-extrabold text-zinc-700 text-start mb-4 mt-9">
            Usuarios
          </p>
          <div className="w-full flex flex-row gap-1 justify-center items-center mb-4">
            <div
              onClick={() => setVerSoloPendientes(false)}
              className={`px-2.5 py-1 rounded-xl ${
                !verSoloPendientes ? "bg-fondoBoton text-white" : "text-black"
              }`}
            >
              <p className="">Todos</p>
            </div>
            <p className="text-black">|</p>
            <div
              onClick={() => setVerSoloPendientes(true)}
              className={`px-2.5 py-1 rounded-xl ${
                verSoloPendientes ? "bg-fondoBoton text-white" : "text-black"
              }`}
            >
              <p className="">Pendientes</p>
            </div>
          </div>
          {verSoloPendientes && (
            <div>
              <p className="text-lg text-zinc-700 text-start">
                Revisa las cuentas pendientes de <br />
                aprobacion
              </p>
              {usuariosPendientes.length > 0 && (
                <div className="mt-7 w-full flex flex-col items-center gap-2 flex-1 mb-40 overflow-y-auto">
                  {usuariosPendientes.map((user) => (
                    <div className="w-full rounded-xl bg-white border border-zinc-100 px-4 py-3">
                      <p className="text-black text-xl font-medium">
                        {user.nombre}
                      </p>
                      <p className="text-black font-light italic">
                        {user.email}
                      </p>
                      <p className="text-customOrange font-medium">
                        {user.rol}
                      </p>
                      <div className="w-full flex flex-row justify-between items-center mt-1 pr-2">
                        <p className="text-zinc-700 text-xl font-bold text-start">
                          {user.estado.toUpperCase()}
                        </p>
                        <div className="flex flex-row gap-4 justify-end">
                          <div
                            onClick={() =>
                              manejarEstadoUsuario(user, "aceptado")
                            }
                            className="bg-lime-600 rounded-full p-2.5"
                          >
                            <FaCheck />
                          </div>
                          <div
                            onClick={() =>
                              manejarEstadoUsuario(user, "rechazado")
                            }
                            className="bg-red-600 rounded-full p-2.5"
                          >
                            <RxCross2 />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {usuariosPendientes.length == 0 && (
                <div className="w-full flex justify-center items-center flex-col gap-6 pt-20">
                  <FaUsersSlash size={80} className="text-customOrange" />
                  <p className="text-zinc-800 text-xl text-center px-8">
                    No hay solicitudes pendientes de revision
                  </p>
                </div>
              )}
            </div>
          )}
          {!verSoloPendientes && (
            <div>
              <p className="text-lg text-zinc-700 text-start">
                Estos son los usuarios registrados
              </p>
              <div className="mt-7 w-full flex flex-col items-center gap-2 h-[50vh] mb-40 overflow-y-auto">
                {usuarios.map((user) => (
                  <div className="w-full rounded-xl bg-white border border-zinc-100 px-4 py-3">
                    <p className="text-black text-xl font-medium">
                      {user.nombre}
                    </p>
                    <p className="text-black font-light italic">{user.email}</p>
                    <p className="text-customOrange font-medium">{user.rol}</p>
                    <div className="w-full flex flex-row justify-between items-center mt-1 pr-2">
                      <p
                        className={`text-xl font-bold text-start ${
                          user.estado == "aceptado"
                            ? "text-lime-600"
                            : "text-zinc-700"
                        } ${
                          user.estado == "rechazado"
                            ? "text-red-600"
                            : "text-zinc-700"
                        }`}
                      >
                        {user.estado.toUpperCase()}
                      </p>
                      <div className="flex flex-row gap-4 justify-end">
                        <div
                          onClick={() => manejarEstadoUsuario(user, "aceptado")}
                          className="bg-lime-600 rounded-full p-2.5"
                        >
                          <FaCheck />
                        </div>
                        <div
                          onClick={() =>
                            manejarEstadoUsuario(user, "rechazado")
                          }
                          className="bg-red-600 rounded-full p-2.5"
                        >
                          <RxCross2 />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            onClick={() => setPestania("home")}
            className="group bg-zinc-800 active:bg-white flex flex-row items-center gap-2 py-2 px-3 rounded-xl absolute left-6 bottom-6 transition-all z-50"
          >
            <AiFillHome
              className="text-white group-active:text-customOrange transition-all"
              size={30}
            />
            <p className="text-xl font-semibold text-white group-active:text-customOrange transition-all">
              Volver
            </p>
          </div>
        </div>
      )}
      {pestania == "mesas" && (
        <div className="h-full w-full flex-1 flex flex-col z-10 px-6">
          <div className="w-full flex flex-row items-center justify-between">
            <p className="text-4xl font-extrabold text-zinc-700 text-start mb-4 mt-9">
              Mesas
            </p>
            <div
              onClick={() => setAgregandoMesa(true)}
              className="group bg-fondoBoton active:bg-white flex flex-row items-center gap-2 py-2 px-3 rounded-xl transition-all z-50 translate-y-2"
            >
              <FaPlus className="text-white" size={30} />
              <p className="text-xl font-semibold text-white">Agregar</p>
            </div>
          </div>
          <div className="w-full flex flex-col mt-1 items-center gap-2 flex-1 overflow-y-auto">
            {mesas.map((mesa) => (
              <div className="w-full flex flex-col px-5 py-4 rounded-lg shadow-sm bg-white border border-zinc-200">
                <p className="text-black font-medium text-xl">
                  Mesa #{mesa.numeroDeMesa}
                </p>
                <p className="text-zinc-700 italic font-light">{mesa.estado}</p>
                <p className="text-zinc-700 text-end text-2xl font-medium">
                  Capacidad:{" "}
                  <b className="text-customOrange text-3xl">{mesa.capacidad}</b>
                </p>
              </div>
            ))}
          </div>
          {/* Modal agregar mesa */}
          {agregandoMesa && (
            <div className="absolute flex justify-center items-center left-0 top-0 h-screen w-screen bg-white/10 backdrop-blur-md z-[60]">
              <div className="w-[90%] p-6 rounded-xl bg-white flex flex-col gap-3">
                <div className="w-full flex flex-row justify-between items-center">
                  <p className="text-start text-3xl text-zinc-800 font-medium">
                    Agregar Mesa
                  </p>
                  <RxCross2
                    onClick={() => setAgregandoMesa(false)}
                    className="text-zinc-800 -translate-y-3 translate-x-3"
                    size={25}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full mt-1">
                  <label
                    htmlFor="numeroDeMesa"
                    className="font-medium text-zinc-800 ml-0.5"
                  >
                    Numero de mesa
                  </label>
                  <input
                    name="numeroDeMesa"
                    type="number"
                    value={numeroDeMesaAAgregar}
                    onChange={(event) =>
                      setNumeroDeMesaAAgregar(event.target.value)
                    }
                    placeholder="Numero de mesa"
                    className="bg-transparent text-zinc-800 h-10 rounded-xl border bg-white shadow-lg border-zinc-300 px-2"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full mt-1">
                  <label
                    htmlFor="capacidad"
                    className="font-medium text-black ml-0.5"
                  >
                    Capacidad
                  </label>
                  <input
                    name="capacidad"
                    type="number"
                    value={capacidadDeMesaAAgregar}
                    onChange={(event) =>
                      setCapacidadDeMesaAAgregar(parseInt(event.target.value))
                    }
                    placeholder="Capacidad de la mesa"
                    className="bg-transparent text-black h-10 rounded-xl border bg-white shadow-lg border-zinc-300 px-2"
                  />
                </div>
                {capacidadDeMesaAAgregar && numeroDeMesaAAgregar != "" && (
                  <button
                    onClick={agregarMesa}
                    className="h-10 w-full rounded-xl bg-fondoBoton text-white mt-2 font-medium"
                  >
                    Agregar
                  </button>
                )}
                {(!capacidadDeMesaAAgregar || numeroDeMesaAAgregar == "") && (
                  <button className="h-10 w-full rounded-xl bg-zinc-500 text-white mt-2 font-medium">
                    Llena los campos para continuar
                  </button>
                )}
              </div>
            </div>
          )}
          {/* Fin modal agregar mesa */}
          <div
            onClick={() => setPestania("home")}
            className="group bg-zinc-800 active:bg-white flex flex-row items-center gap-2 py-2 px-3 rounded-xl absolute left-6 bottom-6 transition-all z-50"
          >
            <AiFillHome
              className="text-white group-active:text-customOrange transition-all"
              size={30}
            />
            <p className="text-xl font-semibold text-white group-active:text-customOrange transition-all">
              Volver
            </p>
          </div>
        </div>
      )}
      <Fondotodo />
    </div>
  );
};

export default HomeDuenio;
