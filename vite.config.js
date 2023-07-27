import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

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
    start_url: "https://www.grid-stacker.com/",
    display: "standalone",
    theme_color: "#000000",
    background_color: "#000000"
}

// https://vitejs.dev/config/
export default defineConfig(
    {
        plugins: [
            react(),
            VitePWA({ 
                registerType: 'autoUpdate', 
                manifest: manifest,
                devOptions: {
                    enabled: true,
                    type: "module",
                },
            })
        ],
    }
)
