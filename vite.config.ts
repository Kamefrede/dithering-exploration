import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import wasmRecompilePlugin from './vite-plugin-wasm-recompile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), wasmRecompilePlugin({})],
})
