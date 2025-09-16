// src/pages/Dashboard.tsx
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // 必要であればCSSを分離
import LogoutButton from "../components/LogoutButton";

const Dashboard = () => {
	const navigate = useNavigate();

	return (
		<div className="dashboard-container">
			<h1>ダッシュボード</h1>
			<div className="dashboard-buttons">
				<button onClick={() => navigate("/calendar")}>
					カレンダー
				</button>
				<button onClick={() => navigate("/diary")}>日記</button>
				<button onClick={() => navigate("/garally")}>写真</button>
			</div>
			<LogoutButton />
		</div>
	);
};

export default Dashboard;
