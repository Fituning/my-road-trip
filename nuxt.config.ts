import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },

    css: ['./app/assets/css/main.css'],

    // 1. Add the PWA module
    modules: [
        '@vite-pwa/nuxt'
    ],

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
        // Private (Server)
        pocketbaseInternalUrl: process.env.POCKETBASE_INTERNAL_URL,
        openweatherApiKey: process.env.NUXT_OPENWEATHER_API_KEY,
        public: {
            // Public (Client)
            pocketbaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL,
        }
    },

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
    },

    // 2. Configure the PWA module
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'My Roadtrip',
            short_name: 'Roadtrip',
            description: 'Notre carnet de voyage en van',
            theme_color: '#030303',
            background_color: '#030303',
            display: 'standalone', // Makes it look like a native app (hides browser UI)
            orientation: 'portrait',
            // Dans la section pwa.manifest.icons :
            icons: [
                {
                    src: 'favicon.svg',
                    sizes: 'any',
                    type: 'image/svg+xml',
                    purpose: 'any'
                },
                {
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable'
                }
            ]
        },
        workbox: {
            // Setup offline caching for the core files
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico}']
        },
        devOptions: {
            enabled: true, // Enables PWA features in dev mode for testing
            type: 'module'
        }
    }
});