import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import type { User } from '../../types/auth';
import type { UpdateUserData } from '../../services/userService';
import styles from './EditUserForm.module.css';

interface EditUserFormProps {
  user: User;
  onSuccess: (updatedUser: User) => void;
  onCancel: () => void;
}

interface FormData extends UpdateUserData {
  newPassword?: string;
}

export function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const isAdmin = currentUser?.rol === 'admin';
  const isOwnProfile = currentUser?.id === user.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>({
    defaultValues: {
      nombre: user.nombre,
      apellido: user.apellido,
      usuario: user.usuario,
      dni: user.dni,
      estado: user.estado,
      rol: user.rol,
      domicilio: user.domicilio,
      activo: user.activo,
      newPassword: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const updateData: Partial<UpdateUserData> = {
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        estado: data.estado,
        domicilio: data.domicilio
      };

      if (isAdmin) {
        updateData.usuario = data.usuario;
        updateData.rol = data.rol;
        updateData.activo = data.activo;
        
        if (data.newPassword && data.newPassword.trim()) {
          updateData.newPassword = data.newPassword;
        }
      }

      const response = await userService.updateUser(user.id, updateData);
      setSuccess(response.message);
      
      setTimeout(() => {
        onSuccess(response.user);
      }, 1000);

    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  const newPassword = watch('newPassword');

  const modalContent = (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            ✏️ Editar {isOwnProfile ? 'Mi Perfil' : 'Usuario'}
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
                <label className={styles.label}>Nombre</label>
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
                <label className={styles.label}>Apellido</label>
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
                <label className={styles.label}>DNI</label>
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
                <label className={styles.label}>Domicilio</label>
                <input
                  type="text"
                  className={`${styles.input} ${errors.domicilio ? styles.inputError : ''}`}
                  {...register('domicilio', {
                    required: 'El domicilio es requerido'
                  })}
                />
                {errors.domicilio && (
                  <span className={styles.fieldError}>{errors.domicilio.message}</span>
                )}
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
                {errors.estado && (
                  <span className={styles.fieldError}>{errors.estado.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Configuración de cuenta (solo admin) */}
          {isAdmin && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>⚙️ Configuración de Cuenta</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Usuario</label>
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
                  {errors.rol && (
                    <span className={styles.fieldError}>{errors.rol.message}</span>
                  )}
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
          )}

          {/* Cambio de contraseña (solo admin) */}
          {isAdmin && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>🔐 Cambiar Contraseña</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nueva Contraseña</label>
                  <input
                    type="password"
                    className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
                    placeholder="Dejar vacío para mantener la actual"
                    {...register('newPassword', {
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
              </div>
            </div>
          )}

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
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}