
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/auth': 'http://127.0.0.1:8000',
            '/admin': 'http://127.0.0.1:8000',
            '/restaurants': 'http://127.0.0.1:8000',
            '/orders': 'http://127.0.0.1:8000',
        }
    }
})
