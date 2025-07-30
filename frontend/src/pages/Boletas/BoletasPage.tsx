import styles from './BoletasPage.module.css';

interface BoletasPageProps {
  onBack: () => void;
}

export function BoletasPage({ onBack }: BoletasPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Volver
        </button>
        <h1 className={styles.title}>Gestión de Boletas</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.placeholder}>
          <h2>📄 Módulo de Boletas</h2>
          <p>Aquí se gestionarán las boletas del sistema.</p>
          <div className={styles.comingSoon}>
            🚧 En desarrollo...
          </div>
        </div>
      </div>
    </div>
  );
}