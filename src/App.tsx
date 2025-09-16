import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./routes/LoginPage";
import Dashboard from "./routes/Dashboard";
import AuthGuard from "./features/auth/AuthGuard";
import Calendar from "./routes/Calendar";
import Diary from "./routes/Diary";
import Garally from "./routes/Garally";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/"
					element={
						<AuthGuard>
							<Dashboard />
						</AuthGuard>
					}
				/>
				<Route
					path="/calendar"
					element={
						<AuthGuard>
							<Calendar />
						</AuthGuard>
					}
				/>
				<Route
					path="/diary"
					element={
						<AuthGuard>
							<Diary />
						</AuthGuard>
					}
				/>
				<Route
					path="/garally"
					element={
						<AuthGuard>
							<Garally />
						</AuthGuard>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
