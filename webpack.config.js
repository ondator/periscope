const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { Stats } = require('webpack');


module.exports = {
  stats:{
    errorDetails: true,
  },
  mode: 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg|png|gif|woff|eot|ttf|svg)/,
        use: {
        loader: 'file-loader',
        options: {
        limit: 50000
        }
      }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
 devServer: {
   static: './dist',
 },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'Welcome to HackNet',        
        template: 'index.html'
      }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
//  optimization: {
//    runtimeChunk: 'single',
//  },
};