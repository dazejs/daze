import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackChain from 'webpack-chain';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { fePath, isDev, moduleFileExtensions, serverOutputPath } from '../../utils/consts';
import { assetsPipe, scriptPipe, stylePipe } from './pipes';

/**
 * 生成 Webpack 基础配置
 * @param chain
 * @param option
 * @returns
 */
export function getBaseConfig(chain: WebpackChain, option = {
    isServerSide: false
}) {
    chain.mode(process.env.NODE_ENV === 'production' ? 'production' : 'development');
    chain.module.strictExportPresence(true);
    chain.resolve.modules.add('node_modules');
    chain.resolve.extensions.merge(moduleFileExtensions);
    chain.resolve.alias.set('@', fePath);
    chain.resolve.alias.set('_route_dist', serverOutputPath);
    // 我们的前端组件库一点都不规范
    // 因为它直接依赖了 react 和 react-router
    // 如果不指定统一路径就会导致项目的依赖和组件库的依赖不一致
    // chain.resolve.alias.set('react-router', path.join(process.cwd(), 'node_modules/react-router/'));
    // chain.resolve.alias.set('react-router-dom', path.join(process.cwd(), 'node_modules/react-router-dom/'));

    /**
     * 脚本相关的配置
     * isServerSide
     *   - 服务器端不加载 corejs
     *   - 客户端加载 corejs
     */
    scriptPipe(chain, {
        isServerSide: option.isServerSide
    });

    /**
     * 样式相关的配置
     */
    stylePipe(chain);

    /**
     * 静态资源相关的配置
     */
    assetsPipe(chain);


    chain.plugin('minCssExtract').use(MiniCssExtractPlugin, [{
        filename: !isDev ? '[name].[contenthash:8].css' : '[name].css',
        chunkFilename: !isDev ? '[name].[contenthash:8].css' : '[name].css'
    }]);

    chain.plugin('manifest').use(WebpackManifestPlugin);

    return chain;
}