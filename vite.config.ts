import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    // Keep the boot + portfolio styles inside their lazy chunks so the RAW
    // phase ships with zero CSS.
    cssCodeSplit: true,
  },
});
