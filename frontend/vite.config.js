import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Use the standard plugin
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
