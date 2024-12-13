import React, { useState } from 'react';

const UploadPhoto: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Maneja la selección de archivos
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center w-full mt-0 bg-gray-100  shadow-lg">
      <div className="bg-white p-8 rounded-xl shadow-md w-full">
        <h2 className="text-center text-2xl font-bold text-black mb-2">Subir Foto</h2>
        {/* Input para seleccionar imagen */}
        <div className="mb-4">
          <label
            htmlFor="fileInput"
            className="block text-center text-sm font-medium text-gray-700 mb-2"
          >
            Selecciona una imagen
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById('fileInput')?.click()}
            className="w-full bg-fondoBoton text-white font-semibold py-2 px-4 rounded-xl hover:bg-orange-700 transition-all"
          >
            Seleccionar Imagen
          </button>
        </div>

        {/* Muestra la imagen seleccionada */}
        {selectedImage && (
          <div className="flex justify-center mb-4">
            <img src={selectedImage} alt="Imagen seleccionada" className="w-48 h-48 object-cover rounded-xl" />
          </div>
        )}

        {/* Botón para guardar */}
        <button
          type="button"
          className="w-full bg-fondoBoton text-white font-semibold py-2 px-4 rounded-xl hover:bg-orange-700 transition-all"
          onClick={() => {
            if (selectedImage) {
              // ACA LOGIVA PARA GUARDAR LA IMAGEN
              console.log("Imagen guardada:", selectedImage);
            } else {
              alert("No se ha seleccionado ninguna imagen.");
            }
          }}
        >
          Guardar Foto
        </button>
      </div>
    </div>
  );
};

export default UploadPhoto;
