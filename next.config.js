/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [{ source: '/', destination: '/index.html' }];
  },
  async headers() {
    return [
      { source: '/index.html', headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' }] },
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' }] }
    ];
  }
};
module.exports = nextConfig;
