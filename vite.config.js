import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    // Performance optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        unused: true,
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['gsap'],
        },
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Generate source maps for better debugging
    sourcemap: false, // Disable source maps in production for better performance
  },
  server: {
    host: '0.0.0.0',  // allows access from external IPs
    port: 5173,       // optional, default is 5173
    allowedHosts: [
      'localhost',
      'bhavanichits.com',
      'www.bhavanichits.com'
    ],
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://bhavanichits.com',
        'https://www.bhavanichits.com'
      ]
    }
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap'],
  },
  // Define global constants to replace deprecated APIs
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
})