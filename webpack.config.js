require('dotenv').config()

const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { DefinePlugin } = require('webpack')

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const smp = new SpeedMeasurePlugin()

module.exports = (_, argv) => {
  const devMode = argv.mode === 'development'

  const options = {
    entry: path.resolve('src', 'index.tsx'),
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './tsconfig.json'),
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'fast-sass-loader']
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        ignoreOrder: true
      }),
      new HtmlWebpackPlugin({
        template: './views/index.html',
        filename: 'index.html'
      }),
      new DefinePlugin({
        'process.env.GRAPHQL_ENDPOINT': JSON.stringify(
          process.env.GRAPHQL_ENDPOINT
        ),
        'process.env.API_ENDPOINT': JSON.stringify(process.env.API_ENDPOINT),
        'process.env.TOSS_PAYMENTS_CLIENT_KEY': JSON.stringify(
          process.env.TOSS_PAYMENTS_CLIENT_KEY
        )
      })
      // new CopyWebpackPlugin({
      //   patterns: [
      //     {
      //       from: 'public'
      //     }
      //   ]
      // })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }

  options.mode = argv.mode

  if (devMode) {
    options.devtool = 'source-map'
    options.devServer = {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 8080,
      historyApiFallback: true
    }

    // return smp.wrap(options)
    // ????????? ????????? ?????? ?????? ?????????.
    // https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
  }

  return options
}
