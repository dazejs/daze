import { Application, Provider, app } from '@dazejs/framework';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { createController, createMpaController } from './create-controller';
import { ChunkExtractor } from '@loadable/server';
import DefaultLayout from './layout';

@Provider()
export class SSRProvider {

  isMpa = true;

  /**
     * mock 浏览器环境
     * @param app
     */
  polyfill() {
    const dom = new JSDOM('');
    (global as any).window = dom.window;
    (global as any).document = window.document;
    (global as any).screen = window.screen;
    (global as any).location = window.location;
    (global as any).history = window.history;
    (global as any).navigator = window.navigator;
    (global as any).XMLHttpRequest = window.XMLHttpRequest;
    (global as any).File = window.File;
    (global as any).Image = window.Image;
    (global as any).matchMedia = () => ({
      matches: true,
      addListener() {
        //
      },
      removeListener() {
        //
      },
    });
    window.matchMedia = global.matchMedia;
    // 加载用户自定义 polyfill
    const customPolyfill = app().get('config').get('ssr.polyfill');
    if (customPolyfill && typeof customPolyfill === 'function') {
      customPolyfill(window, dom);
    }
  }

  /**
     * 注册
     * @param app
     */
  async register() {
    this.polyfill();
  }

  /**
     * 框架运行的钩子函数
     */
  async launch() {
    console.log(1);
    const _app = app();
    const ssrMapPath = path.join(_app.publicPath, './ssr/ssr.json');
    const manifestPath = path.join(_app.publicPath, './ssr/manifest.json');
    if (!fs.existsSync(ssrMapPath) || !fs.existsSync(manifestPath)) return;
    const ssrmap = (await import(`${ssrMapPath}`)).default;
    console.log(2);
    this.isMpa = !!ssrmap.isMpa;
    const router = _app.get('router');
    // 获取客户端的打包资源列表
    const manifest = await import(`${_app.publicPath}/static/manifest.json`);
    console.log(3);
    const nodeExtractor = new ChunkExtractor({ statsFile: path.resolve(`${_app.publicPath}/ssr/stats.json`), entrypoints: ['__entry'] });
    const webExtractor = new ChunkExtractor({ statsFile: path.resolve(`${_app.publicPath}/static/stats.json`), entrypoints: ['__entry'] });
    console.log(4);
    if (!this.isMpa) {
      console.log(5);
      // 获取 SPA 模式下的路由列表
      const { Routes, Layout } = nodeExtractor.requireEntrypoint('__entry') as any;
      console.log(6);

      for (const route of Routes) {
        const element = route.element;
        const controller = await createController({
          element,
          routes: Routes,
          path: route.path,
          manifest,
          extractor: webExtractor,
          jsOrder: [],
          cssOrder: [],
          // jsOrder: [`runtime~__tiger_entry.js`, `manifest.js`, `__tiger_entry.js`],
          // cssOrder: [`manifest.css`, `__tiger_entry.css`],
          isMpa: this.isMpa,
          Layout
        });
        const suffix = '/index';
        if (route.path.endsWith(suffix)) {
          const omitIndex = route.path.slice(0, -suffix.length);
          router.register(omitIndex, ['GET'], {}, controller);
        }
        router.register(route.path, ['GET'], {}, controller);
      }
    } else {
      const pageKeys = Object.keys(ssrmap.pages);
      for (const routePath of pageKeys) {
        const element = (await import(`${path.join(_app.publicPath, './ssr', ssrmap.pages[routePath].source)}`));
        const { Layout } = (await import(`${path.join(_app.publicPath, './ssr/__entry.server.js')}`));
        const controller = await createMpaController({
          jsOrder: [`runtime~pages${routePath}.js`, `manifest.js`, `pages${routePath}.js`, '__entry.js'],
          cssOrder: [`manifest.css`, `pages${routePath}.css`],
          element,
          manifest,
          // extractor: webExtractor,
          isMpa: this.isMpa,
          Layout: element.Layout ?? Layout ?? DefaultLayout
        });
        const suffix = '/index';
        if (routePath.endsWith(suffix)) {
          const omitIndex = routePath.slice(0, -suffix.length);
          router.register(omitIndex, ['GET'], {}, controller);
        }
        router.register(routePath, ['GET'], {}, controller);
      }
    }
  }
}