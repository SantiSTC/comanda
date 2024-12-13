import React from "react";
import QrReader from "modern-react-qr-reader";
import NavBar from "./NavBar";
import Fondotodo from "./fondotodo";
import { RiStarSFill } from "react-icons/ri";

type QRScannerProps = {
  text: string;
  onScanSuccess: (data: string) => void;
  onError?: (error: any) => void;
  verOpiniones?: boolean;
  subtext?: string;
};

const QRScanner: React.FC<QRScannerProps> = ({
  text,
  onScanSuccess,
  onError,
  verOpiniones = true,
  subtext,
}) => {
  const handleScan = (data: string | null) => {
    if (data) {
      onScanSuccess(data); // Enviar datos al padre
    }
  };

  const handleError = (error: any) => {
    console.error("Error al escanear QR:", error);
    if (onError) onError(error); // Manejar errores opcionalmente
  };

  return (
    <div className="bg-slate-50 overflow-y-scroll">
      <NavBar rol="" />
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-start relative gap-5 p-6">
        {text.length > 9 && (
          <p className="text-black font-semibold text-2xl text-center px-4">
            {text}
          </p>
        )}
        {text.length <= 9 && (
          <p className="text-zinc-800 font-bold text-4xl text-center px-4">
            {text}
          </p>
        )}
        <QrReader
          delay={200} // Intervalo en milisegundos entre intentos de escaneo
          onError={handleError} // Callback para manejar errores
          onScan={handleScan} // Callback para manejar los datos escaneados
          facingMode="environment" // Usar la cámara trasera
          style={{ width: "100%" }} // Ajustar el tamaño
        />
        <p className="text-lg font-medium text-zinc-700 text-center">
          {subtext}
        </p>
        {verOpiniones && (
          <div className="flex flex-col items-center gap-2 pb-10 -mt-5">
            <p className="text-lg font-medium text-zinc-700 text-center">
              Tambien puedes revisar opiniones de antiguos clientes
            </p>
            <div className="group h-auto w-full bg-white border border-zinc-100 flex flex-col items-center justify-center gap-1 py-4 mb-4 mt-0 shadow-xl rounded-3xl active:border-zinc-300 active:bg-fondoBoton transition-all duration-100">
              <RiStarSFill
                className="text-customOrange drop-shadow-sm group-active:text-white transition-all duration-100"
                size={59}
              />
              <p className="drop-shadow-md text-xl text-zinc-800 group-active:text-white transition-all duration-100">
                Ver opiniones
              </p>
            </div>
          </div>
        )}
      </div>
      <Fondotodo />
    </div>
  );
};

export default QRScanner;
