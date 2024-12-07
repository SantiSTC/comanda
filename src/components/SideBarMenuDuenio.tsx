import { RiLogoutBoxLine } from "react-icons/ri";

interface SideBarMenuDuenioProps {
    menuAbierto: boolean,
}

const SideBarMenuDuenio = ({menuAbierto}: SideBarMenuDuenioProps) => {
  return (
    <div
    className={`w-3/4 h-full mt-[76px] absolute bg-fondoBoton z-50 ${
      menuAbierto ? "-translate-x-0" : "-translate-x-96"
    } transition-all duration-500`}
  >
    <div className="absolute bottom-0 -translate-y-[76px] border-t border-slate-50 h-16 w-full flex flex-row gap-3 items-center px-4">
      <RiLogoutBoxLine size={28} className="" />
      <p className="text-white font-medium text-2xl">Cerrar sesión</p>
    </div>
  </div>
  )
}

export default SideBarMenuDuenio
