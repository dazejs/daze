import { CreateAction, MakeAction } from './actions';
import { SourceType } from './lib/render';
import { init } from './lib/init';

export * from './config.interface';
export { Webpack, WebpackChain } from '@dazejs/ssr-bundler';

export function terminate(argv: string[]) {
    init(argv);
}

/**
 * 创建应用
 * @param name
 */
export function create(name: string) {
    new CreateAction().source('application').resolve(name);
}

/**
 * 创建模块模板文件
 * @param name
 * @param type
 * @param options
 */
export function make(name: string, type: SourceType, options: any) {
    new MakeAction().source(type).resolve(name, options);
}