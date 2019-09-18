const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    plottingSymbol: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      // 'Apps/**/*',
      'index.html',
      {
        from: './node_modules/earthsdk/dist/XbsjCesium',
        to: 'XbsjCesium',
        toType: 'dir'
      },
      {
        from: './node_modules/earthsdk/dist/XbsjEarth',
        to: 'XbsjEarth',
        toType: 'dir'
      },
      // {
      //   from: 'Static/assets',
      //   to: 'XbsjEarthUI/assets',
      //   toType: 'dir'
      // },
      {
        from: 'Apps',
        to: 'Apps',
        toType: 'dir',
        transform(content, path) {
          if (!path.endsWith('.html')) {
            return content;
          }

          var cs = content.toString('utf8');
          if (process.env.NODE_ENV === 'xbsjDebug') {
            // cs = cs.replace(/\/\/xbsjDebug\b/g, '');
            cs = cs.replace(/\<head>/, `<head>
  <script>
      window.xbsjEarthDir = 'http://127.0.0.1:9529/XbsjEarth/';
  </script>`)
            cs = cs.replace(/['"].*\/XbsjEarth.js['"]/, `"http://127.0.0.1:9529/XbsjEarth/XbsjEarth.js"`);
            return cs;
          } else if (process.env.NODE_ENV === 'xbsjDebug2') {
            // cs = cs.replace(/\/\/xbsjDebug2\b/g, '');
            cs = cs.replace(/\<head>/, `<head>
  <script>
      window.xbsjEarthDir = 'http://127.0.0.1:9529/XbsjEarth/';
      window.xbsjCesiumDir = 'http://127.0.0.1:9527/XbsjCesium/';
  </script>`)
            cs = cs.replace(/['"].*\/XbsjEarth.js['"]/, `"http://127.0.0.1:9529/XbsjEarth/XbsjEarth.js"`);
            return cs;
          } else {
            return content;
          }
        },
      }
    ]),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    filename: 'XbsjEarth-Plugins/[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};