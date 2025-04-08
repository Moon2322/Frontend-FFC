import styles from './../css/Contact.module.css'; 
import { useNavigate } from 'react-router-dom';
import logo from './../assets/FFC_logo.png';

function Contact() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
     };

    return (
        <div className={styles.contactPage}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backButton} onClick={handleGoBack}>ATRÁS</button>
                </div>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" className={styles.logoImg} />
                </div>
            </header>

            <main className={styles.mainContent}>
                <h2 className={styles.title}>Comunícate con atención al cliente</h2>

                <div className={styles.contactContainer}>
                    <div className={styles.leftSection}>
                        <h3>Llámanos</h3>
                        <p>111-222-3334</p>
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.rightSection}>
                        <h3>Mándanos correo</h3>
                        <p>soporte@FFC.com</p>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
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

export default Contact;