import NavBar from "../components/NavBar";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import Fondotodo from "../components/fondotodo";
import { useEffect, useState } from "react";
import { modificar, traer } from "../services/firestore";

import { MdTableBar } from "react-icons/md";
import { FaUsers, FaUsersSlash } from "react-icons/fa6";
import Swal from "sweetalert2";

const HomeMaitre = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuariosEnEspera, setUsuariosEnEspera] = useState<any[]>([]);
  const [mesas, setMesas] = useState<any[]>([]);
  const [pestaniaelegida, setPestaniaElegida] = useState("clientes");
  const [asignandoMesa, setAsignandoMesa] = useState(false);

  const botones = [
    {
      icon: <FaUsers size={30} />,
      text: "Clientes",
      pestania: "clientes",
    },
    {
      icon: <MdTableBar size={30} />,
      text: "Mesas",
      pestania: "mesas",
    },
  ];

  useEffect(() => {
    traer("usuarios", "", (data) => {
      const usuariosFiltrados = data.filter(
        (item) =>
          item.estadoEnRestaurant === "enEspera" && item.personasEnMesa > 0
      );
      setUsuariosEnEspera(usuariosFiltrados); // Actualiza el estado una sola vez
    });
  }, []);

  useEffect(() => {
    traer("mesas", "", (data) => {
      const mesasDisponibles = data.filter((item) => item.estado === "libre");
      setMesas(mesasDisponibles); // Actualiza el estado una sola vez
    });
  }, []);

  const obtenerMesasConCapacidadMayorA = (capacidad: number) => {
    return mesas.filter((item) => item.capacidad >= capacidad);
  };

  const asignarMesaACliente = (cliente: any, mesa: any) => {
    cliente.estadoEnRestaurant = "mesaAsignada";
    cliente.mesaAsignada = mesa.numeroDeMesa;

    modificar("usuarios", cliente).then(() => {
      setAsignandoMesa(false);
      (mesa.estado = "ocupado"),
        (mesa.comenzal = cliente.email),
        modificar("mesas", mesa).then(() => {
          Swal.fire({
            title: "Perfecto",
            text: "Mesa asignada correctamente",
            icon: "success",
            heightAuto: false,
            timer: 5000,
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#D94908",
          });
        });
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Navbar */}
      <NavBar onStateChange={setMenuAbierto} rol={"Maitre"} />
      {/* Menu desplegable */}
      <SideBarMenuDuenio menuAbierto={menuAbierto} />
      {/* Contenido de la pagina */}
      <div className="flex flex-row justify-center px-6 gap-4 mt-8 z-40">
        {botones.map((item) => (
          <div
            key={item.pestania}
            onClick={() => setPestaniaElegida(item.pestania)}
            className={`${
              pestaniaelegida == item.pestania ? "bg-fondoBoton" : "bg-white"
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
      {pestaniaelegida == "clientes" && (
        <div className="flex flex-col px-5">
          <p className="text-3xl font-semibold text-zinc-700 text-start mb-8 mt-9">
            Clientes en lista de espera
          </p>
          <div className="w-full flex flex-col mt-1 items-center gap-2">
            {usuariosEnEspera.length > 0 && (
              <div className="w-full flex justify-center">
                {usuariosEnEspera.map((user) => (
                  <div
                    onClick={() => setAsignandoMesa(true)}
                    className="w-[90%] flex flex-col px-5 py-4 z-40 rounded-lg shadow-sm bg-white border border-zinc-200 active:bg-zinc-200 active:shadow-md active:border-customOrange transition-all"
                  >
                    <p className="text-black font-medium text-xl">
                      {user.nombre}
                    </p>
                    <p className="text-zinc-700 font-medium text-sm">
                      {user.email}
                    </p>
                    <p className="text-customOrange text-end text-2xl font-semibold">
                      {user.personasEnMesa} Personas
                    </p>
                    {asignandoMesa && (
                      <div className="h-screen w-screen absolute top-0 left-0 bg-white/10 backdrop-blur-md flex justify-center items-center">
                        <div className="bg-white w-[90%] rounded-lg flex flex-col gap-2 items-center p-5 border border-zinc-200 shadow-md">
                          <p className="text-black text-center text-xl font-medium">
                            Elija una mesa para el cliente{" "}
                            <b className="text-customOrange italic">
                              {user.nombre}
                            </b>
                          </p>
                          <div className="w-full max-h-[80%] overflow-y-auto flex flex-col mt-1 items-center gap-2">
                            {obtenerMesasConCapacidadMayorA(
                              user.personasEnMesa
                            ).map((mesa) => (
                              <div
                                onClick={() => asignarMesaACliente(user, mesa)}
                                className="w-[90%] flex flex-col px-5 py-4 rounded-lg shadow-sm bg-white border border-zinc-200 active:bg-zinc-200 active:shadow-md active:border-customOrange transition-all"
                              >
                                <p className="text-black font-medium text-xl">
                                  Mesa #{mesa.numeroDeMesa}
                                </p>
                                <p className="text-zinc-700 font-medium text-sm">
                                  Mesa libre
                                </p>
                                <p className="text-zinc-700 text-end text-2xl font-medium">
                                  Capacidad:{" "}
                                  <b className="text-customOrange text-3xl">
                                    {mesa.capacidad}
                                  </b>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {usuariosEnEspera.length == 0 && (
              <div className="w-full flex justify-center items-center flex-col gap-6 pt-20">
                <FaUsersSlash size={80} className="text-customOrange" />
                <p className="text-zinc-800 text-xl font-semibold text-center px-8">
                  No hay clientes en la lista de espera
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {pestaniaelegida == "mesas" && (
        <div className="flex flex-col px-5">
          <p className="text-3xl font-semibold text-zinc-700 text-start mb-8 mt-9">
            Mesas disponibles
          </p>
          <div className="w-full flex flex-col mt-1 items-center gap-2">
            {mesas.map((mesa) => (
              <div className="w-[90%] flex flex-col px-5 py-4 rounded-lg shadow-sm bg-white border border-zinc-200">
                <p className="text-black font-medium text-xl">
                  Mesa #{mesa.numeroDeMesa}
                </p>
                <p className="text-zinc-700 font-medium text-sm">Mesa libre</p>
                <p className="text-zinc-700 text-end text-2xl font-medium">
                  Capacidad:{" "}
                  <b className="text-customOrange text-3xl">{mesa.capacidad}</b>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Fondotodo />
    </div>
  );
};

export default HomeMaitre;
