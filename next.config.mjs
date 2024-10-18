/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    INSTANT_DB: process.env.INSTANT_DB_APP_ID,
  },
  images: {
    domains: ['nostr.build', 'static.flickr.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
