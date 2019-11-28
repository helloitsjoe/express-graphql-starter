const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/public/js'),
  },

  // Enable sourcemaps for debugging webpack's output
  devtool: 'source-map',
  mode: 'development',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        // All files with a '.ts' or '.tsx' extension will be handled
        // by ts-loader
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //     'react': 'React',
  //     'react-dom': 'ReactDOM'
  // },
};
