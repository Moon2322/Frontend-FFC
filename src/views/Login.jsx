import styles from './../css/Login.module.css';
import logo from './../assets/FFC_logo.png'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';


function Login() {
    const navigate = useNavigate();

    const goToRegister = () => {
        navigate("/Register");
    };
    
    const [show2FA, setShow2FA] = useState(false);
    const [tempToken, setTempToken] = useState('');
    const [twoFACode, setTwoFACode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleCloseSnackbar = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };


    
    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                if (data.requires2FA) {
                    setTempToken(data.tempToken);
                    setShow2FA(true);
                } else {
                    localStorage.setItem("token", data.token);
                    navigate("/Home");
                }
            } else {
                setErrorMessage(data.message);
            }
            
        } catch (error) {
            console.error("Error en el login:", error);
            setErrorMessage("Error al iniciar sesión.");
        }
    };
    
    const handle2FAVerification = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-2fa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    tempToken,
                    code: twoFACode 
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem("token", data.token);
                navigate("/Home");
            } else {
                setErrorMessage(data.message);
            }
            
        } catch (error) {
            console.error("Error en verificación 2FA:", error);
            setErrorMessage("Error al verificar código 2FA");
        }
    };
    

    return (
                  <div className={styles.loginPage}>
                    <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
    <Alert severity="error" onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
        {errorMessage}
    </Alert>
</Snackbar>

<Snackbar open={!!successMessage} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
    <Alert severity="success" onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
        {successMessage}
    </Alert>
</Snackbar>

                    <header className={styles.header}>
                    <div className={styles.headerRight}>
                        <a href="/Register" className={styles.createAccount}>CREAR CUENTA</a>
                    </div>
                    <div className={styles.logo}>
                        <img src={logo} alt="Logo" className={styles.logoImg} />
                    </div>
                    </header>

               <main className={styles.mainContent}>
                <h2>Iniciar sesión</h2>

                {!show2FA ? (
                <form className={styles.loginForm} onSubmit={handleLogin}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Correo electrónico</label>
                        <input 
                            id="email" 
                            type="email" 
                            placeholder="Ingresa tu correo" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            id="password" 
                            type="password" 
                            placeholder="Ingresa tu contraseña" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className={styles.continueButton}>Continuar</button>
                </form>
            ) : (
                <div className={styles.twoFAContainer}>
                    <h3>Verificación en Dos Pasos</h3>
                    <p>Ingresa el código de Google Authenticator</p>
                    <input
                        type="text"
                        placeholder="Código de 6 dígitos"
                        value={twoFACode}
                        onChange={(e) => setTwoFACode(e.target.value)}
                        maxLength={6}
                    />
                    <button onClick={handle2FAVerification}  className={styles.continueButton}>Verificar</button>
                </div>
            )}
    

                <div className={styles.divider}>
                    <span>O</span>
                </div>

{/*                 <button className={styles.googleButton}>Continuar con Google</button>
 */}
                <p className={styles.helpText}>
                    ¿No puedes iniciar sesión?{' '}
                    <a href="/Forgot_password" style={{ cursor: 'pointer', color: '#1890ff' }}>
                        Recuperar contraseña
                    </a>
                </p>

                <p className={styles.registerLink}>
                    ¿No tienes una cuenta?{' '}
                    <a onClick={goToRegister} style={{ cursor: 'pointer', color: '#1890ff' }}>
                        Crear cuenta
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

export default Login;