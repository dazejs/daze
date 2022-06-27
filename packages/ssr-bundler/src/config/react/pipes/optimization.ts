import WebpackChain from 'webpack-chain';
import { isDev } from '../../../utils/consts';
import safePostCssParser from 'postcss-safe-parser';

/**
 * 客户端配置优化
 * @param chain
 */
export function optimizationPipe(chain: WebpackChain) {
    chain.optimization
        .runtimeChunk(true)
        .splitChunks({
            chunks: 'all',
            name: 'manifest',
            cacheGroups: {
                default: false,
                vendors: false,
                manifest: {
                    test: /[\\/]node_modules[\\/]/,
                },
            },
        })
        .when(!isDev, optimization => {
            optimization.minimizer('optimize-css').use(require.resolve('css-minimizer-webpack-plugin'), [{
                processorOptions: {
                    parser: safePostCssParser,
                    map: isDev ? {
                        inline: false,
                        annotation: true
                    } : false
                }
            }]);
        });
}