import { defineConfig } from 'astro/config';
import serviceWorker from 'astrojs-service-worker';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  server: {
    host: true,
    port: 4321,
  },
  integrations: [
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    icon({
      include: {
        // プロジェクトで使用しているアイコンを指定
        mdi: [
          'telephone',
          'account',
          'github',
          'twitter',
          'facebook',
          'linkedin',
          'resume',
          'radio-fm',
          'presentation',
          'instagram',
          'youtube',
          'weather-sunny',
          'weather-night',
        ],
        ic: ['baseline-mail', 'sharp-qr-code-2', 'outline-corporate-fare'],
        fluent: ['sparkle-16-regular'],
        'icomoon-free': ['blog'],
      },
    }),
    process.env.NODE_ENV === 'production' ? serviceWorker() : null,
  ].filter(Boolean),
});
