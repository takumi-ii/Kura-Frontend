import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./features/auth/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	// 	<App />
	// </StrictMode>
	<AuthProvider>
		<App />
	</AuthProvider>
);
