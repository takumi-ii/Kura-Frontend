// src/routes/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authService";
import { useAuth } from "../features/auth/AuthContext";
import { setLoggedOutFlag } from "../features/auth/authState";

const LoginPage = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { setIsAuthenticated } = useAuth();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			await login(username, password);
			setIsAuthenticated(true);
			setLoggedOutFlag(false);
			navigate("/");
		} catch (err) {
			console.error(err);
			setError(
				"ログインに失敗しました。ユーザー名またはパスワードが正しくありません。"
			);
			setIsAuthenticated(false);
		}
	};

	return (
		<div style={styles.container}>
			<h1 style={styles.title}>ログイン</h1>
			<form onSubmit={handleLogin} style={styles.form}>
				<input
					type="text"
					placeholder="ユーザー名"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					style={styles.input}
				/>
				<input
					type="password"
					placeholder="パスワード"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					style={styles.input}
				/>
				{error && <p style={styles.error}>{error}</p>}
				<button type="submit" style={styles.button}>
					ログイン
				</button>
			</form>
		</div>
	);
};

const styles: { [key: string]: React.CSSProperties } = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginTop: "10vh",
	},
	title: {
		fontSize: "28px",
		marginBottom: "30px",
	},
	form: {
		display: "flex",
		flexDirection: "column",
		width: "300px",
	},
	input: {
		padding: "10px",
		marginBottom: "15px",
		fontSize: "16px",
	},
	button: {
		padding: "10px",
		fontSize: "16px",
		backgroundColor: "#007bff",
		color: "#fff",
		border: "none",
		cursor: "pointer",
	},
	error: {
		color: "red",
		marginBottom: "10px",
	},
};

export default LoginPage;
