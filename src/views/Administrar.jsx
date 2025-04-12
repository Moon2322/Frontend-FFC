import { useState, useEffect } from 'react';
import styles from './../css/Administrar.module.css';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import logo from './../assets/FFC_logo.png';
import { Snackbar, Alert } from "@mui/material";
import { motion } from 'framer-motion'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase.js';
import ProfileImage from '../components/ProfileImage.jsx';
import ProfileImageWithUpload from '../components/ProfileImageWithUpload.jsx';



function Administrar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [userData, setUserData] = useState(null);
    const [hasFighterProfile, setHasFighterProfile] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedSection, setSelectedSection] = useState("perfil");
    const [successMessage, setSuccessMessage] = useState('');


    const [fighterData, setFighterData] = useState({
        nombre: '',
        estatura: '',
        peso: '',
        habilidades: '',
        record: '0-0-0',
        estiloCombate: ''
    });

    useEffect(() => {
        const checkAuthAndLoad = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setShowAlert(true);
                setTimeout(() => navigate('/login'), 2000);
                return;
            }
    
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Obtener datos del usuario con la imagen
                const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    
                    // Si no tiene imagen, asignar predeterminada
                    if (!userData.profileImage) {
                        const defaultImage = await getDefaultProfileImage();
                        userData.profileImage = defaultImage;
                    }
                    
                    setUserData({
                        ...userData,
                        id: payload.userId
                    });
                }
    
                await checkFighterProfile(payload.userId);
            } catch (error) {
                console.error("Error:", error);
                handleLogout();
            }
        };
    
        checkAuthAndLoad();
    }, [navigate]);


    

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleNavigation = (route) => {
        navigate(route);
    };

