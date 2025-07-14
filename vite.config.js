import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  },
});
