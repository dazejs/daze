
import WebpackChain from 'webpack-chain';
import { getBaseConfig } from './base';
import { isDev, clientOutputPath } from '../../utils/consts';
import { makeMpaClientEntries, makeSpaClientEntries } from '../../bundler/entry';
import webpack from 'webpack';
// import { SSRMainifestPlugin } from '../../bundler/plugins';
import { optimizationPipe } from './pipes';
import LoadablePlugin from '@loadable/webpack-plugin';
import WebpackBar from 'webpackbar';

export async function getClientWebpack(chain: WebpackChain, option: {
    isMpa?: boolean,
    publicPath?: string
} = {}) {
    getBaseConfig(chain, {
        isServerSide: false
    });

    chain.devtool(isDev ? 'eval-source-map' : false);

    // SPA 下客户端的入口
    if (!option.isMpa) {
        const entries: any = await makeSpaClientEntries();
        const keys = Object.keys(entries);
        for (const key of keys) {
            chain.entry(key).add(entries[key]);
        }
    }
    // MPA 下客户端的入口
    else {
        const entries: any = await makeMpaClientEntries();
        console.log(entries);
        const keys = Object.keys(entries);
        for (const key of keys) {
            chain.entry(key).add(entries[key]);
        }
    }

    chain.output.path(clientOutputPath);
    chain.output.publicPath(option.publicPath ?? '/');
    chain.output.filename(!isDev ? '[name].[chunkhash].js' : '[name].js');
    chain.output.chunkFilename(!isDev ? '[name].[chunkhash].chunk.js' : '[name].chunk.js');

    /**
     * 打包优化
     */
    optimizationPipe(chain);

    // 自定义 loader
    chain.module
        .rule('module')
        .test(/\.(js|mjs|jsx|ts|tsx)$/)
        .use('module')
        .loader('module-loader');


    chain.plugin('define').use(webpack.DefinePlugin, [{
        __isBrowser__: true
    }]);

    chain.plugin('provide').use(webpack.ProvidePlugin, [{
        '$__daze_container__': require.resolve('../../container')
    }]);

    chain.plugin('loadable').use(LoadablePlugin, [{
        filename: 'stats.json',
        writeToDisk: true
    }]);

    // chain.plugin('deps').use(SSRMainifestPlugin);

    chain.resolveLoader.alias.merge({
        'module-loader': require.resolve('../../bundler/loader/module')
    });


    chain.plugin('bar').use(WebpackBar, [{
        name: 'SSR-Client',
        color: 'green',
    }]);

    return chain.toConfig();
}