import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The repo name — used as the base path for GitHub Pages project sites,
// i.e. https://<user>.github.io/graduation-ceremony-message/
// If you deploy to a custom domain or a different repo name, change this.
const REPO_BASE = '/graduation-ceremony-message/'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? REPO_BASE : '/',
  plugins: [react(), tailwindcss()],
}))
