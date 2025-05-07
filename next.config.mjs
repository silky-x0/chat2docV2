/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle pdf-parse module
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    }

    return config;
  },
}

export default nextConfig
