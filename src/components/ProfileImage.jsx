import { useEffect, useState } from 'react';
import { getDefaultProfileImage } from '../firebase/firebase.js';

const ProfileImage = ({ src, className }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        
        let url = src;
        
        if (!src || src === "default") {
          url = await getDefaultProfileImage();
        }

        // Verificar si la URL es válida
        const test = await fetch(url);
        if (!test.ok) throw new Error("Imagen no encontrada");
        
        setImageUrl(url);
      } catch (error) {
        console.error("Error cargando imagen:", error);
        setImageUrl('/fallback-image.jpg');
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [src]);

  if (loading) {
    return <div className={className}>Cargando imagen...</div>;
  }

  return (
    <img 
      src={imageUrl}
      alt="Perfil del usuario"
      className={className}
      onError={(e) => {
        e.target.src = '/fallback-image.jpg';
      }}
    />
  );
};

export default ProfileImage;