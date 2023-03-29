import { defineConfig } from 'astro/config';
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
    integrations: [
        partytown({
            // Adds dataLayer.push as a forwarding-event.
            config: {
                forward: ["dataLayer.push"],
            },
        }),
    ],
});
