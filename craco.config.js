const webpack = require('webpack');

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
      // Minimal polyfills - only what's absolutely necessary
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "buffer": require.resolve("buffer/"),
        "process": require.resolve("process/browser.js"),
        "fs": false,
        "path": false,
        "os": false,
        "stream": false,
        "http": false,
        "https": false,
        "zlib": false,
        "assert": false,
        "url": false
      };

      // Add Buffer polyfill only
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );

      // Disable source maps in development to reduce memory usage
      webpackConfig.devtool = 'eval-cheap-module-source-map';

      return webpackConfig;
    },
  },
}; 