// Agrega esta función para actualizar la imagen
const handleImageUpload = async (newUrl) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ profileImage: newUrl })
      });
      
      if (response.ok) {
        setUserData(prev => ({...prev, profileImage: newUrl }));
        setSuccessMessage('Imagen actualizada correctamente');
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
    }
  };
 
    const checkFighterProfile = async (userId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/peleador/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setHasFighterProfile(data.exists);
                if (data.exists) {
                    setFighterData(data.profile);
                }
            } else if (response.status === 404) {
                setHasFighterProfile(false);
            } else {
                console.error("Error en la respuesta:", response.status);
            }
        } catch (error) {
            console.error("Error verificando perfil:", error);
            setHasFighterProfile(false);
        }
    };

    const handleCreateProfile = async () => {
        if (!fighterData.nombre || !fighterData.estatura || !fighterData.peso) {
            alert("Por favor completa los campos requeridos");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/peleador`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...fighterData,
                    userId: userData?.id
                })
            });

            if (response.ok) {
                const data = await response.json();
                setHasFighterProfile(true);
                setFighterData(data);
                setShowCreateForm(false);
                setSuccessMessage("Perfil de peleador creado exitosamente");
            }
            
        } catch (error) {
            console.error("Error creando perfil:", error);
        }
    };

    const renderFighterSection = () => {
        if (!hasFighterProfile) {
            return (
                <div className={styles.fighterPrompt}>
                    <h3>No tienes un perfil de peleador</h3>
                    <button 
                        className={styles.createButton} 
                        onClick={() => setShowCreateForm(true)}
                    >
                        Crear Perfil de Peleador
                    </button>
                </div>
            );
        }

        return (
            <div className={styles.fighterProfile}>
                <h2>Perfil de Peleador</h2>
                <div className={styles.fighterInfo}>
                    <p>Nombre: {fighterData.nombre}</p>
                    <p>Estatura: {fighterData.estatura} cm</p>
                    <p>Peso: {fighterData.peso} kg</p>
                    <p>Habilidades: {fighterData.habilidades}</p>
                    <p>Récord: {fighterData.record}</p>
                    <p>Estilo de combate: {fighterData.estiloCombate}</p>
                    <button 
                        className={styles.editButton}
/*                         onClick={() => setShowCreateForm(true)} */                    >
                        Editar Perfil
                    </button>
                </div>
            </div>
        );
    };

    const renderCreateForm = () => (
        <div className={styles.createForm}>
            <h3>{hasFighterProfile ? 'Editar' : 'Crear'} Perfil de Peleador</h3>
            <div className={styles.formGroup}>
                <label>Nombre de Peleador</label>
                <input
                    type="text"
                    value={fighterData.nombre}
                    onChange={(e) => setFighterData({ ...fighterData, nombre: e.target.value })}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Estatura (cm)</label>
                <input
                    type="number"
                    min="100"
                    max="250"
                    value={fighterData.estatura}
                    onChange={(e) => setFighterData({ ...fighterData, estatura: e.target.value })}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Peso (kg)</label>
                <input
                    type="number"
                    min="40"
                    max="200"
                    value={fighterData.peso}
                    onChange={(e) => setFighterData({ ...fighterData, peso: e.target.value })}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Habilidades Principales</label>
                <input
                    type="text"
                    value={fighterData.habilidades}
                    onChange={(e) => setFighterData({ ...fighterData, habilidades: e.target.value })}
                    placeholder="Ej: Boxeo, Jiu-Jitsu"
                />
            </div>
            <div className={styles.formGroup}>
                <label>Estilo de Combate</label>
                <select
                    value={fighterData.estiloCombate}
                    onChange={(e) => setFighterData({ ...fighterData, estiloCombate: e.target.value })}
                    required
                >
                    <option value="">Seleccionar</option>
                    <option value="Boxeo">Boxeo</option>
                    <option value="Jiu-Jitsu">Jiu-Jitsu</option>
                    <option value="Muay Thai">Muay Thai</option>
                    <option value="Wrestling">Wrestling</option>
                </select>
            </div>
            <div className={styles.formActions}>
                <button 
                    className={styles.cancelButton} 
                    onClick={() => setShowCreateForm(false)}
                >
                    Cancelar
                </button>
                <button 
                    className={styles.saveButton} 
                    onClick={handleCreateProfile}
                >
                    {hasFighterProfile ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        </div>
    );

// Actualiza la sección de perfil
const renderContent = () => {
    switch(selectedSection) {
        case "perfil":
            return (
                <div className={styles.profileCard}>
              {userData && userData.profileImage !== undefined && (
  <ProfileImageWithUpload
    src={userData.profileImage}
    userId={userData._id}
    onUpload={handleImageUpload}
  />
)}

                    {userData ? (
                        <>
                            <h2>{userData.firstName} {userData.lastName}</h2>
                            <p>Email: {userData.email}</p>
                            <button 
                                className={styles.changePasswordButton}
/*                                 onClick={() => navigate('/cambiar-password')}
 */                            >
                                Cambiar Contraseña
                            </button>
                        </>
                    ) : (
                        <p>Cargando datos del usuario...</p>
                        )}
                    </div>
                );
            case "peleador":
                return showCreateForm ? renderCreateForm() : renderFighterSection();
            default:
                return null;
        }
    };

    return (
        <div className={styles.homePage}>
            <Snackbar 
                open={showAlert} 
                autoHideDuration={1500} 
                onClose={() => setShowAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setShowAlert(false)} severity="error" sx={{ width: '100%' }}>
                    Tu sesión ha expirado. Inicia sesión nuevamente.
                </Alert>
            </Snackbar>
            <Snackbar 
    open={Boolean(successMessage)} 
    autoHideDuration={3000} 
    onClose={() => setSuccessMessage('')}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
    <Alert 
        onClose={() => setSuccessMessage('')} 
        severity="success" 
        sx={{ width: '100%' }}
    >
        {successMessage}
    </Alert>
</Snackbar>


            <header className={styles.header}>
                <div className={styles.navLeft}>
                    <a onClick={() => handleNavigation("/eventos")}>Eventos</a>
                    <a onClick={() => handleNavigation("/peleadores")}>Peleadores</a>
                </div>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" onClick={() => handleNavigation("/Home")} className={styles.logoImg} />
                </div>
                <div className={styles.navRight}>
                     <a /* onClick={() => handleNavigation("/rankings")} */>Rankings</a>
                     <div
                        className={styles.userContainer}
                        onMouseEnter={() => setMenuOpen(true)}
                        onMouseLeave={() => setMenuOpen(false)}
                    >
                        <a className={styles.userLink}>
                            <FaUserCircle className={styles.userIcon} /> 
                            {userData?.firstName || 'User'}
                        </a>
                        {menuOpen && (
                            <div className={styles.userMenu}>
                                <a onClick={() => setSelectedSection("perfil")}>Mi Perfil</a>
                                <a onClick={handleLogout}>Cerrar Sesión</a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.adminContainer}>
                    <div className={styles.adminMenu}>
                        <ul>
                            <li 
                                className={selectedSection === "perfil" ? styles.active : ""}
                                onClick={() => setSelectedSection("perfil")}
                            >
                                Perfil
                            </li>
                            <li 
                                className={selectedSection === "peleador" ? styles.active : ""}
                                onClick={() => setSelectedSection("peleador")}
                            >
                                Peleador
                            </li>
                            <li onClick={handleLogout}>Cerrar Sesión</li>
                        </ul>
                    </div>

                    <motion.div
  className={styles.contentSection}
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {renderContent()}
</motion.div>

                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <p><a href="/Contacto">Contacto</a></p>
                    <div className={styles.socialMedia}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                    <p>© {new Date().getFullYear()} FCC. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}

export default Administrar;