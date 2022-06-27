import webpack from 'webpack';
import ChainConfig from 'webpack-chain';

export * from './bundler/bundler';
export { fePath, pagesPath } from './utils/consts';
export type Webpack = typeof webpack;
export type WebpackChain = InstanceType<typeof ChainConfig>;
