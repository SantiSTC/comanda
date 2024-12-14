import { useState } from "react";
import Fondotodo from "../components/fondotodo";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import NavBar from "../components/NavBar";
import { useParams } from "react-router";
import { AiFillHome } from "react-icons/ai";
import Swal from "sweetalert2";

const Encuestas = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  

  const { email } = useParams<any>();

  const manejarVolver = () => {
    Swal.fire({
      title: "¿Estás seguro de volver?",
      text: "No podras hacer la encuesta luego si volves hacia atras ahora",
      icon: "warning",
      heightAuto: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#D94908",
      cancelButtonColor: "black",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/homecliente";
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
        <p
          onClick={() => alert(email)}
          className="text-4xl font-extrabold text-zinc-700 text-start px-6 mb-8 mt-9"
        >
          Encuestas
        </p>
        <div className="mt-7 px-6 w-full flex flex-col items-center gap-2 flex-1 mb-40 overflow-y-auto"></div>
      </div>
      <div
        onClick={manejarVolver}
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
      <Fondotodo />
    </div>
  );
};

export default Encuestas;
