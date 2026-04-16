/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Добави този ред
  images: {
    unoptimized: true, // Важно за статичен експорт в Netlify
  },
};

export default nextConfig;
