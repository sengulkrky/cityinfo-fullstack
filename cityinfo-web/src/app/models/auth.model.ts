export interface RegisterRequest {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthenticationRequest {
  userName: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
}
