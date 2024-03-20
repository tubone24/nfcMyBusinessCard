import { defineConfig } from 'astro/config';
import serviceWorker from "astrojs-service-worker";
import partytown from "@astrojs/partytown";
import webmanifest from 'astro-webmanifest';

// https://astro.build/config
export default defineConfig({
    integrations: [
        partytown({
            // Adds dataLayer.push as a forwarding-event.
            config: {
                forward: ["dataLayer.push"],
            },
        }),
        process.env.NODE_ENV === 'production' ? serviceWorker() : null,
        webmanifest({
            name: 'Yu Otsubo - Business Card Site',
            icon: 'public/icon.png',
            short_name: 'Yu Otsubo',
            description: 'Yu Otsubo - Business Card Site',
            start_url: 'https://tubone-project24.onrender.com/#testtest',
            theme_color: '#4bffde',
            background_color: '#4bffde',
            display: 'standalone',
        }),
    ],
});
