import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import type { User } from '../../types/auth';
import styles from './UserList.module.css';

interface UserListProps {
  onEditUser: (user: User) => void;
  onCreateUser: () => void;
}

export function UserList({ onEditUser, onCreateUser }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>❌ {error}</p>
        <button onClick={loadUsers} className={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>👥 Gestión de Usuarios</h2>
            <p className={styles.subtitle}>Total de usuarios: {users.length}</p>
          </div>
          <button 
            onClick={onCreateUser}
            className={styles.createButton}
          >
            ➕ Crear Usuario
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>DNI</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className={styles.nameCell}>
                  <div>
                    <strong>{user.nombre} {user.apellido}</strong>
                  </div>
                </td>
                <td>{user.usuario || 'N/A'}</td>
                <td>{user.dni || 'N/A'}</td>
                <td>
                  <span className={`${styles.role} ${styles[user.rol] || styles.user}`}>
                    {user.rol}
                  </span>
                </td>
                <td>
                  <span className={`${styles.status} ${user.estado === 'activo' ? styles.active : styles.inactive}`}>
                    {user.estado}
                  </span>
                </td>
                <td>
                  <span className={`${styles.active} ${user.activo ? styles.yes : styles.no}`}>
                    {user.activo ? '✅' : '❌'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => onEditUser(user)}
                    className={styles.editButton}
                  >
                    ✏️ Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}