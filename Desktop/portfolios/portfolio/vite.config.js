// C:\Users\Lenovo\Desktop\portfolios\portfolio\vite.config.js

// 1. Must use 'import' statements (ES Module syntax)
import { defineConfig } from 'vite'; 
import react from '@vitejs/plugin-react'; 

// 2. Must use 'export default' for the config object
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/Portfolio",
});