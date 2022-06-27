import { Webpack, WebpackChain } from '@dazejs/ssr-bundler';

export interface DazeConfigInterface {
  webpack(cfg: WebpackChain, wp: Webpack): Promise<void>;
  dynamic?: boolean;
}