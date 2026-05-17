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
    },

    // Configuration App & PWA
    app: {
        head: {
            title: 'Roadtrip 2026',
            titleTemplate: '%s | Caro & Carlo',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
                { name: 'description', content: 'Le journal de bord de notre aventure en van en Autriche.' },
                { name: 'theme-color', content: '#030303' }
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
            ]
        }
    }
});