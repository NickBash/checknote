const withNextIntl = require('next-intl/plugin')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.checknote.ru',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  poweredByHeader: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            dimensions: false,
          },
        },
      ],
    })

    return config
  },
  // async redirects() {
  //   return [
  //     {
  //       // source: '/bCccDwkKkN',
  //       destination: '/', // Matched parameters can be used in the destination
  //       permanent: true,
  //     },
  //   ]
  // },
}

module.exports = withNextIntl(nextConfig)
