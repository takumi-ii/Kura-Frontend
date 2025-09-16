import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	css: {
		devSourcemap: false,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:8000", // Djangoサーバー
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
