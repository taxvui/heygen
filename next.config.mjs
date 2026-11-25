/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'dynamic.heygen.ai' },
      { protocol: 'https', hostname: 'static.heygen.ai' },
      { protocol: 'https', hostname: 'files2.heygen.ai' },
      { protocol: 'https', hostname: 'app.heygen.com' },
    ],
  },
  serverExternalPackages: ['ffmpeg-static'],
};

export default nextConfig;
