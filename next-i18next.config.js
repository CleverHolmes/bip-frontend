module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    namespaces: ['common', 'errors'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
