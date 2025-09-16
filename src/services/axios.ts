// services/axios.ts
import axios from "axios";
import { refreshAccessToken } from "../features/auth/authService";
import {
	getLoggingOutFlag,
	getAuthStatusFlag,
} from "../features/auth/authState";

const instance = axios.create({
	baseURL: "/api", // バックエンドが http://localhost:8000/api/ なら、Vite 側で proxy 設定しておく
	withCredentials: true, // Cookie 送信を許可
});

// リフレッシュ処理中かどうかのフラグ
let isRefreshing = false;

//

instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!isRefreshing &&
			!getLoggingOutFlag() &&
			// Only attempt refresh when the user is known to be
			// authenticated. This avoids unnecessary refresh
			// requests on initial load or after logout when the
			// auth status is "null".
			getAuthStatusFlag() === true
		) {
			originalRequest._retry = true;
			isRefreshing = true;
			try {
				const refreshed = await refreshAccessToken();
				isRefreshing = false;
				if (refreshed) {
					return instance(originalRequest); // retry original
				}
			} catch (e) {
				isRefreshing = false;
				console.error("トークンのリフレッシュに失敗しました", e);
			}
		}
		return Promise.reject(error);
	}
);

export default instance;
