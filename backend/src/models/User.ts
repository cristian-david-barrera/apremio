export interface User {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  clave: string;
  dni: number;
  fecha: Date;
  estado: string;
  rol: string;
  domicilio: string;
  activo: boolean;
}

export interface UserLogin {
  usuario: string;
  clave: string;
}

export interface UserResponse {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  dni: number;
  fecha: Date;
  estado: string;
  rol: string;
  domicilio: string;
  activo: boolean;
}