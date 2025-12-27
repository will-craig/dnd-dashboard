import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const resolveBaseUrl = (value: string | undefined) => {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : 'https://localhost:7084';
  };
  const apiBaseUrl = resolveBaseUrl(env.VITE_API_BASE_URL);
  const hubBaseUrl = resolveBaseUrl(env.VITE_SIGNAL_HUB_BASE_URL);

  return {
    server: {
      host: env.HOST,
      port: Number(env.PORT),
    },
    define: {
      __API_URL__: JSON.stringify(apiBaseUrl),
      __HUB_URL__: JSON.stringify(hubBaseUrl),
    },
    plugins: [react(), tailwindcss()],
  };
});
