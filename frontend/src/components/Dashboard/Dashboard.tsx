import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

interface DashboardCardProps {
  title: string;
  icon: string;
  onClick: () => void;
  color: string;
}

function DashboardCard({ title, icon, onClick, color }: DashboardCardProps) {
  return (
    <div 
      className={`${styles.card} ${styles[color]}`}
      onClick={onClick}
    >
      <div className={styles.cardIcon}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardArrow}>→</div>
    </div>
  );
}

interface DashboardProps {
  onNavigateToPage: (page: string) => void;
}

export function Dashboard({ onNavigateToPage }: DashboardProps) {
  const { user } = useAuth();

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>
          ¡Bienvenido, {user?.nombre}!
        </h1>
        <p className={styles.welcomeSubtitle}>
          ¿Qué deseas hacer hoy?
        </p>
      </div>

      <div className={styles.cardsContainer}>
        <DashboardCard
          title="BOLETAS"
          icon="📄"
          color="blue"
          onClick={() => onNavigateToPage('boletas')}
        />
        
        <DashboardCard
          title="USUARIO"
          icon="👤"
          color="green"
          onClick={() => onNavigateToPage('usuario')}
        />
      </div>
    </div>
  );
}