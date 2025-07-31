import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { userService } from '../../services/userService';
import type { User } from '../../types/auth';
import type { CreateUserData } from '../../services/userService';
import styles from './EditUserForm.module.css'; // Reutilizar los mismos estilos

interface CreateUserFormProps {
  onSuccess: (newUser: User) => void;
  onCancel: () => void;
}

export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CreateUserData>({
    defaultValues: {
      nombre: '',
      apellido: '',
      usuario: '',
      dni: 0,
      estado: 'activo',
      rol: 'user',
      domicilio: '',
      activo: true,
      password: ''
    }
  });

  const onSubmit = async (data: CreateUserData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await userService.createUser(data);
      setSuccess(response.message);
      
      setTimeout(() => {
        onSuccess(response.user);
      }, 1000);

    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const password = watch('password');

  const modalContent = (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            ➕ Crear Nuevo Usuario
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

          {/* Información básica */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>👤 Información Personal</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nombre *</label>
                <input
                  type="text"
                  className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
                  {...register('nombre', {
                    required: 'El nombre es requerido',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                  })}
                />
                {errors.nombre && (
                  <span className={styles.fieldError}>{errors.nombre.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Apellido *</label>
                <input
                  type="text"
                  className={`${styles.input} ${errors.apellido ? styles.inputError : ''}`}
                  {...register('apellido', {
                    required: 'El apellido es requerido',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                  })}
                />
                {errors.apellido && (
                  <span className={styles.fieldError}>{errors.apellido.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>DNI *</label>
                <input
                  type="number"
                  className={`${styles.input} ${errors.dni ? styles.inputError : ''}`}
                  {...register('dni', {
                    required: 'El DNI es requerido',
                    min: { value: 1000000, message: 'DNI inválido' }
                  })}
                />
                {errors.dni && (
                  <span className={styles.fieldError}>{errors.dni.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>EMAIL</label>
                <input
                  type="text"
                  className={`${styles.input} ${errors.domicilio ? styles.inputError : ''}`}
                  {...register('domicilio')}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select
                  className={`${styles.input} ${errors.estado ? styles.inputError : ''}`}
                  {...register('estado', { required: 'El estado es requerido' })}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="suspendido">Suspendido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configuración de cuenta */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>⚙️ Configuración de Cuenta</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Usuario *</label>
                <input
                  type="text"
                  className={`${styles.input} ${errors.usuario ? styles.inputError : ''}`}
                  {...register('usuario', {
                    required: 'El usuario es requerido',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                  })}
                />
                {errors.usuario && (
                  <span className={styles.fieldError}>{errors.usuario.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Rol</label>
                <select
                  className={`${styles.input} ${errors.rol ? styles.inputError : ''}`}
                  {...register('rol', { required: 'El rol es requerido' })}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    {...register('activo')}
                  />
                  Usuario activo
                </label>
              </div>
            </div>
          </div>

          {/* Contraseña */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🔐 Contraseña</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Contraseña *</label>
                <input
                  type="password"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: { 
                      value: 4, 
                      message: 'La contraseña debe tener al menos 4 caracteres' 
                    }
                  })}
                />
                {errors.password && (
                  <span className={styles.fieldError}>{errors.password.message}</span>
                )}
                {password && password.length > 0 && (
                  <div className={styles.passwordHint}>
                    💡 La contraseña será hasheada automáticamente
                  </div>
                )}
              </div>
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
                  Creando...
                </>
              ) : (
                'Crear Usuario'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}