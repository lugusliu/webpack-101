const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cssProcessor = require('cssnano');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require('terser-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const smp = new SpeedMeasurePlugin();
const PATHS = {
  src: path.join(__dirname, 'src'),
};
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  const len = entryFiles.length;
  for (let i = 0; i < len; i += 1) {
    const entryFile = entryFiles[i];
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ['vendors', 'commons', pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      }),
    );
  }
  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = smp.wrap({
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name]_[chunkhash:8].js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3,
            },
          },
          'babel-loader?cacheDirectory=true',
          'eslint-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          'postcss-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: 'img',
              publicPath: '../img',
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
              publicPath: '../fonts',
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash:8].css',
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor,
    }),
    ...htmlWebpackPlugins,
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (
          stats.compilation.errors
          && stats.compilation.errors.length
          && process.argv.indexOf('--watch') === -1
        ) {
          console.log('build error'); // eslint-disable-line
          process.exit(1);
        }
      });
    },
    // new BundleAnalyzerPlugin(),
    new HardSourceWebpackPlugin([
      { test: /mini-css-extract-plugin[\\/]dist[\\/]loader/ },
    ]),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: "react",
    //       entry: "https://11.url.cn/now/lib/16.2.0/react.min.js",
    //       global: "React"
    //     },
    //     {
    //       module: "react-dom",
    //       entry: "https://11.url.cn/now/lib/16.2.0/react-dom.min.js",
    //       global: "ReactDOM"
    //     }
    //   ]
    // })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
      }),
    ],
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      react: path.resolve(
        __dirname,
        './node_modules/react/umd/react.production.min.js',
      ),
      'react-dom': path.resolve(
        __dirname,
        './node_modules/react-dom/umd/react-dom.production.min.js',
      ),
    },
    extensions: ['.js'],
    mainFields: ['main'],
  },
  stats: 'errors-only',
});
