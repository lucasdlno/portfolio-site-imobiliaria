// frontend/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // O bloco de rewrites continua o mesmo
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },

  // ADICIONE ESTE BLOCO DE CÓDIGO
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Permite qualquer caminho dentro desse hostname
      },
    ],
  },
};

export default nextConfig;