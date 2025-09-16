import { useEffect, useState, useRef } from "react";
import axios from "../../../services/axios";
import { refreshAccessToken } from "../authService";
import type { AuthStatusResponse } from "../../../types/auth";

export const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
		null
	);
	const isLoggingOut = useRef(false);
	useEffect(() => {
		console.log("called useEffect");
		const checkAuth = async () => {
			try {
				const res = await axios.post<AuthStatusResponse>(
					"/authenticated/",
					{},
					{ withCredentials: true }
				);

				// 明示的にfalseなら再認証しない
				if (res.data.authenticated === false) {
					setIsAuthenticated(false);
					return;
				}

				setIsAuthenticated(true);
			} catch (error: any) {
				// 401のときだけrefreshを試みる（現状これは起きない前提でも予防措置）
				if (error.response?.status === 401) {
					const refreshed = await refreshAccessToken();
					if (refreshed) {
						try {
							const res = await axios.post<AuthStatusResponse>(
								"/authenticated/",
								{},
								{ withCredentials: true }
							);
							setIsAuthenticated(res.data.authenticated === true);
							return;
						} catch {}
					}
				}
				setIsAuthenticated(false);
			}
		};

		checkAuth();
	}, []);

	return { isAuthenticated, setIsAuthenticated, isLoggingOut };
};
