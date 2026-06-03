/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i1-vnexpress.vnecdn.net',
      },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'unpkg.com' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
      {
        protocol: 'https',
        hostname: 'hnm.1cdn.vn',
      },
      {
        protocol: 'https',
        hostname: 'lic.vnu.edu.vn',
      },
      {
        protocol: 'https',
        hostname: '**.vnu.edu.vn',
      },
      {
        protocol: 'https',
        hostname: 'www.nxbctqg.org.vn',
      },
      {
        protocol: 'https',
        hostname: 'library.hust.edu.vn',
      },
      {
        protocol: 'https',
        hostname: 'static.oreka.vn',
      },
    ],
  },
};

export default nextConfig;

