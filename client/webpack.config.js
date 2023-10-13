/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');
const dotenv = require('dotenv');

dotenv.config();

const isDev = process.env.NODE_ENV === 'production';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };
  if (isProd) {
    config.minimizer = [
      new TerserWebpackPlugin(),
    ];
  }
  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const scssLoaders = (extra) => {
  const loaders = [
    {
      loader: 'style-loader',
      options: {
        esModule: false,
      },
    },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        // module: true,
        modules: {
          exportLocalsConvention: 'dashes',
          localIdentName: '[local]_[hash:base64:5]',
        },
      },
    },
  ];
	
  if (extra) {
    loaders.push(extra);
  }
	
  return loaders;
};

const cssLoaders = (extra) => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
      },
    },
  ];
	
  if (extra) {
    loaders.push(extra);
  }
	
  return loaders;
};

const babelOptions = (presets) => {
  const opts = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };
	
  if (presets) {
    presets.forEach((preset) => {
      opts.presets.push(preset);
    });
  }
	
  return opts;
};

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions(),
  }];
	
  if (isDev) {
    loaders.push('eslint-loader');
  }
	
  return loaders;
};

const plugins = () => {
  const base = [
    new Dotenv(),
    new HTMLWebpackPlugin({
      template: './index.html',
      favicon: '../public/favicon.ico',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/img'),
          to: path.resolve(__dirname, 'dist/assets/img'),
          noErrorOnMissing: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/fonts'),
          to: path.resolve(__dirname, 'dist/assets/fonts'),
          noErrorOnMissing: true,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ];
	
  if (isProd) {
    base.push(new BundleAnalyzerPlugin());
  }
	
  return base;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: isDev ? 'development' : 'production',
  entry: {
    main: ['@babel/polyfill', './index.tsx'],
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    fallback: {
      process: require.resolve('process/browser'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
    extensions: ['.js', '.json', '.ts', '.tsx', '.jsx', '.scss'],
    alias: {
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@src': path.resolve(__dirname, 'src'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@hoc': path.resolve(__dirname, 'src/components/HOC'),
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev,
    historyApiFallback: true,
  },
  devtool: isDev ? 'source-map' : false,
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: path.join(__dirname, 'src/components'),
        use: cssLoaders(),
      },
      {
        test: /index.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.module.scss$/,
        use: scssLoaders('sass-loader'),
      },
      {
        test: /\.[tj]sx$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
};
