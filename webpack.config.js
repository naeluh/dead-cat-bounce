const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
    source: path.join(__dirname, 'source'),
    build: path.join(__dirname, 'static')
}

const ExtractApplicationCSS = new ExtractTextPlugin(path.join('css', 'application.css'), {
    allChunks: true
})

module.exports = {
    mode: 'production',
    entry: {
        // `source/js/application.js` is the entry point for everything;
        // the require('../css/application.scss') in this file is important.
        source: path.join(PATHS.source, 'js', 'application.js')
    },
    // Hugo expects everything to be output to the `/static` directory of the theme
    output: {
        path: PATHS.build,
        filename: 'js/[name][hash].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ['env']
                }
            }
        },
        {
            test: /\.css$/,
            use: ExtractApplicationCSS.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        name: 'css/[name][hash].[ext]',
                    }
                }],
                fallback: 'style-loader'
            })
        },
        {
            test: /\.scss$/,
            use: ExtractApplicationCSS.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        name: 'css/[name][hash].[ext]',
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        name: 'css/[name][hash].[ext]',
                    }
                }
                ],
                fallback: 'style-loader'
            })
        },
        // file-loader(for images)
        {
            test: /\.(jpg|png|gif|svg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'img/[name][hash].[ext]',
                }
            }]
        },
        // file-loader(for audio)
        {
            test: /\.(mp3|aiff|wav|ogg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'audio/[name][hash].[ext]',
                }
            }]
        },
        // file-loader(for fonts)
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name][hash].[ext]',
                    outputPath: '../'
                }
            }]
        }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        inline: false
                    }
                }
            })
        ],
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor_app',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    devServer: {
        contentBase: path.resolve(__dirname, '.'),
        hot: true
    },
    plugins: [
        // Extract CSS into a separate file
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        ExtractApplicationCSS
    ]
}