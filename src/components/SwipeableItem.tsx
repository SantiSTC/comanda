import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

type SwipeableItemProps = {
  item: any;
  onSwipe: (id: number) => void;
};

const SwipeableItem: React.FC<SwipeableItemProps> = ({ item, onSwipe }) => {
  const [startX, setStartX] = useState<number>(0);
  const [currentX, setCurrentX] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const deltaX = e.touches[0].clientX - startX;
    setCurrentX(deltaX); // Actualiza la posición actual
  };

  const handleTouchEnd = () => {
    if (currentX < -200) {
      onSwipe(item.id); // Llama a la acción de eliminación
    }
    setCurrentX(0); // Restaura la posición del elemento
  };

  return (
    <div className="relative w-full">
      {/* Fondo Rojo con Ícono */}
      <div className="absolute inset-0 flex items-center justify-end bg-red-500 rounded-lg px-4">
        <FiTrash2 className="text-white text-2xl" />
      </div>

      {/* Contenido Principal */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${currentX}px)` }}
        className="w-full flex flex-row justify-between items-center px-6 bg-white rounded-lg transition-transform duration-200"
      >
        <p className="text-zinc-800 text-lg">{item.plato.replace("-", " ")}</p>
        <p className="text-customOrange text-lg font-bold">${item.precio}</p>
      </div>
    </div>
  );
};

export default SwipeableItem;
