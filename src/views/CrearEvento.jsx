import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './../css/CrearEvento.module.css';
import { FaUserCircle, FaWeightHanging, FaCalendarAlt, FaUsers } from "react-icons/fa";
import logo from './../assets/FFC_logo.png';
import { Snackbar, Alert } from "@mui/material";
import { motion } from 'framer-motion';

const useAuthAndFetchEvents = (navigate, setFirstName, setUserRole, setShowAlert, fetchEvents) => {
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
      setUserRole(payload.rol || 'usuario');
      fetchEvents();
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      setShowAlert(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);
};

const useFetchPeleadores = (setPeleadores) => {
  useEffect(() => {
    const fetchPeleadores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/eventos/peleadores`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setPeleadores(data);
      } catch (error) {
        console.error("Error fetching peleadores:", error);
      }
    };
    fetchPeleadores();
  }, []);
};

function CrearEvento() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [userRole, setUserRole] = useState('usuario');
  const [alertMessage, setAlertMessage] = useState('');
const [alertSeverity, setAlertSeverity] = useState('success');
const [submitAlertOpen, setSubmitAlertOpen] = useState(false);

  const [peleadores, setPeleadores] = useState([]);
  const [formData, setFormData] = useState({
    fecha: '',
    pesoCategoria: '',
    peleador1Id: '',
    peleador2Id: '',
    rondas: 3
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/eventos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  // 🧠 Ejecutamos los hooks personalizados
  useAuthAndFetchEvents(navigate, setFirstName, setUserRole, setShowAlert, fetchEvents);
  useFetchPeleadores(setPeleadores);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/eventos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        });
      
        if (response.ok) {
          setAlertMessage('Evento creado exitosamente.');
          setAlertSeverity('success');
          setSubmitAlertOpen(true);
          setTimeout(() => navigate('/eventos'), 1500);
        } else {
          const errorData = await response.json();
          setAlertMessage(errorData.message || 'Error al crear el evento.');
          setAlertSeverity('error');
          setSubmitAlertOpen(true);
        }
      } catch (error) {
        console.error("Error creating event:", error);
        setAlertMessage('Error al conectar con el servidor.');
        setAlertSeverity('error');
        setSubmitAlertOpen(true);
      }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
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
  open={submitAlertOpen} 
  autoHideDuration={2000} 
  onClose={() => setSubmitAlertOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert 
    onClose={() => setSubmitAlertOpen(false)} 
    severity={alertSeverity} 
    sx={{ width: '100%' }}
  >
    {alertMessage}
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

      <div className={styles.container}>
        <h2>Crear Nuevo Evento</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label><FaCalendarAlt /> Fecha y Hora:</label>
            <input
              type="datetime-local"
              required
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label><FaWeightHanging /> Categoría de Peso:</label>
            <input
              type="text"
              required
              placeholder="Ej: Peso Wélter"
              onChange={(e) => setFormData({...formData, pesoCategoria: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label><FaUsers /> Peleador 1:</label>
            <select 
              required
              onChange={(e) => setFormData({...formData, peleador1Id: e.target.value})}
            >
              <option value="">Seleccionar</option>
              {peleadores.map(p => (
                <option key={p._id} value={p._id}>
                  {p.nombre} ({p.peso} kg)
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label><FaUsers /> Peleador 2:</label>
            <select 
              required
              onChange={(e) => setFormData({...formData, peleador2Id: e.target.value})}
            >
              <option value="">Seleccionar</option>
              {peleadores.map(p => (
                <option key={p._id} value={p._id}>
                  {p.nombre} ({p.peso} kg)
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            Crear Evento
          </button>
        </form>
      </div>

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

export default CrearEvento;
