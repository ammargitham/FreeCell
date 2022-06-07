const {createRequire} = require(`module`);
const requireDependency = createRequire(require.resolve(`react`));
const webpack = requireDependency(`webpack`);

let webpackConfig = Object.assign({}, require('./webpack.config.js'));
webpackConfig.module.rules.push({
  test: /\.examples\.md$/, // see comment below!
  type: 'javascript/auto', // Tell webpack to interpret the result from examples-loader as JavaScript
});
webpackConfig.plugins.push(
  new webpack.NormalModuleReplacementPlugin(
    /react-styleguidist\/lib\/loaders\/utils\/client\/requireInRuntime$/,
    'react-styleguidist/lib/loaders/utils/client/requireInRuntime'
  ),
  new webpack.NormalModuleReplacementPlugin(
    /react-styleguidist\/lib\/loaders\/utils\/client\/evalInContext$/,
    'react-styleguidist/lib/loaders/utils/client/evalInContext'
  ),
);

module.exports = {
  assetsDir: "./public",
  components: 'src/components/**/*.tsx',
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.tsx?$/, '.examples.md')
  },
  pagePerSection: true,
  skipComponentsWithoutExample: true,
  usageMode: "expand",
  webpackConfig,
};
