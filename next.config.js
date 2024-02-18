/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['files.edgestore.dev'],
  },
  compiler: {
    styledComponents: {
      displayName: false,
    },
  },
};

module.exports = nextConfig;
