
import WebpackChain from 'webpack-chain';
import { getBaseConfig } from './base';
import { isDev, serverOutputPath } from '../../utils/consts';
import { makeMpaServerEntries, makeSpaServerEntries } from '../../bundler/entry';
import nodeExternals from 'webpack-node-externals';
import webpack from 'webpack';
import path from 'path';
import { SSRMainifestPlugin } from '../../bundler/plugins';
import LoadablePlugin from '@loadable/webpack-plugin';
import WebpackBar from 'webpackbar';

export async function getServerWebpack(chain: WebpackChain, option: {
    isMpa?: boolean,
    publicPath?: string
} = {}) {
    // 生成基础配置
    getBaseConfig(chain, {
        isServerSide: true,
    });

    chain.devtool(isDev ? 'eval-source-map' : false);

    // 服务端目标为 node
    chain.target('node');

    // SPA 单页模式的入口
    if (!option.isMpa) {
        const entries = await makeSpaServerEntries();
        const keys = Object.keys(entries);
        for (const key of keys) {
            chain.entry(key).add(entries[key]);
        }
    }
    // MPA 模式下的入口
    else {
        const entries = await makeMpaServerEntries();
        const keys = Object.keys(entries);
        for (const key of keys) {
            chain.entry(key).add(entries[key]);
        }
    }

    // output
    chain.output.path(serverOutputPath);
    chain.output.publicPath(option.publicPath ?? '');
    chain.output.filename('[name].server.js');
    chain.output.libraryTarget('commonjs');

    // 服务端不需要打包 node
    chain.externals(nodeExternals({
        allowlist: [/\.(css|less|sass|scss)$/, /\.(bmp|gif|jpe?g|png|svg)$/, /antd.*?(style)/, /uuid/, /^@babel\/runtime/],
        modulesDir: path.join(process.cwd(), './node_modules'),
        additionalModuleDirs: [path.join(__dirname, '../../../node_modules')]
    }));

    chain.plugin('define').use(webpack.DefinePlugin, [{
        __isBrowser__: false
    }]);

    chain.plugin('deps').use(SSRMainifestPlugin, [{
        isMpa: option.isMpa
    }]);

    chain.plugin('loadable').use(LoadablePlugin, [{
        filename: 'stats.json',
        writeToDisk: true
    }]);


    // optimizationPipe(chain);

    chain.plugin('serverLimit').use(webpack.optimize.LimitChunkCountPlugin, [{
        maxChunks: 1
    }]);

    chain.plugin('bar').use(WebpackBar, [{
        name: 'SSR-Server',
        color: 'blue',
    }]);

    const config = chain.toConfig();
    return config;
}