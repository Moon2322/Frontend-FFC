import { useState, useEffect } from 'react';
import styles from './../css/Home.module.css'; 
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaWeight, FaRulerVertical, FaFistRaised } from "react-icons/fa"; 
import logo from './../assets/FFC_logo.png'; 
import Pelea from './../assets/pelea2.jpeg'; 
import { motion } from 'framer-motion'; 
import { Snackbar, Alert } from "@mui/material";
import { getDefaultProfileImage } from '../firebase/firebase';


function Home() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [latestFighters, setLatestFighters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [defaultImage, setDefaultImage] = useState('');


    useEffect(() => {
        const loadDefaultImage = async () => {
            try {
                const url = await getDefaultProfileImage();
                setDefaultImage(url);
            } catch (error) {
                console.error("Error cargando imagen predeterminada:", error);
            }
        };
        loadDefaultImage();
    }, []);


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
            fetchLatestFighters();
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            setShowAlert(true);
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [navigate]);

    const fetchLatestFighters = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/latest`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setLatestFighters(data);
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

        if (latestFighters.length === 0) {
            return <div className={styles.noFighters}>No hay peleadores registrados</div>;
        }

        return latestFighters.map((fighter, index) => (
            <motion.div 
                key={fighter._id} 
                className={styles.fighterCard}
                initial={{ opacity: 0, scale: 0.5 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
            >
                                   <div className={styles.fighterImage}>
                                        <img 
                  src={fighter.userId?.profileImage || defaultImage}
                  alt={fighter.nombre}
                  onError={async (e) => {
                    e.target.src = await getDefaultProfileImage();
                  }}
                />
                </div>
                <div className={styles.fighterInfo}>
                    <h4>{fighter.nombre}</h4>
                    <div className={styles.fighterStats}>
                        <div>
                            <FaWeight className={styles.icon} />
                            <span>{fighter.peso} kg</span>
                        </div>
                        <div>
                            <FaRulerVertical className={styles.icon} />
                            <span>{fighter.estatura} cm</span>
                        </div>
                    </div>
                    <div className={styles.fighterStyle}>
                        <FaFistRaised className={styles.icon} />
                        <span>{fighter.estiloCombate}</span>
                    </div>
                </div>
            </motion.div>
        ));
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
                     <a /* onClick={() => handleNavigation("/rankings")} */>Rankings</a>
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

            <motion.div 
                className={styles.heroImage}
                initial={{ opacity: 0, y: 100 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <img src={Pelea} alt="Última pelea" className={styles.heroImg} />
                <div className={styles.heroText}>
                    <h2>Última pelea</h2>
                    <p>
                        No te pierdas los highlights y los momentos más intensos de esta batalla épica.
                    </p>
                </div>
            </motion.div>

            <motion.div 
                className={styles.fightersSection}
                initial={{ opacity: 0, y: 100 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <h3>Peleadores más recientes</h3>
                <div className={styles.fightersGrid}>
                    {renderFighterCards()}
                </div>
            </motion.div>

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

export default Home;