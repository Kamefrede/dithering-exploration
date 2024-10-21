import { defineConfig } from 'vite'
import wasmRecompilePlugin from './vite-plugin-wasm-recompile'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@jsquash/oxipng"]
  },
  plugins: [wasmRecompilePlugin({})],
})
