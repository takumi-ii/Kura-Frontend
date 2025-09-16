// src/components/LogoutButton.tsx

import React from "react";
import { useAuth } from "../features/auth/AuthContext";
import { logout } from "../features/auth/authService";
import { useNavigate } from "react-router-dom";
import { setLoggedOutFlag } from "../features/auth/authState";

const LogoutButton: React.FC = () => {
	const { setIsAuthenticated, isLoggingOut, setIsLoggingOut } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		if (isLoggingOut) return;
		try {
			setIsLoggingOut(true); // ログアウト処理開始フラグ
			await logout();
			setIsAuthenticated(false);
			setLoggedOutFlag(true);
			navigate("/login");
		} catch (err) {
			console.error("ログアウトに失敗:", err);
		} finally {
			setIsLoggingOut(false); // 念のためリセット
		}
	};

	return (
		<button
			className="logout-button"
			onClick={handleLogout}
			disabled={isLoggingOut}
		>
			ログアウト
		</button>
	);
};

export default LogoutButton;
