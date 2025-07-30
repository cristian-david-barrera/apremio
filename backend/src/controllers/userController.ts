import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { User, UserResponse } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Obtener todos los usuarios (solo admin)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    // Verificar que el usuario es admin
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ 
        message: 'No tienes permisos para ver todos los usuarios' 
      });
    }

    const result = await pool.query(
      'SELECT id, nombre, apellido, usuario, dni, fecha, estado, rol, domicilio, activo FROM public.usuario ORDER BY nombre, apellido'
    );

    console.log('🔍 Datos desde BD:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

// Actualizar usuario
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, usuario, dni, estado, rol, domicilio, activo, newPassword } = req.body;
    const currentUserId = req.user.id;
    const currentUserRol = req.user.rol;

    // Verificar permisos
    if (currentUserRol !== 'admin' && parseInt(id) !== currentUserId) {
      return res.status(403).json({ 
        message: 'No tienes permisos para editar este usuario' 
      });
    }

    // Campos básicos que todos pueden editar
    const fieldsToUpdate = ['nombre', 'apellido', 'dni', 'estado', 'domicilio'];
    const values = [nombre, apellido, dni, estado, domicilio];
    
    let query = 'UPDATE public.usuario SET nombre = $1, apellido = $2, dni = $3, estado = $4, domicilio = $5';
    let paramIndex = 6;

    // Solo admin puede cambiar usuario, rol y estado activo
    if (currentUserRol === 'admin') {
      query += `, usuario = $${paramIndex}, rol = $${paramIndex + 1}, activo = $${paramIndex + 2}`;
      values.push(usuario, rol, activo);
      paramIndex += 3;

      // Si hay nueva contraseña, hashearla y actualizarla
      if (newPassword && newPassword.trim()) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        query += `, clave = $${paramIndex}`;
        values.push(hashedPassword);
        paramIndex++;
      }
    }

    query += ` WHERE id = $${paramIndex} RETURNING id, nombre, apellido, usuario, dni, fecha, estado, rol, domicilio, activo`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      message: 'Usuario actualizado correctamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};


// Cambiar contraseña
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const currentUserId = req.user.id;
    const currentUserRol = req.user.rol;

    // Verificar permisos
    if (currentUserRol !== 'admin' && parseInt(id) !== currentUserId) {
      return res.status(403).json({ 
        message: 'No tienes permisos para cambiar la contraseña de este usuario' 
      });
    }

    // Obtener usuario actual
    const userResult = await pool.query(
      'SELECT clave FROM public.usuario WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    const user = userResult.rows[0];

    // Si no es admin, verificar contraseña actual
    if (currentUserRol !== 'admin') {
      const isValidPassword = await bcrypt.compare(currentPassword, user.clave);
      if (!isValidPassword) {
        return res.status(400).json({ 
          message: 'La contraseña actual es incorrecta' 
        });
      }
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await pool.query(
      'UPDATE public.usuario SET clave = $1 WHERE id = $2',
      [hashedPassword, id]
    );

    res.json({
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};