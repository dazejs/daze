
import chokidar from 'chokidar';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import { debounce, DebouncedFunc } from 'lodash';
import path from 'path';
import webpack from 'webpack';
import WebpackChain from 'webpack-chain';
import { getClientWebpack, getServerWebpack } from '../config/react';
import { isValidatePage, pagesPath } from '../utils/consts';
import { SPARouteParser } from '../utils/parse-spa-routes';
import { timeu } from '../utils/timeu';
import { EventEmitter } from 'events';


export interface BundlerOptionInterface {
    ssr: boolean,
    mpa: boolean,
    log?: any,
    customConfig?: {
        webpack?(cfg: InstanceType<typeof WebpackChain>, wp: typeof webpack): Promise<void>,
        dynamic?: boolean
    };
    publicPath?: string;
}

/**
 * 客户端代码打包器
 */
export class Bundler extends EventEmitter {

    /**
     * 是否构建中
     */
    private isCompiling: Record<'client' | 'server', boolean> = {
        client: false,
        server: false
    };

    /**
     * 是否 SSR 模式
     * 默认 true
     */
    isSsr = true;

    /**
     * 是否多页模式
     * 默认 true
     * 为 false 则为单页模式
     */
    private isMpa = true;

    /**
     * 信息输出的 hook 函数
     */
    private log: any;

    /**
     * 文件监听器
     * 监听文件的变动，来决定是否重新启动 webpack
     */
    private watcher: chokidar.FSWatcher;

    /**
     * 单页模式下的路由解析器
     */
    private spaRouteParser = new SPARouteParser()

    /**
     * webpack FriendlyErrors 插件实例
     */
    private friendlyErr: FriendlyErrorsWebpackPlugin & {
        [k: string]: any;
    } = new FriendlyErrorsWebpackPlugin();

    /**
     * webpack watch 实例集合
     */
    private webpackWatchingInstances: Record<string, ReturnType<webpack.Compiler['watch']> | null> = {};

    /**
     * webpack watch 状态集合
     */
    private bundleStats: Record<string, webpack.Stats | null> = {};

    /**
     * 构建的 Error 信息集合
     */
    private bundleErrors: Error[] = [];

    /**
     * 构建的 Waring 信息集合
     */
    private bundleWarnings: Error[] = [];

    /**
     * 防抖后的 restartWatch 方法
     */
    private _restartWatch: DebouncedFunc<(reason: string) => Promise<void>>;

    /**
     * 框架自定义配置文件
     */
    private _customConfig: BundlerOptionInterface['customConfig'];

    private _publicPath = '';

    /**
     * 开发模式下首次编译
     */
    private _isFirstBuild = true;

    /**
     * 创建打包器实例
     * @param option
     */
    constructor(option: BundlerOptionInterface) {
        super();
        this.isSsr = option.ssr ?? true;
        this.isMpa = option.mpa ?? true;
        // 信息输出来自 cli 的参数
        // 默认使用 console.log
        this.log = option.log ?? console.log;
        this._publicPath = option.publicPath ?? '';
        // 防抖
        this._restartWatch = debounce<(reason: string) => Promise<void>>(this.restartWatch, 200);
        // 自定义配置
        this._customConfig = option.customConfig;
    }

    /**
     * 重新启动监听服务
     * @param reason
     */
    private async restartWatch(reason: string) {
        this.log(reason);
        try {
            if (this.watcher) {
                this.watcher.close();
            }
            Object.values(this.webpackWatchingInstances).forEach((w) =>
                w?.close(() => {
                    //
                }),
            );
            await this.watch();
        } catch (error) {
            this.log('error', error);
        }
    }

    /**
     * 判断文件路径是否是 pages 下合法的页面
     * @param p
     * @returns
     */
    private isPage(p: string) {
        const { name, ext } = path.parse(p);
        return isValidatePage(name, ext);
    }

