import PhotoUpload from "../components/UploadPhoto";
import { FaRegIdCard } from "react-icons/fa";
import { register } from "../services/auth";
import { guardar } from "../services/firestore";
import { useState } from "react";
import Swal from "sweetalert2";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const registrarse = (e: any) => {
    e.preventDefault();
    register(email, password)
      .then(() => {
        guardarUsuario();
      })
      .catch((err) => {
        alert("1" + err);
        Swal.fire({
          title: "Error",
          text: err,
          icon: "success",
          heightAuto: false,
          timer: 5000,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#D94908",
        });
      });
  };

  const guardarUsuario = () => {
    let objUser = {
      email: email,
      nombre: name,
      estado: "pendiente",
      reservas: [],
      pedidos: [],
    };

    guardar("usuarios", objUser)
      .then(() => {
        window.location.href = "/homecliente";
      })
      .catch((err) => {
        alert("2" + err);
        Swal.fire({
          title: "Error",
          text: err,
          icon: "success",
          heightAuto: false,
          timer: 5000,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#D94908",
        });
      });
  };

  return (
    <div className="bg-[url(/signup/fondo.jpg)] bg-center bg-cover min-h-screen w-full flex flex-col justify-center items-center">
      <div className="absolute top-0 left-0 h-screen w-screen bg-black/60"></div>
      <div className="w-[85%] h-auto  max-h-[75vh] overflow-y-auto bg-slate-50 shadow-lg rounded-xl -translate-y-10 flex items-center flex-col px-3 py-8">
        <img src="/icon.png" className="h-14 w-auto drop-shadow-lg" />
        <p className="text-black font-bold text-3xl my-4">Crea tu cuenta</p>
        <button className="w-4/5 min-h-12 flex flex-row justify-center items-center gap-3 rounded-xl bg-fondoBoton mt-5 shadow-lg active:bg-customOrange/80 transition-all duration-300">
          <FaRegIdCard size={28} className="text-white" />
          <p className="font-semibold">Registrarse con DNI</p>
        </button>
        <form
          onSubmit={registrarse}
          className="flex flex-col gap-1 w-4/5 mt-4 items-center"
        >
          <div className="flex flex-col gap-1 w-full mt-1">
            <label htmlFor="name" className="font-medium text-black ml-0.5">
              Nombre y apellido
            </label>
            <input
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nombre y apellido"
              className="bg-transparent text-black h-10 rounded-xl border bg-white shadow-lg border-zinc-300 px-2"
            />
          </div>
          <div className="flex flex-col gap-1 w-full mt-1">
            <label htmlFor="email" className="font-medium text-black ml-0.5">
              Correo electronico
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Correo electronico"
              className="bg-transparent text-black h-10 rounded-xl border bg-white shadow-lg border-zinc-300 px-2"
            />
          </div>
          <div className="flex flex-col gap-1 w-full mt-3">
            <label htmlFor="password" className="font-medium text-black ml-0.5">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contraseña"
              className="bg-transparent text-black h-10 rounded-xl border bg-white shadow-lg border-zinc-300 px-2"
            />
          </div>
          <PhotoUpload />
          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-fondoBoton mt-5 shadow-lg active:bg-customOrange/80 transition-all duration-300"
          >
            <p className="font-semibold">Registrarse</p>
          </button>
          <a
            href="/login"
            className="text-black text-center text-sm mt-3 active:text-customOrange transition-all"
          >
            ¿Ya tienes una cuenta?{" "}
            <b className="underline font-normal">Iniciá sesión</b>
          </a>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
