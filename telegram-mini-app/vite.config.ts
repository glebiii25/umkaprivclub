import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadSupabaseEnv(): Record<string, string> {
  const candidates = [resolve(__dirname, 'supabase.env'), resolve(process.cwd(), 'supabase.env')]
  const envPath = candidates.find(existsSync)
  if (!envPath) return {}
  const out: Record<string, string> = {}
  readFileSync(envPath, 'utf-8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) {
      const key = m[1].trim()
      const val = m[2].trim()
      if (key && val) out[key] = val
    }
  })
  return out
}

const supabaseEnv = loadSupabaseEnv()
const hasSupabase = (v: string | undefined) => v != null && String(v).trim() !== ''

// Supabase config only from telegram-mini-app/supabase.env (no process.env fallback)
// https://vite.dev/config/
export default defineConfig({
  define: {
    ...(hasSupabase(supabaseEnv.VITE_SUPABASE_URL) && { 'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseEnv.VITE_SUPABASE_URL!.trim()) }),
    ...(hasSupabase(supabaseEnv.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY) && { 'import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY': JSON.stringify(supabaseEnv.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!.trim()) }),
    ...(hasSupabase(supabaseEnv.VITE_SUPABASE_MEDIA_BUCKET) && { 'import.meta.env.VITE_SUPABASE_MEDIA_BUCKET': JSON.stringify(supabaseEnv.VITE_SUPABASE_MEDIA_BUCKET!.trim()) }),
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  base: './', // Telegram Mini App: relative paths for flexible deployment
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
