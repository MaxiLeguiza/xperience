import { useState } from "react";

/**
 * Hook para manejar uploads a Cloudinary
 * 
 * Configura las credenciales en:
 * VITE_CLOUDINARY_CLOUD_NAME = tu_cloud_name
 * VITE_CLOUDINARY_UPLOAD_PRESET = tu_upload_preset (sin firmar)
 */
export function useCloudinary() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    setUploading(true);
    setError(null);

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error(
          "Faltan credenciales de Cloudinary. Configura VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET"
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "xperience-tours");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir imagen a Cloudinary");
      }

      const data = await response.json();
      return data.secure_url; // Retorna la URL segura

    } catch (err) {
      const errorMsg = err.message || "Error desconocido al subir imagen";
      setError(errorMsg);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultiple = async (files) => {
    const urls = [];
    for (const file of files) {
      try {
        const url = await uploadImage(file);
        urls.push(url);
      } catch (err) {
        console.error("Error subiendo archivo:", err);
      }
    }
    return urls;
  };

  return {
    uploadImage,
    uploadMultiple,
    uploading,
    error,
  };
}
