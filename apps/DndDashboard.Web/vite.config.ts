import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
 
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      host: env.HOST,   
      port: Number(env.PORT), 
    },
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_BASE_URL),
      __HUB_URL__: JSON.stringify(env.VITE_SIGNAL_HUB_BASE_URL),
    },
    plugins: [react(),tailwindcss()],
  }
});
