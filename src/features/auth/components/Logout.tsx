import { useNavigate } from "react-router-dom";
import { logout } from "../../../features/auth/authService";
import { useAuth } from "../../../features/auth/AuthContext";
import { setLoggedOutFlag } from "../../../features/auth/authState";

export const HandleLogout = async () => {
	const { setIsAuthenticated } = useAuth();
	const navigate = useNavigate();
	try {
		await logout();
		setIsAuthenticated(false); // 認証状態をリセット
		setLoggedOutFlag(true);
		navigate("/login"); // ログイン画面へ
	} catch (error) {
		console.error("ログアウト失敗:", error);
	}
};
