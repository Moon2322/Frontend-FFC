// src/components/ProfileImageWithUpload.jsx
import { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDefaultProfileImage } from '../firebase/firebase.js';
import styles from './../css/Administrar.module.css';


const ProfileImageWithUpload = ({ src, userId, onUpload }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = src === "default" || !src 
          ? await getDefaultProfileImage()
          : src;
        setImageUrl(url);
      } catch (error) {
        console.error("Error cargando imagen:", error);
        setImageUrl('/fallback-profile.jpg');
      }
    };
    loadImage();
  }, [src]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;
  
    try {
      setUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `profile-pictures/${userId}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload(url);          // Avísale al padre
      setImageUrl(url);       // Aquí actualizas la imagen internamente
    } catch (error) {
      console.error("Error subiendo imagen:", error);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="profile-image-container">
      <img 
        src={imageUrl}
        alt="Perfil del usuario" 
        className={styles.profileImg}
        onError={(e) => {
        e.target.src = '/fallback-profile.jpg';
        }}
      />
      <input
        type="file"
        id="profileUpload"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label 
        htmlFor="profileUpload" 
        className="upload-button"
      >
        {uploading ? 'Subiendo...' : 'Cambiar imagen'}
      </label>
    </div>
  );
};

export default ProfileImageWithUpload;