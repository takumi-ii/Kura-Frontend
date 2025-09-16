// src/features/auth/AuthGuard.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface Props {
	children?: React.ReactNode;
}

const AuthGuard = ({ children }: Props) => {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	if (isAuthenticated === null) return null; // ローディング中なら一時的に非表示
	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}
	return <>{children}</>; // React.Fragmentで明示的にラップ
};

export default AuthGuard;
