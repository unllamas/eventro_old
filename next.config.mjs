/** @type {import('next').NextConfig} */
const nextConfig = {
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
