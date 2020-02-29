const path = require("path")
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require("workbox-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");


module.exports = {
    entry: {
        main: ['babel-polyfill','webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js'],
        'OneSignalSDKUpdaterWorker': path.resolve('./src/OneSignalSDKUpdaterWorker.js'),
        'OneSignalSDKWorker': path.resolve('./src/OneSignalSDKWorker.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js'
    },
    resolve: {
        alias: {
            Assets: path.resolve(__dirname, 'src/assets/images/')
        }
    },
    mode: 'development',
    target: 'web',
    devtool: 'source-map',
    // Webpack 4 does not have a CSS minifier, although
    // Webpack 5 will likely come with one
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({})
          ] 
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    emitWarning: true,
                    failOnError: false,
                    failOnWarning: false
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader']},
            { test: /\.html$/, use: [{ loader: "html-loader" }] },
            { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            excludeChunks: ['server'],
            favicon: "./src/assets/images/favicon.ico"
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new WebpackPwaManifest({
            name: 'Farmestar',
            short_name: 'Farmestar',
            description: 'Bringing farmers and consumers together.',
            start_url: '/',
            background_color: '#ffffff',
            theme_color: '#ffffff',
            crossorigin: 'anonymous', //cant be null, use-credentials or anonymous
            icons: [
                {
                    src: path.resolve('./src/assets/images/logo.png'),
                    sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
                },
                {
                    src: path.resolve('./src/assets/images/large-icon.png'),
                    size: '1024x1024' // you can also use the specifications pattern
                }
            ]
        })
    ]
}