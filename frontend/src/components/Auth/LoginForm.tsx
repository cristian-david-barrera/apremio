import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginForm.module.css';

interface LoginFormData {
  usuario: string;
  clave: string;
}

export function LoginForm() {
  const { login, isLoading, isAuthenticated, user, logout } = useAuth();
  const [loginError, setLoginError] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('');
      await login(data);
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(
        error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      );
    }
  };

  // Si ya está autenticado, mostrar información del usuario
  if (isAuthenticated && user) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>¡Bienvenido!</h2>
          
          <div className={styles.userInfo}>
            <h3>{user.nombre} {user.apellido}</h3>
            <p><strong>Usuario:</strong> {user.usuario}</p>
            <p><strong>DNI:</strong> {user.dni}</p>
            <p><strong>Rol:</strong> {user.rol}</p>
            <p><strong>Estado:</strong> {user.estado}</p>
          </div>

          <button 
            onClick={logout}
            className={styles.logoutButton}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
        
        {loginError && (
          <div className={styles.generalError}>
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="usuario" className={styles.label}>
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              className={`${styles.input} ${errors.usuario ? styles.error : ''}`}
              {...register('usuario', {
                required: 'El usuario es requerido',
                minLength: {
                  value: 3,
                  message: 'El usuario debe tener al menos 3 caracteres'
                }
              })}
            />
            {errors.usuario && (
              <div className={styles.errorMessage}>
                {errors.usuario.message}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="clave" className={styles.label}>
              Contraseña
            </label>
            <input
              id="clave"
              type="password"
              className={`${styles.input} ${errors.clave ? styles.error : ''}`}
              {...register('clave', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 4,
                  message: 'La contraseña debe tener al menos 4 caracteres'
                }
              })}
            />
            {errors.clave && (
              <div className={styles.errorMessage}>
                {errors.clave.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.loginButton}
          >
            {isLoading ? (
              <>
                <span className={styles.loading}></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}