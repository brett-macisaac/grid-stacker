import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

const gTesting = false;

// The content of the app's manifest file.
const manifest = 
{
    short_name: "Grid Stacker",
    name: "Grid Stacker",
    icons: 
    [
        {
            src: "/logo192.png",
            type: "image/png",
            sizes: "192x192"
        },
        {
            src: "/logo512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable"
        }
    ],
    start_url: gTesting ? "http://localhost:4173/" : "https://www.grid-stacker.com/",
    display: "standalone",
    theme_color: "#000000",
    background_color: "#000000"
}

// https://vitejs.dev/config/
export default defineConfig(
    {
        build: {
            assetsInlineLimit: 0,
            rollupOptions: {
                output: {
                    // Prevent renaming of files with hashes.
                    entryFileNames: `assets/[name].js`,
                    chunkFileNames: `assets/[name].js`,
                    assetFileNames: `assets/[name].[ext]`
                }
            },
            watch: false
        },
        plugins: [
            react(),
            VitePWA({ 
                registerType: 'autoUpdate', 
                manifest: manifest,
                devOptions: {
                    enabled: true,
                    type: "module",
                },
                workbox: {
                    globPatterns: [ '**/*.{js,css,html,mp3,webp}' ],
                }
            })
        ],
    }
)
