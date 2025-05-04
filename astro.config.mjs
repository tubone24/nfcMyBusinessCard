import { defineConfig } from 'astro/config';
import serviceWorker from "astrojs-service-worker";
import partytown from "@astrojs/partytown";
import webmanifest from 'astro-webmanifest';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    integrations: [
        partytown({
            // Adds dataLayer.push as a forwarding-event.
            config: {
                forward: ["dataLayer.push"],
            },
        }),
        icon({
            include: {
                // プロジェクトで使用しているアイコンを指定
                mdi: ["telephone", "account", "github", "twitter", "facebook", "linkedin", "resume", "radio-fm", "presentation", "instagram", "youtube"],
                ic: ["baseline-mail", "sharp-qr-code-2", "outline-corporate-fare"],
                fluent: ["sparkle-16-regular"],
                "icomoon-free": ["blog"]
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
