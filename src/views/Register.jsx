import { useState } from 'react';
import styles from './../css/Register.module.css'; 
import { useNavigate } from 'react-router-dom';
import logo from './../assets/FFC_logo.png'; 
import { Snackbar, Alert } from '@mui/material';

function Register() {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secret, setSecret] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleCloseSnackbar = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true); // <-- comienza carga
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            if (response.ok) {
                setQrCodeUrl(data.qrCodeUrl);
                setSecret(data.secret);
                setIsRegistered(true);
                setSuccessMessage("Cuenta registrada con éxito. Verifica tu identidad.");
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setErrorMessage("Error al registrar usuario.");
        } finally {
            setIsLoading(false); // <-- termina carga
        }
    };
    

    const handleVerifyToken = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/verify`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: formData.email, 
                    token: verificationCode
                }),
            });
    
            const data = await response.json();
            
            if (response.ok) {
                setSuccessMessage("✅ Cuenta verificada con éxito. Ahora puedes iniciar sesión.");
                setTimeout(() => navigate('/Login'), 2000);
            } else {
                setErrorMessage(`❌ Error: ${data.message || "Código inválido o expirado"}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setErrorMessage("🚨 Error al conectar con el servidor. Intenta nuevamente.");
        }
    };

    return (
        <div className={styles.registerPage}>
            {/* Snackbars */}
            <Snackbar open={!!errorMessage} autoHideDuration={1500} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="error" onClose={handleCloseSnackbar} sx={{ width: '100%' }}>{errorMessage}</Alert>
            </Snackbar>

            <Snackbar open={!!successMessage} autoHideDuration={1500} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="success" onClose={handleCloseSnackbar} sx={{ width: '100%' }}>{successMessage}</Alert>
            </Snackbar>


    
    
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>ATRÁS</button>
                </div>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" className={styles.logoImg} />
                </div>
                <div className={styles.headerRight}>
                    <a href="/Login" className={styles.createAccount}>INICIAR SESIÓN</a>
                </div>
            </header>

            <main className={styles.mainContent}>
                <h2>{isRegistered ? 'Verificar Cuenta' : 'Registro'}</h2>
                

                {!isRegistered ? (
                    <form className={styles.registerForm} onSubmit={handleRegister}>
                        <div className={styles.formGroup}>
                            <label htmlFor="firstName">Nombre</label>
                            <input 
                                id="firstName" 
                                type="text" 
                                placeholder="Ingresa tu nombre" 
                                value={formData.firstName}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="lastName">Apellidos</label>
                            <input 
                                id="lastName" 
                                type="text" 
                                placeholder="Ingresa tus apellidos" 
                                value={formData.lastName}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Correo electrónico</label>
                            <input 
                                id="email" 
                                type="email" 
                                placeholder="Ingresa tu correo" 
                                value={formData.email}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Contraseña</label>
                            <input 
                                id="password" 
                                type="password" 
                                placeholder="Ingresa tu contraseña" 
                                value={formData.password}
                                onChange={handleChange}
                                minLength="3"
                                required 
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.continueButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registrando...' : 'Continuar'}
                        </button>
                    </form>
                ) : (
                    <div className={styles.verificationSection}>
                        <h3>Configura Google Authenticator</h3>
                        <p>Escanea el QR con la app o ingresa el código manualmente:</p>
                        
                        {/* Mostrar QR */}
                        {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className={styles.qrCode} />}
                        
                        {/* Mostrar código secreto (opcional) */}
                        <div className={styles.secretCode}>
                            <p>Código secreto: <strong>{secret}</strong></p>
                        </div>

                        {/* Input para el código de verificación */}
                        <div className={styles.formGroup}>
                            <label htmlFor="verificationCode">Código de Google Authenticator</label>
                            <input 
                                type="text" 
                                placeholder="Ingresa el código de 6 dígitos" 
                                value={verificationCode} 
                                onChange={(e) => setVerificationCode(e.target.value)} 
                                required 
                            />
                            <button className={styles.continueButton} onClick={handleVerifyToken}>
                                Verificar
                            </button>
                        </div>
                    </div>
                )}

                <p className={styles.loginLink}>
                    ¿Ya tienes una cuenta?{' '}
                    <a onClick={() => navigate('/Login')} style={{ cursor: 'pointer', color: '#1890ff' }}>
                        Inicia sesión
                    </a>
                </p>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <p><a href="/Contacto">Contacto</a></p>
                    <div className={styles.socialMedia}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                    <p>© {new Date().getFullYear()} FFC. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}

export default Register;