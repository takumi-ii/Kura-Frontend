/* eslint react-refresh/only-export-components: off */
import React, { createContext, useContext, useEffect, useState } from "react";
import { refreshAccessToken, checkAuthStatus } from "./authService";
import {
	setAuthStatusFlag,
	setLoggingOutFlag,
	getLoggedOutFlag,
	setLoggedOutFlag,
} from "./authState";

interface AuthContextType {
	isAuthenticated: boolean | null;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
	isLoggingOut: boolean;
	setIsLoggingOut: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
		null
	);
	const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

	useEffect(() => {
		setAuthStatusFlag(isAuthenticated);
		if (isAuthenticated) {
			setLoggedOutFlag(false);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		setLoggingOutFlag(isLoggingOut);
	}, [isLoggingOut]);
	useEffect(() => {
		const check = async () => {
			if (getLoggedOutFlag()) {
				setIsAuthenticated(false);
				return;
			}

			const result = await checkAuthStatus();
			if (result === true) {
				setIsAuthenticated(true);
				setLoggedOutFlag(false);
			} else {
				const refreshed = await refreshAccessToken();
				setIsAuthenticated(refreshed);
				setLoggedOutFlag(!refreshed);
			}
		};
		check();
	}, []);
	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				setIsAuthenticated,
				isLoggingOut,
				setIsLoggingOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
