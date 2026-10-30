
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  envPrefix: [
    'VITE_',
    'API_URL',
    'SUPABASE_URL',
    'SUPABASE_PUBLISHABLE_KEY',
  ],
});

