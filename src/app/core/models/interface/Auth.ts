import { JwtPayload } from "jwt-decode"

export interface AuthResponse {
  accessToken: string,
  refreshToken: string
}

export interface LoginRequest {
  email: string,
  password: string
}

export interface RegisterAccountRequest {
  fullName: string,
  email: string,
  password: string
}

export interface CustomJwtPayload extends JwtPayload {
  authorities: [
    {
      authority: string
    }
  ]
}
