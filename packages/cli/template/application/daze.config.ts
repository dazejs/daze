import { DazeConfigInterface, Webpack, WebpackChain } from '@dazejs/cli';

/**
 * Tiger 编译时配置
 */
export default class implements DazeConfigInterface {
    /**
     * 是否开启异步路由（按路由拆分代码）
     */
    dynamic = true
    /**
     * 自定义 webpack 配置
     * @param webpackChain 
     * @param webpack 
     */
    async webpack(webpackChain: WebpackChain, webpack: Webpack) {
        // TODO
    }
}