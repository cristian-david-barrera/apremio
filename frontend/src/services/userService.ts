import axios from 'axios';
import type { User } from '../types/auth';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UpdateUserData {
  nombre: string;
  apellido: string;
  usuario: string;
  dni: number;
  estado: string;
  rol: string;
  domicilio: string;
  activo: boolean;
  newPassword?: string;
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async updateUser(id: number, userData: Partial<UpdateUserData>): Promise<{ message: string; user: User }> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async changePassword(id: number, passwordData: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.put(`/users/${id}/change-password`, passwordData);
    return response.data;
  }
};