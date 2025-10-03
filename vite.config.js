import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',  // allows access from external IPs
    port: 5173,       // optional, default is 5173
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://bhavanichits.com',
        'https://www.bhavanichits.com'
      ]
    }
  }
})