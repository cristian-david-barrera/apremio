
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.navLeft}>
          <h2 className={styles.logo}>Sistema de Gestión</h2>
        </div>
        
        <div className={styles.navRight}>
          <span className={styles.welcomeText}>
            Bienvenido, <strong>{user?.nombre} {user?.apellido}</strong>
          </span>
          <span className={styles.userRole}>({user?.rol})</span>
          <button 
            onClick={logout}
            className={styles.logoutButton}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}