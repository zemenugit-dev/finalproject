import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react() as any],
  server: {
    host: '127.0.0.1', // ከ localhost ይልቅ 127.0.0.1 መጠቀም
    port: 5173,
    strictPort: true,
  }
})