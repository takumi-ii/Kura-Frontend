// src/types/auth.ts
export interface AuthStatusResponse {
	authenticated: boolean;
}

export interface LoginResponse {
	success: boolean;
}

export interface RefreshResponse {
	refreshed: boolean;
}
