import { useEffect } from "react";
import styles from "../css/Alert.module.css";

function Alert({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(); // Cierra la alerta después de 3 segundos
        }, 3000);
        
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.alert}>
            <p>{message}</p>
        </div>
    );
}

export default Alert;
