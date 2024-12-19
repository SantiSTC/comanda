import { useState } from "react";
import Fondotodo from "../components/fondotodo";
import SideBarMenuDuenio from "../components/SideBarMenuDuenio";
import NavBar from "../components/NavBar";
import { useParams } from "react-router";
import { AiFillHome } from "react-icons/ai";
import Swal from "sweetalert2";
import RatingComponent from "../components/RatingComponent";
import { guardar } from "../services/firestore";

const Encuestas = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [ambiente, setAmbiente] = useState(-1);
  const [comida, setComida] = useState(-1);
  const [precio, setPrecio] = useState(-1);
  const [tiempoDeEspera, setTiempoDeEspera] = useState(-1);

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

  const enviarEncuesta = () => {
    let objEncuesta = {
      cliente: email,
      time: Date.now(),
      comida: comida,
      ambiente: ambiente,
      precio: precio,
      tiempoDeEspera: tiempoDeEspera,
    };

    guardar("encuestas", objEncuesta).then(() => {
      Swal.fire({
        title: "Encuesta enviada",
        text: "Muchas gracias por tu tiempo",
        icon: "success",
        heightAuto: false,
        timer: 3000,
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#D94908",
      }).then(() => {
        window.location.href = "/homecliente";
      });
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Navbar */}
      <NavBar onStateChange={setMenuAbierto} rol={""} />
      {/* Menu desplegable */}
      <SideBarMenuDuenio menuAbierto={menuAbierto} />
      {/* Contenido de la pagina */}
      <div className="h-full w-full flex-1 flex flex-col z-10">
        <p
          onClick={() => alert(ambiente)}
          className="text-4xl font-extrabold text-zinc-700 text-start px-6 mb-3 mt-9"
        >
          Encuesta
        </p>
        <p className="font-light text-zinc-800 px-6 mb-8 text-end">
          Responde unas breves preguntas sobre tu experiencia en el restaurant.
        </p>
        <div className="mt-1 px-6 w-full max-h-[50vh] flex flex-col items-center gap-2 overflow-y-auto">
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-4 w-full mt-1">
              <RatingComponent setRating={setAmbiente} title="Ambiente" />
              <RatingComponent setRating={setComida} title="Comida" />
              <RatingComponent setRating={setPrecio} title="Precio" />
              <RatingComponent
                setRating={setTiempoDeEspera}
                title="Tiempo de espera"
              />
              {ambiente > -1 &&
                comida > -1 &&
                precio > -1 &&
                tiempoDeEspera > -1 && (
                  <button
                    onClick={enviarEncuesta}
                    className="h-10 w-full rounded-xl bg-fondoBoton font-medium text-white active:scale-95 transition-all"
                  >
                    Enviar encuesta
                  </button>
                )}
              {(ambiente == -1 ||
                comida == -1 ||
                precio == -1 ||
                tiempoDeEspera == -1) && (
                <button className="h-10 w-full rounded-xl bg-zinc-500 font-medium text-white active:scale-95 transition-all">
                  Puntuá todos los campos
                </button>
              )}
            </div>
          </div>
        </div>
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
