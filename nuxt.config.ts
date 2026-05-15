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

  runtimeConfig: {
    // Privé (Serveur)
      pocketbaseInternalUrl: process.env.POCKETBASE_INTERNAL_URL,
      openweatherApiKey: process.env.NUXT_OPENWEATHER_API_KEY,
    public: {
      // Public (Client)
      pocketbaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL,
    }
  }
});