    /**
     * 编译生产环境的文件
     */
    public async build() {
        const tasks: Promise<void>[] = [];
        if (this.isMpa) {
            this.log('Prepare to build the application in multi-page mode...');
            tasks.push(this.buildClient());

        } else {
            this.log('Prepare to build the application in single-page mode...');
            if (this._customConfig?.dynamic) {
                this.log('Code split mode has been detected...');
            }
            this.log('Routing files are being generated...');
            await this.spaRouteParser.parse(this._customConfig?.dynamic);
            this.log('A route file has been generated...');
            tasks.push(this.buildClient());
        }
        tasks.push(this.buildServer());
        await Promise.all(tasks);
    }

    /**
     * 启动 webpack watch 服务
     */
    public async watch() {
        this.watcher = chokidar.watch(pagesPath, {
            ignoreInitial: true
        });
        this.watcher.on('add', async (f) => {
            if (this.isPage(f)) {
                this.isCompiling.client = false;
                this.isCompiling.server = false;
                await this.spaRouteParser.parse(this._customConfig?.dynamic);
                this._restartWatch('Create a new page and restart Webpack...');
                this.emit('devRestarted');
            }
        });

        this.watcher.on('unlink', async (f) => {
            if (this.isPage(f)) {
                this.isCompiling.client = false;
                this.isCompiling.server = false;
                await this.spaRouteParser.parse(this._customConfig?.dynamic);
                this._restartWatch('Delete a page and restart Webpack...');
                this.emit('devRestarted');
            }
        });

        const tasks: Promise<any>[] = [];

        if (this.isMpa) {
            this.log('Prepare to launch the application in multi-page development mode...');
            tasks.push(this.devClient());
        } else {
            this.log('Prepare to launch the application in single-page development mode...');
            if (this._customConfig?.dynamic) {
                this.log('Code split mode enabled detected...');
            }
            await this.spaRouteParser.parse(this._customConfig?.dynamic);
            tasks.push(this.devClient());
        }
        tasks.push(this.devServer());
        await Promise.all(tasks);
    }

    private async buildServer() {
        const chain = new WebpackChain();
        const config = await getServerWebpack(chain, {
            isMpa: this.isMpa,
            publicPath: this._publicPath
        });
        if (typeof this._customConfig?.webpack === 'function') {
            await this._customConfig.webpack(chain, webpack);
        }
        const process = webpack(config as any, (_, stats) => {
            this.bundleStats['server'] = stats ?? null;
            this._triggerCompilationFinished();
        });
        process.hooks.run.tap('server', () => {
            if (!this.isCompiling.server) {
                this.isCompiling.server = true;
                // this.log('Webpack Server 编译中...');
            }
            this.bundleStats['server'] = null;
        });
    }

    /**
     * 启动 server 端编译监听
     */
    private async devServer() {
        const chain = new WebpackChain();
        const config = await getServerWebpack(chain, {
            isMpa: this.isMpa,
            publicPath: this._publicPath
        });
        if (typeof this._customConfig?.webpack === 'function') {
            await this._customConfig.webpack(chain, webpack);
        }

        const process = webpack(config as any);
        process.hooks.watchRun.tap('server', () => {
            if (!this.isCompiling.server) {
                this.isCompiling.server = true;
                // this.log('Webpack Server 编译中...');
            }
            this.bundleStats['server'] = null;
        });

        return new Promise((resolve) => {
            process.hooks.done.tap('server', (stats) => {
                this.bundleStats['server'] = stats;
                this._triggerCompilationFinished();
            });
            const watching = process.watch({}, () => {
                resolve(true);
            });
            this.webpackWatchingInstances['server'] = watching;
        });
    }


    private async buildClient() {
        const chain = new WebpackChain();
        const config = await getClientWebpack(chain, {
            isMpa: this.isMpa,
            publicPath: this._publicPath
        });
        if (typeof this._customConfig?.webpack === 'function') {
            await this._customConfig.webpack(chain, webpack);
        }
        const process = webpack(config as any);
        process.hooks.run.tap('client', () => {
            if (!this.isCompiling.client) {
                this.isCompiling.client = true;
                // this.log('Webpack Client 编译中...');
            }
            this.bundleStats['client'] = null;
        });

        process.run((_, stats) => {
            this.bundleStats['client'] = stats ?? null;
            this._triggerCompilationFinished();
        });
    }

