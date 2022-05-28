module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const eslintPlugin = webpackConfig.plugins.find((p) => p.constructor.name === 'ESLintWebpackPlugin')
      if (eslintPlugin) {
        eslintPlugin.options.emitWarning = false;
      }
      webpackConfig['stats'] = 'errors-only';
      return webpackConfig;
    },
  }
};
