const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const PORT = 4000;
const DEV_URL = `http://localhost:${PORT}/`;

console.log('DEV_URL : ', DEV_URL);

module.exports = {
  devtool: 'eval',
  context: path.resolve(__dirname, '..'),
  entry: './index.js',
  devServer: {
    historyApiFallback: true,
    publicPath: DEV_URL,
    port: PORT,
    proxy: {
      '/': 'http://localhost:4001' // Proxying to dev-api running at port 4001
    }
  },
  output: {
    filename: 'bundle.js',
    // so the build files (in memory) are served from here -> `localhost:${PORT}/`
    publicPath: DEV_URL
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=2&module&localIdentName=[path][name]-[local]&-autoprefixer&-minimize',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.png$/,
        loader: "url-loader?limit=100000"
      },
      {
        test: /\.jpg$/,
        loader: "file-loader"
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  resolve: {
    modules: [
      'client', // intentional, so I don't confound directory names with npm packages
      'node_modules',
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './webpack/templates/index.ejs',
      production: false,
      // tags: [
      //   '<script type="text/javascript" src="/dist/bundle.js" charSet="UTF-8"></script>',
      // ].join('')
    })
  ]
};
