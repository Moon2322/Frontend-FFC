import { useState, useEffect } from 'react';
import styles from './../css/Eventos.module.css'; 
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaWeight, FaCalendarAlt, FaFireAlt } from "react-icons/fa"; 
import logo from './../assets/FFC_logo.png'; 
import { Snackbar, Alert } from "@mui/material";
import { motion } from 'framer-motion'; 

function Eventos() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [userRole, setUserRole] = useState('usuario');



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
            setUserRole(payload.rol || 'usuario'); // 🆕 Obtener el rol
            fetchEvents();
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            setShowAlert(true);
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [navigate]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/eventos`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setEvents(data);
          }
        } finally {
          setLoading(false);
        }
      };
    
      const generateEvents = async () => {
        setGenerating(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/eventos/generar`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            await fetchEvents(); // Recargar los eventos
            alert('Nuevos eventos generados exitosamente');
          }
        } finally {
          setGenerating(false);
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const renderEventCards = () => {
        if (loading) {
            return <div className={styles.loading}>Cargando eventos...</div>;
        }

        if (events.length === 0) {
            return <div className={styles.noEvents}>No hay eventos programados</div>;
        }

        return events.map((event, index) => (
            <motion.div 
                key={event._id} 
                className={styles.eventCard}
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: index * 0.1 }}
            >
<div className={styles.eventHeader}>
  <h3>Combate de {event.pesoCategoria}</h3> {/* Corregido */}
  <div className={styles.eventDate}>
    <FaCalendarAlt className={styles.icon} />
    <span>{formatDate(event.fecha)}</span> {/* Asegúrate que sea event.fecha */}
  </div>
</div>

<div className={styles.fighter}>
  <div className={styles.fighterImage}>
    {event.peleador1.fotoPerfil ? (
      <img src={event.peleador1.fotoPerfil} alt={event.peleador1.nombre} />
    ) : (
      <div className={styles.defaultImage}>
        <FaUserCircle size={40} />
      </div>
    )}
  </div>
  <div className={styles.fighterInfo}>
    <h4>{event.peleador1.nombre}</h4>
    <div className={styles.fighterStats}>
      <div>
        <FaWeight className={styles.icon} />
        <span>{event.peleador1.peso} kg</span>
      </div>
      <div>
        <FaFireAlt className={styles.icon} />
        <span>{event.peleador1.estiloCombate}</span>
      </div>
    </div>
  </div>

                    
                    <div className={styles.vsBadge}>VS</div>
                    
                    <div className={styles.fighter}>
  <div className={styles.fighterImage}>
    {event.peleador1.fotoPerfil ? (
      <img src={event.peleador1.fotoPerfil} alt={event.peleador1.nombre} />
    ) : (
      <div className={styles.defaultImage}>
        <FaUserCircle size={40} />
      </div>
    )}
  </div>
  <div className={styles.fighterInfo}>
    <h4>{event.peleador1.nombre}</h4>
    <div className={styles.fighterStats}>
      <div>
        <FaWeight className={styles.icon} />
        <span>{event.peleador1.peso} kg</span>
      </div>
      <div>
        <FaFireAlt className={styles.icon} />
        <span>{event.peleador1.estiloCombate}</span>
      </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button 
                    className={styles.detailsButton}
/*                     onClick={() => navigate(`/evento-detalle/${event._id}`)}
 */                >
                    Ver Detalles
                </button>
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
        <div className={styles.headerSection}>
          <h1>Próximos Eventos</h1>
{userRole === 'admin' && (
  <button 
    onClick={() => navigate('/CrearEvento')}
    className={styles.generateButton}
  >
    Crear Evento Manualmente
  </button>
)}
        </div>
                <div className={styles.eventsContainer}>
                    {renderEventCards()}
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

export default Eventos;