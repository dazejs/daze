import { Webpack, WebpackChain } from '@dazejs/ssr-bundler';

export interface TigerConfigInterface {
    webpack(cfg: WebpackChain, wp: Webpack): Promise<void>,
    dynamic?: boolean;
}