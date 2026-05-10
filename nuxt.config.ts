import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      host: '0.0.0.0',
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        clientPort: 24679,
      }
    }
  },

  // Declarations for environment variables
  runtimeConfig: {
    // Private keys are only available on the server side
    pocketbaseInternalUrl: process.env.POCKETBASE_INTERNAL_URL || 'http://pocketbase:8090',

    // Public keys are exposed to both server and client side
    public: {
      pocketbaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8091',
    }
  }
});