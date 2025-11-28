import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // フロントエンドのポートを5173に固定
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // バックエンドのURL (Goサーバー)
        changeOrigin: true, // オリジンを変更
        // rewrite: (path) => path.replace(/^\/api/, ''), // /api を削除して転送
      }
    }
  }
})
