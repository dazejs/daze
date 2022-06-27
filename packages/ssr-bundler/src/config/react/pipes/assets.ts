import WebpackChain from 'webpack-chain';

/**
 * 配置静态资源相关的配置
 * @param chain
 */
export function assetsPipe(chain: WebpackChain) {
    chain.module
        .rule('images')
        .test(/\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/)
        .type('javascript/auto')
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options({
            limit: 10000,
            name: '[name].[hash:8].[ext]',
            // require 图片的时候不用加 .default
            esModule: false,
            fallback: {
                loader: require.resolve('file-loader'),
                options: {
                    publicPath: '/assets/static/images',
                    name: '[name].[hash:8].[ext]',
                    esModule: false,
                    outputPath: 'images'
                }
            }
        });

    chain.module
        .rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .use('file-loader')
        .loader(require.resolve('file-loader'))
        .options({
            name: 'static/[name].[hash:8].[ext]',
            esModule: false
        });

    chain.module
        .rule('fonts')
        .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
        .use('file-loader')
        .loader(require.resolve('file-loader'))
        .options({
            name: 'static/[name].[hash:8].[ext]',
            esModule: false
        });
}