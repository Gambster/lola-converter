// src/components/Dropzone.tsx
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone() {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch(
        "https://lola-converter-server.onrender.com/convert",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al convertir el archivo");
      }

      // Creamos un enlace temporal para descargar la imagen
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Creamos un enlace de descarga
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.jpg"; // Nombre del archivo descargado
      a.click();

      // Limpiamos el enlace creado
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al convertir el archivo.");
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full mt-8 text-center">
      <div
        {...getRootProps()}
        className="cursor-pointer p-4 border border-dashed border-gray-400 rounded-lg"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta los archivos aquí...</p>
        ) : (
          <p>Arrastra un archivo DNG o haz clic aquí 🚀</p>
        )}
      </div>

      {loading && <p className="mt-4 text-blue-500">Convirtiendo...</p>}
    </div>
  );
}
