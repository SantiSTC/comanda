import { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { traer } from "../services/firestore";
import { login } from "../services/auth";
import usePushNotifications from "../hooks/usePushNotifications";

const Login = () => {
  const [userType, setUserType] = useState("cliente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [enablePush, setEnablePush] = useState(false);

  // Hook de notificaciones push
  usePushNotifications({
    enabled: enablePush,
    title: "El titulo",
    body: "Esto es una desc",
  });

  // Cargar usuarios desde Firestore
  useEffect(() => {
    traer("usuarios", "", (data) => {
      console.log(data);
      setUsuarios(data);
    });
  }, []);

  const ingresar = (e: any) => {
    e.preventDefault();
    login(email, password)
      .then((user: any) => {
        usuarios.map((item) => {
          if (item.email === user.email) {
            switch (item.rol) {
              case "cliente":
                window.location.href = "/homecliente";
                break;
              case "duenio":
                window.location.href = "/homeduenio";
                break;
              case "bartender":
                window.location.href = "/homebar";
                break;
              case "chef":
                window.location.href = "/homechef";
                break;
              case "mozo":
                window.location.href = "/homemozo";
                break;
              case "maitre":
                window.location.href = "/homemaitre";
                break;
            }
          }
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const llamarAPush = () => {
    setEnablePush(true); // Activar las notificaciones
  };

  return (
    <div className="bg-[url(/login/fondo.jpg)] bg-left bg-cover min-h-screen w-full flex flex-col justify-center items-center">
      <div className="absolute top-0 left-0 h-screen w-screen bg-black/60"></div>
      <div className="w-[85%] h-auto max-h-[75vh] overflow-y-auto bg-slate-50 shadow-lg rounded-xl -translate-y-10 flex items-center flex-col px-3 py-8">
        <img src="/icon.png" className="h-14 w-auto drop-shadow-lg" />
        <p onClick={llamarAPush} className="text-black font-bold text-3xl my-4 z-[100000] active:text-blue-600">Iniciá Sesion</p>
        <div className="w-full flex justify-center items-center">
          <div className="w-4/5 flex justify-center gap-3 flex-row">
            <div className="flex flex-col items-center w-full gap-2">
              <p className="text-black text-center w-full text-sm font-medium">
                Ingresá como:
              </p>
              <div className="flex justify-start gap-2 flex-row">
                <div
                  onClick={() => {
                    setUserType("cliente");
                  }}
                  className={`bg-slate-100 border border-zinc-300 px-3 py-1.5 rounded-2xl ${
                    userType == "cliente"
                      ? "bg-fondoBoton text-white"
                      : "text-black"
                  }`}
                >
                  <p className="text-xs font-medium">Cliente</p>
                </div>
                <div
                  onClick={() => {
                    setUserType("invitado");
                  }}
                  className={`bg-slate-100 border border-zinc-300 px-3 py-1.5 rounded-2xl ${
                    userType == "invitado"
                      ? "bg-fondoBoton text-white"
                      : "text-black"
                  }`}
                >
                  <p className="text-xs font-medium">Invitado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form className="flex flex-col gap-1 w-4/5 mt-4 items-center">
          <div
            className={`${
              userType == "cliente" ? "flex" : "hidden"
            } flex-col gap-1 w-full mt-1`}
          >
            <label htmlFor="email" className="font-medium text-black ml-0.5">
              Correo electronico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Correo electronico"
              className="bg-transparent text-black h-10 rounded-xl border bg-white shadow-lg border-zinc-300 px-2"
            />
          </div>
          <div
            className={`${
              userType == "cliente" ? "flex" : "hidden"
            } flex-col gap-1 w-full mt-3`}
          >
            <label htmlFor="password" className="font-medium text-black ml-0.5">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contraseña"
              className="bg-transparent text-black h-10 rounded-xl border bg-white shadow-lg border-zinc-300 px-2"
            />
          </div>
          <div
            className={`${
              userType == "invitado" ? "flex" : "hidden"
            } flex-col gap-1 w-full mt-1`}
          >
            <label htmlFor="name" className="font-medium text-black ml-0.5">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nombre"
              className="bg-transparent text-black h-10 rounded-xl border bg-white shadow-lg border-zinc-300 px-2"
            />
          </div>
          <button
            onClick={ingresar}
            className="w-full h-10 rounded-xl bg-fondoBoton mt-5 shadow-lg active:bg-customOrange/80 transition-all duration-300"
          >
            <p className="font-semibold text-white">Ingresar</p>
          </button>
          <p className="text-black mt-3 underline active:text-customOrange transition-all">
            ¿Olvidaste tu contraseña?
          </p>
        </form>
      </div>
      <a
        href="/signup"
        className="absolute right-0 text-white bottom-0 m-8 w-auto rounded-3xl bg-fondoBoton flex flex-row gap-2 justify-center items-center px-4 py-3 active:bg-customOrange/80 transition-all duration-300"
      >
        <FiUserPlus size={20} />
        <p className="font-medium text-lg">Registrate</p>
      </a>
    </div>
  );
};

export default Login;
