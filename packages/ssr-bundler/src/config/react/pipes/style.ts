import WebpackChain from 'webpack-chain';
import { isDev } from '../../../utils/consts';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';


function setStyle(chain: WebpackChain, reg: RegExp, options: {
    rule: string,
    importLoaders: number,
    modules?: boolean,
    loader?: string,
    include?: any[],
    exclude?: any[],
}) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const postcssOptions = {
        plugins: [
            'postcss-flexbugs-fixes',
            'postcss-discard-comments',
            ['postcss-preset-env', {
                autoprefixer: {
                    flexbox: 'no-2009'
                },
                stage: 3
            }]
        ]
    };

    const cssLoaderOptions: Record<string, any> = {
        importLoaders: options.importLoaders,
        modules: {
            auto: options.modules,
            localIdentName: '[name]__[local]___[hash:base64:5]'
        },
        // localIdentName: '[name]__[local]___[hash:base64:5]'
    };

    chain.module
        .rule(options.rule)
        .test(reg)
        .when(Boolean(options.include), rule => {
            rule.include.add(options.include).end();
        })
        .when(Boolean(options.exclude), rule => {
            rule.exclude.add(options.exclude).end();
        })
        .when(isDev, rule => {
            rule.use('hmr')
                .loader(require.resolve('css-hot-loader'))
                .end();
        })
        .use('MiniCss')
        .loader(MiniCssExtractPlugin.loader)
        .end()
        .use('css-loader')
        .loader(require.resolve('css-loader'))
        .options(cssLoaderOptions)
        .end()
        .use('postcss-loader')
        .loader(require.resolve('postcss-loader'))
        .options({
            postcssOptions
        })
        .end()
        .when(Boolean(options.loader), rule => {
            options.loader && rule.use(options.loader)
                .loader(require.resolve(options.loader))
                .when(options.loader === 'less-loader', rule => {
                    rule.options({
                        lessOptions: {
                            javascriptEnabled: true
                        }
                    });
                })
                .end();
        });
}

/**
 * 配置样式相关的 webpack
 * @param chain
 */
export function stylePipe(chain: WebpackChain) {
    setStyle(chain, /\.css$/, {
        exclude: [/antd/, /swiper/],
        rule: 'css',
        modules: true,
        importLoaders: 1
    });

    setStyle(chain, /\.less$/, {
        exclude: [/antd/, /swiper/],
        rule: 'less',
        modules: true,
        loader: 'less-loader',
        importLoaders: 2
    });

    setStyle(chain, /\.scss$/, {
        exclude: [/antd/, /swiper/],
        rule: 'sass',
        modules: true,
        loader: 'sass-loader',
        importLoaders: 2
    });

    setStyle(chain, /\.css$/, {
        include: [/antd/, /swiper/],
        rule: 'cssWhite',
        modules: false,
        importLoaders: 1
    });

    setStyle(chain, /\.less$/, {
        include: [/antd/, /swiper/],
        rule: 'lessWhite',
        modules: false,
        loader: 'less-loader',
        importLoaders: 2
    });
}