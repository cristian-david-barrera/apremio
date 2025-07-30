export interface User {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  dni: number;
  fecha: string;
  estado: string;
  rol: string;
  domicilio: string;
  activo: boolean;
}

export interface LoginCredentials {
  usuario: string;
  clave: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}