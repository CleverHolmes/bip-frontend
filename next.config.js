const { i18n } = require('./next-i18next.config');

const nextConfig = {
  async redirects() {
    return [
      /* {
                      source: '/some_path/:id',
                      destination: '/',
                      permanent: false,
                  }, */
    ];
  },
  images: {
    loader: 'default',
    loaderFile: './utils/image-loader.ts',
    domains: ['bip.co', 'development.bip.co', 'static-development.bip.co'],
  },
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  i18n,
};

module.exports = nextConfig;
