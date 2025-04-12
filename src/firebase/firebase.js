// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Función para obtener URL de imagen predeterminada
export const getDefaultProfileImage = async () => {
  try {
    const imageRef = ref(storage, 'FFC/default-profile.png');
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error("Error obteniendo imagen predeterminada:", error);
    return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"; // Fallback
  }
};

export { storage };