import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuracion de Vite para el proyecto
 * Sistema de Asignacion Optima de Aulas
 * 
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react()],
  
  // Configuracion de build para optimizar chunks
  build: {
    // Aumentar limite de warning para chunks grandes
    chunkSizeWarningLimit: 1200,
    
    // Configuracion de Rollup para code splitting
    rollupOptions: {
      output: {
        // Separar dependencias en chunks por vendor
        manualChunks: {
          // Ant Design en su propio chunk
          'antd-vendor': ['antd', '@ant-design/icons'],
          // Utilidades de PDF
          'pdf-vendor': ['jspdf', 'html2canvas'],
        },
      },
    },
  },
  
  // Configuracion del servidor de desarrollo
  server: {
    port: 5173,
    open: true,
  },
})
