import React, { useState, useEffect } from "react";
import { IoCloseSharp, IoMenu } from "react-icons/io5";

type ChildProps = {
  rol: string;
  onStateChange: (data: boolean) => void;
};

const NavBar: React.FC<ChildProps> = ({ rol, onStateChange }) => {
  const [state, setState] = useState<boolean>(false);

  useEffect(() => {
    onStateChange(state); // Enviar el estado al padre cada vez que cambie
  }, [state, onStateChange]);

  return (
    <>
      <div className="h-[72px] bg-white w-full flex flex-row items-center px-5 shadow-lg relative">
        <div
          onClick={() => {
            setState(!state);
          }}
          className="absolute z-50 left-0 mx-4 flex items-center rounded-full translate-y-1"
        >
          {!state && (
            <IoMenu
              className={`text-customOrange transition-all duration-300`}
              size={28}
            />
          )}
          {state && (
            <IoCloseSharp
              className={`text-customOrange transition-all duration-300 absolute`}
              size={28}
            />
          )}
        </div>
        <div className="relative w-full flex justify-center flex-row items-start gap-3 translate-y-1">
          <img src="/icon.png" className="h-7 w-auto drop-shadow-sm" />
          <p className="text-zinc-600 font-bold text-2xl drop-shadow-sm">
            RestOps
          </p>
          <p className="absolute right-0 top-0 bottom-0 text-zinc-600 italic">{rol}</p>
        </div>
      </div>
      <div className="h-0.5 w-full bg-fondoBoton"></div>
    </>
  );
};

export default NavBar;
