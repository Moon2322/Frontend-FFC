import { useNavigate } from 'react-router-dom';
import styles from './../css/Lost.module.css'; // Importar como módulo

const Lost = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Regresa a la página anterior en el historial
    };

    return (
        <div className={styles.lostPage}>
            <div className={styles.errorContainer}>
                <h1 className={styles.errorCode}>404</h1>
                <p className={styles.errorMessage}>Página no encontrada</p>
                <button className={styles.goBackButton} onClick={handleGoBack}>
                    Volver atrás
                </button>
            </div>
        </div>
    );
};

export default Lost;