
import { interpolateName } from 'loader-utils';
import webpack from 'webpack';
import { isValidatePage, pagesPath } from '../../utils/consts';

/**
 * Webpack Loader
 * 在每个页面添加注册模块的代码
 * 用于客户端构建流程
 *
 * 用于 MPA 模式
 * 注册模块后客户端就可以根据路由地址查询到入口模块
 * @param source
 * @returns
 */
const moduleLoader: webpack.LoaderDefinitionFunction = function (source: string) {
    const interpolatedName = (pattern: string) => {
        return interpolateName(this as any, pattern, {
            source
        });
    };

    const file = interpolatedName('[path][name].[ext]');
    const name = interpolatedName('[name]');
    const ext = interpolatedName('[ext]');

    const isPageModule = isValidatePage(name, ext);
    if (isPageModule && file.startsWith(pagesPath)) {
        const route = interpolatedName('[path][name]').replace(pagesPath, '');
        return `${source};$__daze_container__.register('${route}', function () {
            var mod = require('${file}');
            return mod;
        })`;
    }

    return source;
};


export default moduleLoader;