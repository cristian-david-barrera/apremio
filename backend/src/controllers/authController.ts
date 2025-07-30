import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { User, UserLogin, UserResponse } from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { usuario, clave }: UserLogin = req.body;

    if (!usuario || !clave) {
      return res.status(400).json({ 
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    const result = await pool.query(
      'SELECT * FROM public.usuario WHERE usuario = $1 AND activo = true',
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    const user: User = result.rows[0];

    // ✅ Volver a usar bcrypt para comparar contraseñas hasheadas
    const isValidPassword = await bcrypt.compare(clave, user.clave);

    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Token JWT
    const token = jwt.sign(
      {
        id: user.id, 
        usuario: user.usuario,
        rol: user.rol 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const userResponse: UserResponse = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      usuario: user.usuario,
      dni: user.dni,
      fecha: user.fecha,
      estado: user.estado,
      rol: user.rol,
      domicilio: user.domicilio,
      activo: user.activo
    };

    res.json({
      message: 'Login exitoso',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await pool.query(
      'SELECT id, nombre, apellido, usuario, dni, fecha, estado, rol, domicilio, activo FROM public.usuario WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};