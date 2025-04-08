import { useState, useEffect } from 'react';
import styles from './../css/Peleadores.module.css'; 
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaWeight, FaRulerVertical, FaFistRaised } from "react-icons/fa"; 
import logo from './../assets/FFC_logo.png'; 
import { Snackbar, Alert } from "@mui/material";
import { motion } from 'framer-motion'; 

function Peleadores() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [fighters, setFighters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            setShowAlert(true);
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
    
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setFirstName(payload.firstName);
            
            // Cargar lista de peleadores
            fetchFighters();
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            setShowAlert(true);
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [navigate]);

    const fetchFighters = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/peleadores`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setFighters(data);
            } else {
                console.error("Error cargando peleadores:", response.status);
            }
        } catch (error) {
            console.error("Error de red:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMenuOpen(false); 
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); 
        navigate("/login"); 
    };

    const renderFighterCards = () => {
        if (loading) {
            return <div className={styles.loading}>Cargando peleadores...</div>;
        }
    
        if (fighters.length === 0) {
            return <div className={styles.noFighters}>No hay peleadores registrados</div>;
        }
    
        return (
            <div className={styles.fightersGrid}>
                {fighters.map((fighter, index) => (
                    <motion.div
                        key={fighter._id}
                        className={styles.fighterCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={styles.fighterImage}>
                            {fighter.fotoPerfil ? (
                                <img src={fighter.fotoPerfil} alt={fighter.nombre} />
                            ) : (
                                <div className={styles.defaultImage}>
                                    <FaUserCircle size={80} />
                                </div>
                            )}
                        </div>
                        <div className={styles.fighterInfo}>
                            <h3>{fighter.nombre}</h3>
                            <div className={styles.fighterStats}>
                                <div>
                                    <FaWeight className={styles.icon} />
                                    <span>{fighter.peso} kg</span>
                                </div>
                                <div>
                                    <FaRulerVertical className={styles.icon} />
                                    <span>{fighter.estatura} cm</span>
                                </div>
                                <div>
                                    <FaFistRaised className={styles.icon} />
                                    <span>{fighter.estiloCombate}</span>
                                </div>
                            </div>
                            <div className={styles.fighterRecord}>
                                <span>Récord: {fighter.record || '0-0-0'}</span>
                            </div>
                            <button 
                                className={styles.viewButton}
                                // onClick={() => navigate(`/peleador-detalle/${fighter._id}`)}
                            >
                                Ver Detalles
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
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
            
            <header className={styles.header}>
                <div className={styles.navLeft}>
                    <a onClick={() => handleNavigation("/eventos")}>Eventos</a>
                    <a onClick={() => handleNavigation("/peleadores")}>Peleadores</a>
                </div>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" onClick={() => handleNavigation("/Home")} className={styles.logoImg} />
                </div>
                <div className={styles.navRight}>
                    <a onClick={() => handleNavigation("/rankings")}>Rankings</a>
                    <div 
                        className={styles.userContainer}
                        onMouseEnter={() => setMenuOpen(true)}
                        onMouseLeave={() => setMenuOpen(false)}
                    >
                        <a className={styles.userLink}>
                            <FaUserCircle className={styles.userIcon} /> {firstName}
                        </a>
                        {menuOpen && (
                            <div className={styles.userMenu}>
                                <a onClick={() => handleNavigation("/administrar")}>Administrar</a>
                                <a onClick={handleLogout}>Cerrar Sesión</a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <h1 className={styles.title}>Peleadores</h1>
                {renderFighterCards()}
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

export default Peleadores;