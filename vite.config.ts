import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Import the node polyfills plugin (ADD THIS LINE)
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// Removed Buffer import if it was added previously: import { Buffer } from 'buffer/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add the nodePolyfills plugin here
    nodePolyfills({
        // Optional: Configure specific polyfills if needed,
        // otherwise it includes common ones like buffer, process, etc.
        // See plugin documentation for options.
        // globals: {
        //   Buffer: true, // Default: true - Provide a Buffer global
        //   global: true, // Default: true
        //   process: true, // Default: true
        // },
        // protocolImports: true, // Default: true - Allow 'node:' imports
    })
  ],
  // Removed the manual 'define' section for Buffer and global if it was added previously
  // define: {
  //   'global.Buffer': Buffer,
  //   'global': 'globalThis',
  //   'process.env': {}
  // },
})
