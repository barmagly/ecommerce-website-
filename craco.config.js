module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Add polyfills
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "assert": require.resolve("assert/"),
        "url": require.resolve("url/"),
        "buffer": require.resolve("buffer/"),
        "fs": false
      };

      // Add Buffer polyfill
      webpackConfig.plugins.push(
        new webpackConfig.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );

      // Ignore source map warnings
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