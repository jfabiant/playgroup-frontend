/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '5000',
            pathname: '/**',
          },
        ],
      },
}

module.exports = nextConfig
