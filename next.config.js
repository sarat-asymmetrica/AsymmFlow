/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // 🔐 authentication: Only proxy specific API routes, exclude NextAuth
    // NextAuth routes (/api/auth/*) will be handled locally by NextAuth.js
    return [
      {
        source: '/api/customers/:path*',
        destination:
          process.env.NEXT_PUBLIC_BACKEND_URL
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/:path*`
            : 'http://localhost:3000/api/customers/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination:
          process.env.NEXT_PUBLIC_BACKEND_URL
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/:path*`
            : 'http://localhost:3000/api/orders/:path*',
      },
      {
        source: '/api/projects/:path*',
        destination:
          process.env.NEXT_PUBLIC_BACKEND_URL
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/:path*`
            : 'http://localhost:3000/api/projects/:path*',
      },
      {
        source: '/api/rfq/:path*',
        destination:
          process.env.NEXT_PUBLIC_BACKEND_URL
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rfq/:path*`
            : 'http://localhost:3000/api/rfq/:path*',
      },
      // Add other specific API routes as needed
      // NextAuth routes (/api/auth/*) are intentionally excluded
    ];
  },
};

module.exports = nextConfig;
