import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserList } from '../../components/User/UserList';
import { EditUserForm } from '../../components/User/EditUserForm';
import type { User } from '../../types/auth';
import styles from './UsuarioPage.module.css';

interface UsuarioPageProps {
  onBack: () => void;
}

export function UsuarioPage({ onBack }: UsuarioPageProps) {
  const { user: currentUser } = useAuth();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = currentUser?.rol === 'admin';

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleEditSuccess = (_updatedUser: User) => {
    setEditingUser(null);
    setRefreshKey(prev => prev + 1); 
  };

  const handleEditCancel = () => {
    setEditingUser(null);
  };

  const handleEditOwnProfile = () => {
    if (currentUser) {
      setEditingUser(currentUser);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Volver
        </button>
        <h1 className={styles.title}>
          {isAdmin ? '👥 Gestión de Usuarios' : '👤 Mi Perfil'}
        </h1>
      </div>
      
      <div className={styles.content}>
        {isAdmin ? (
          // Vista de administrador: lista de todos los usuarios
          <UserList 
            key={refreshKey}
            onEditUser={handleEditUser} 
          />
        ) : (
          // Vista de usuario común: solo su perfil
          <div className={styles.userProfile}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.userIcon}>👤</div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.userName}>
                    {currentUser?.nombre} {currentUser?.apellido}
                  </h2>
                  <p className={styles.userRole}>
                    Rol: <span className={styles.roleTag}>{currentUser?.rol}</span>
                  </p>
                </div>
              </div>
              
              <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Usuario:</span>
                  <span className={styles.detailValue}>{currentUser?.usuario}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>DNI:</span>
                  <span className={styles.detailValue}>{currentUser?.dni}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Estado:</span>
                  <span className={`${styles.detailValue} ${styles.status}`}>
                    {currentUser?.estado}
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Domicilio:</span>
                  <span className={styles.detailValue}>{currentUser?.domicilio}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha de registro:</span>
                  <span className={styles.detailValue}>
                    {currentUser?.fecha ? new Date(currentUser.fecha).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className={styles.profileActions}>
                <button 
                  onClick={handleEditOwnProfile}
                  className={styles.editProfileButton}
                >
                  ✏️ Editar Mi Perfil
                </button>
                <button className={styles.changePasswordButton}>
                  🔐 Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editingUser && (
        <EditUserForm
          user={editingUser}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
}