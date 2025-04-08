import { useState } from 'react';
import styles from './../css/ForgotPassword.module.css'; 
import { useNavigate } from 'react-router-dom';
import logo from './../assets/FFC_logo.png'; 
import { Snackbar, Alert } from '@mui/material';


function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Ingresar email, 2: Ingresar código, 3: Nueva contraseña
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tempToken, setTempToken] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    

    const handleCloseSnackbar = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    
    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Se ha enviado un código a tu correo");
                setStep(2);
            } else {
                setErrorMessage(data.message);
            }
            
        } catch (error) {
            setErrorMessage("Error al procesar la solicitud");
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-reset-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
    
            const data = await response.json();
            if (response.ok) {
                setTempToken(data.tempToken);
                setStep(3);
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage("Error al verificar el código");
        }
    };

    const handleResetPassword = async () => {
            
        if (newPassword !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden");
            return;
        }
        
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    tempToken,       // Token temporal JWT
                    newPassword     // Nueva contraseña en texto plano
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Contraseña actualizada correctamente");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setErrorMessage(data.message);
            }
            
        } catch (error) {
            setErrorMessage("Error al actualizar la contraseña");
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <form onSubmit={handleSubmitEmail} className={styles.forgotPasswordForm}>
                        <div className={styles.formGroup}>
                        <p className={styles.instructions}>
                    Escribe la dirección de correo electrónico de tu cuenta y te enviaremos un mensaje para restablecer la contraseña.
                </p>
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
                        <button type="submit" className={styles.submitButton}>Enviar código</button>
                    </form>
                );
            case 2:
                return (
                    <div className={styles.codeVerification}>
                        <p>Ingresa el código que recibiste en tu correo</p>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Código de 6 dígitos"
                        />
                        <button onClick={handleVerifyCode} className={styles.submitButton}>Verificar código</button>
                    </div>
                );
            case 3:
                return (
                    <div className={styles.newPasswordForm}>
                        <div className={styles.formGroup}>
                            <label>Nueva contraseña</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Ingresa nueva contraseña"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Confirmar contraseña</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirma tu contraseña"
                                required
                            />
                        </div>
                        <button onClick={handleResetPassword} className={styles.submitButton}>Actualizar contraseña</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.forgotPasswordPage}>
            <Snackbar open={!!errorMessage} autoHideDuration={1500} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
    <Alert severity="error" onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
        {errorMessage}
    </Alert>
</Snackbar>

<Snackbar open={!!successMessage} autoHideDuration={1500} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
    <Alert severity="success" onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
        {successMessage}
    </Alert>
</Snackbar>

            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>ATRAS</button>
                </div>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" className={styles.logoImg} />
                </div>
            </header>

            <main className={styles.mainContent}>
                <h2>{
                    step === 1 ? '¿Olvidaste tu contraseña?' : 
                    step === 2 ? 'Verifica tu identidad' : 
                    'Crea una nueva contraseña'
                }</h2>
                
                
                {renderStep()}
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

export default ForgotPassword;