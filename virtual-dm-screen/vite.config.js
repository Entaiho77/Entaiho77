// Vite is the build tool: it runs the dev server (`npm run dev`) and
// bundles the app for deployment (`npm run build`). The React plugin
// teaches Vite how to handle JSX files.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
