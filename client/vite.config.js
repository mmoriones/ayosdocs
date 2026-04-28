import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // [!code ++]

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // [!code ++]
  ],
  server: {
    host: true, // or '0.0.0.0'
    allowedHosts: ['dev.ayosdocs.com']
  }
})