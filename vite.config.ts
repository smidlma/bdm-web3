import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bdm-web3/',
  server: {
    open: true,
  },
  plugins: [react()],
})
