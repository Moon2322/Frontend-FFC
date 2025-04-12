// components/ImageUploader.js
import { useState } from 'react';
import { storage } from '../firebase/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaUpload } from 'react-icons/fa';

const ImageUploader = ({ userId, onUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `profile-pictures/${userId}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload(url);
    } catch (error) {
      console.error("Error subiendo imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <input
        type="file"
        id="profile-upload"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        style={{ display: 'none' }}
      />
      <label htmlFor="profile-upload" className={styles.uploadButton}>
        <FaUpload /> {uploading ? 'Subiendo...' : 'Cambiar imagen'}
      </label>
    </div>
  );
};