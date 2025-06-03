module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.ignoreWarnings = [
        (warning) =>
          warning.message &&
          warning.message.includes('Failed to parse source map from') &&
          warning.module &&
          warning.module.resource &&
          warning.module.resource.includes('stylis-plugin-rtl')
      ];
      return webpackConfig;
    },
  },
}; 