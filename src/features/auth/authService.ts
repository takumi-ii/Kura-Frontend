// src/features/auth/authService.ts
import axios from "../../services/axios";
import type { AuthStatusResponse, RefreshResponse } from "../../types/auth";

// export const checkAuthStatus = async (): Promise<boolean> => {
// 	const res = await axios.post<AuthStatusResponse>(
// 		"/authenticated/",
// 		{},
// 		{ withCredentials: true }
// 	);
// 	return res.data.authenticated === true;
// };

export const checkAuthStatus = async (): Promise<boolean> => {
	try {
		const res = await axios.post<AuthStatusResponse>(
			"/authenticated/",
			{},
			{ withCredentials: true }
		);
		return res.data.authenticated === true;
	} catch (err) {
		console.warn("認証確認中にエラー", err);
		return false;
	}
};
export const login = async (username: string, password: string) => {
	const res = await axios.post(
		"/token/",
		{ username, password },
		{ withCredentials: true }
	);
	return res.data;
};

// export const refreshAccessToken = async (): Promise<boolean> => {
// 	try {
// 		const res = await axios.post<RefreshResponse>(
// 			"/token/refresh/",
// 			{},
// 			{ withCredentials: true }
// 		);
// 		return res.data.refreshed === true;
// 	} catch (err) {
// 		console.error("Re-authentication with refresh token failed", err);
// 		return false;
// 	}
// };
export const refreshAccessToken = async (): Promise<boolean> => {
	try {
		const res = await axios.post<RefreshResponse>(
			"/token/refresh/",
			{},
			{ withCredentials: true }
		);
		return res.data.refreshed === true;
	} catch (err) {
		console.error("Re-authentication with refresh token failed", err);
		return false;
	}
};

export const logout = async () => {
	await axios.post("/logout/", {}, { withCredentials: true });
};