    /**
     * 启动 web 端编译监听
     */
    private async devClient() {
        const chain = new WebpackChain();
        const config = await getClientWebpack(chain, {
            isMpa: this.isMpa,
            publicPath: this._publicPath
        });
        if (typeof this._customConfig?.webpack === 'function') {
            await this._customConfig.webpack(chain, webpack);
        }
        const process = webpack(config as any);
        process.hooks.watchRun.tap('client', () => {
            if (!this.isCompiling.client) {
                this.isCompiling.client = true;
                // this.log('Webpack Client 编译中...');
            }
            this.bundleStats['client'] = null;
        });
        return new Promise((resolve) => {
            process.hooks.done.tap('client', (stats) => {
                this.bundleStats['client'] = stats;
                this._triggerCompilationFinished();
            });
            const watching = process.watch({}, () => {
                resolve(true);
            });
            this.webpackWatchingInstances['client'] = watching;
        });
    }

    /**
     * 触发编译完成事件
     * @returns
     */
    private _triggerCompilationFinished() {
        const hasIncomplete = Object.values(this.bundleStats).filter((s) => s === null).length > 0;
        if (hasIncomplete) return;
        this.isCompiling.client = false;
        this.isCompiling.server = false;
        this._onCompilationFinished();
    }

    /**
     * 监听编译完成事件
     */
    private _onCompilationFinished() {
        this._collectErrorOrWarning();
        if (this.bundleErrors.length > 0 || this.bundleWarnings.length > 0) {
            if (this.bundleErrors.length) {
                this.friendlyErr.displayErrors(this.bundleErrors, 'error');
            }
            if (this.bundleWarnings.length) {
                this.friendlyErr.displayErrors(this.bundleWarnings, 'warning');
            }
        } else {
            this._displaySuccess();
            if (this._isFirstBuild) {
                this._isFirstBuild = false;
            } else {
                this.emit('restarted');
            }
            this.emit('done');
        }

        this.bundleErrors = [];
        this.bundleWarnings = [];
    }

    /**
     * 输出编译成功信息
     */
    private _displaySuccess() {
        const time = Math.max(
            ...Object.values(this.bundleStats).map(getCompileTime),
        );
        this.log('Compiled successfully in ' + timeu(time));
    }

    /**
     * 收集错误和警告信息
     */
    private _collectErrorOrWarning() {
        Object.entries(this.bundleStats).forEach(([, v]) => {
            if (!v) return;
            if (v.hasErrors()) {
                const errors = this.bundleErrors.concat(
                    extractErrorsFromStats(v, 'errors'),
                );
                this.bundleErrors = uniqueBy(errors, (error) => error.message);
            }
            if (v.hasWarnings()) {
                const warnings = this.bundleWarnings.concat(
                    extractErrorsFromStats(v, 'warnings'),
                );
                this.bundleWarnings = uniqueBy(warnings, (error) => error.message);
            }
        });
    }
}

function uniqueBy(arr: any[], fun: (el: any) => any) {
    const seen: { [k: string]: any } = {};
    return arr.filter((el) => {
        const e = fun(el);
        return !(e in seen) && (seen[e] = 1);
    });
}
function extractErrorsFromStats(stats: webpack.Stats, type: string) {
    const findErrorsRecursive = (
        compilation: webpack.Compilation & {
            [k: string]: any;
        },
    ) => {
        const errors = compilation[type];
        if (errors.length === 0 && compilation.children) {
            for (const child of compilation.children) {
                errors.push(...findErrorsRecursive(child));
            }
        }
        return uniqueBy(errors, (error) => {
            return error.message;
        });
    };
    return findErrorsRecursive(stats.compilation);
}

function getCompileTime(stats: webpack.Stats | null): number {
    if (stats === null) return 0;
    return (stats.endTime ?? 0) - (stats.startTime ?? 0);
}