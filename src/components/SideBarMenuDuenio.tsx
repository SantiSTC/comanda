import { RiLogoutBoxLine } from "react-icons/ri";
import { logout } from "../services/auth";
import Swal from "sweetalert2";

interface SideBarMenuDuenioProps {
  menuAbierto: boolean;
}

const SideBarMenuDuenio = ({ menuAbierto }: SideBarMenuDuenioProps) => {
  const cerrarSesion = () => {
    logout().then(() => {
      Swal.fire({
        title: "Sesión cerrada",
        text: "Te esperamos pronto de vuelta",
        icon: "success",
        heightAuto: false,
        timer: 5000,
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#D94908",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    });
  };

  return (
    <div
      className={`w-3/4 h-full mt-[76px] absolute bg-fondoBoton z-[1000] ${
        menuAbierto ? "-translate-x-0" : "-translate-x-96"
      } transition-all duration-500`}
    >
      <div
        onClick={cerrarSesion}
        className="absolute bottom-0 -translate-y-[76px] border-t border-slate-50 h-16 w-full flex flex-row gap-3 items-center px-4"
      >
        <RiLogoutBoxLine size={28} className="text-white" />
        <p className="text-white font-medium text-2xl">Cerrar sesión</p>
      </div>
    </div>
  );
};

export default SideBarMenuDuenio;
