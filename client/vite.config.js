import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const targetApi = env.VITE_API_TARGET || 'http://127.0.0.1:5000';
  const port = Number(env.VITE_PORT) || 5173;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port,
      strictPort: true,
      proxy: {
        '/api': {
          target: targetApi,
          changeOrigin: true,
        },
      },
    },
  };
});
