const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = (env) => {
  return {
    mode: 'development',
    entry: [
      '@babel/polyfill', 
      './public/js/app.js',
      './public/js/interfaz.js',
      './public/js/jsEjercicios.js',
    ],
    output: {
      path: path.resolve(__dirname, 'public', 'build'),
      filename: 'bundle.js'
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }]
    },
    devtool: 'source-map'
  };
};