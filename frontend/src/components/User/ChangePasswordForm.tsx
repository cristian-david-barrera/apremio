import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import styles from './EditUserForm.module.css'; // Reutilizar estilos

interface ChangePasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues
  } = useForm<ChangePasswordFormData>();

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validar que las contraseñas coincidan
      if (data.newPassword !== data.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      if (!currentUser) {
        setError('No se pudo obtener la información del usuario');
        return;
      }

      await userService.changePassword(currentUser.id, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      setSuccess('¡Contraseña cambiada exitosamente!');
      
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            🔐 Cambiar Contraseña
          </h2>
          <button onClick={onCancel} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {error && (
            <div className={styles.error}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div className={styles.success}>
              ✅ {success}
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🔒 Cambio de Contraseña</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Contraseña Actual *</label>
                <input
                  type="password"
                  className={`${styles.input} ${errors.currentPassword ? styles.inputError : ''}`}
                  {...register('currentPassword', {
                    required: 'La contraseña actual es requerida'
                  })}
                />
                {errors.currentPassword && (
                  <span className={styles.fieldError}>{errors.currentPassword.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Nueva Contraseña *</label>
                <input
                  type="password"
                  className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
                  {...register('newPassword', {
                    required: 'La nueva contraseña es requerida',
                    minLength: { 
                      value: 4, 
                      message: 'La contraseña debe tener al menos 4 caracteres' 
                    }
                  })}
                />
                {errors.newPassword && (
                  <span className={styles.fieldError}>{errors.newPassword.message}</span>
                )}
                {newPassword && newPassword.length > 0 && (
                  <div className={styles.passwordHint}>
                    💡 La contraseña será hasheada automáticamente
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Confirmar Nueva Contraseña *</label>
                <input
                  type="password"
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  {...register('confirmPassword', {
                    required: 'Confirmar la contraseña es requerido',
                    validate: (value) => {
                      const { newPassword } = getValues();
                      return value === newPassword || 'Las contraseñas no coinciden';
                    }
                  })}
                />
                {errors.confirmPassword && (
                  <span className={styles.fieldError}>{errors.confirmPassword.message}</span>
                )}
              </div>
            </div>

            <div className={styles.passwordInfo}>
              <h4 style={{ color: '#667eea', margin: '1rem 0 0.5rem 0' }}>💡 Consejos para una contraseña segura:</h4>
              <ul style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <li>Usa al menos 8 caracteres</li>
                <li>Combina letras mayúsculas y minúsculas</li>
                <li>Incluye números y símbolos</li>
                <li>Evita información personal</li>
              </ul>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.saveButton}
            >
              {loading ? (
                <>
                  <span className={styles.loading}></span>
                  Cambiando...
                </>
              ) : (
                '🔐 Cambiar Contraseña'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}