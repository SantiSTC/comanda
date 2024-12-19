import React, { useState } from "react";
import { FaStar } from "react-icons/fa"; // Necesitas instalar react-icons si no lo tienes ya

type RatingComponentProps = {
  title: string;
  setRating: (value: number) => void;
};

const RatingComponent: React.FC<RatingComponentProps> = ({ title, setRating }) => {
  const [rating, setLocalRating] = useState<number>(0);

  const handleRating = (value: number) => {
    setLocalRating(value);
    setRating(value);
  };

  return (
    <div className="flex flex-col items-center gap-2 border border-zinc-200 py-3 rounded-xl">
      <p className="text-lg font-medium text-gray-700">
        {title}
      </p>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={30}
            className={`cursor-pointer transition-all duration-200 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => handleRating(star)}
          />
        ))}
      </div>
      <p className="text-gray-600 text-sm">Puntuación seleccionada: {rating}</p>
    </div>
  );
};

export default RatingComponent;
