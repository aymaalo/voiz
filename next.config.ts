import type { NextConfig } from 'next';

/** Photos uploaded from /admin/content live in the Supabase project's public bucket. */
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  : null;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Project tiles use the YouTube stills of the videos managed in /admin.
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
      ...(supabase
        ? [
            {
              protocol: supabase.protocol === 'http:' ? ('http' as const) : ('https' as const),
              hostname: supabase.hostname,
              port: supabase.port,
              pathname: '/storage/v1/object/public/site-images/**',
            },
          ]
        : []),
    ],
    // The local Supabase (supabase start) serves from 127.0.0.1, which the
    // optimizer refuses by default.
    dangerouslyAllowLocalIP: supabase?.hostname === '127.0.0.1' || supabase?.hostname === 'localhost',
  },
  async redirects() {
    return [
      // The site always lives under a locale segment; French is the default.
      { source: '/', destination: '/fr', permanent: false },
      { source: '/projets', destination: '/fr/projets', permanent: false },
      { source: '/projects', destination: '/en/projects', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // The hero video is immutable; let the CDN keep it forever.
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
