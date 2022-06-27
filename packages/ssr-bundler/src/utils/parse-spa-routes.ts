import path from 'path';
import fs from 'fs';
import { pagesPath, fePath, serverOutputPath } from '../utils/consts';

import { collectPages } from './collect_page';

const cwd = process.cwd();

/**
 * 生成 SPA 临时路由文件
 */
export class SPARouteParser {
    async isVUE () {
        const packagePAth = path.join(cwd, './package.json');
        const json = await import(`${packagePAth}`);
        return !!json.dependencies.vue;
    }

    /**
     * 解析路由成字符串（代码）
     */
    async parse(dynamic = true) {
        const routes = await this.getRoutes();
        const routeStr = JSON.stringify(routes, null, 4)
            .replace(/\"\{\{(.+?)\}\}\"/gi, dynamic ? `loadable(() =>import($1))` : `require($1)`);
        await this.writeRoutes(
            `${dynamic ? `import loadable from '@loadable/component';` : ''}
export const FeRoutes = ${routeStr};
export default FeRoutes;`
        );
    }

    /**
     * 将字符串路由代码写入指定临时文件
     * @param routes 
     */
    async writeRoutes(routes: string) {
        if (!fs.existsSync(serverOutputPath)) {
            fs.mkdirSync(serverOutputPath, {
                recursive: true
            });
        }
        await fs.promises.writeFile(path.resolve(serverOutputPath, 'ssr-temp-routes.js'), routes);
    }

    /**
     * 根据目录结构获取路由配置
     * @returns 
     */
    async getRoutes() {
        const declaretiveRoutes = fs.existsSync(path.join(fePath, 'routes.ts'));
        if (declaretiveRoutes) {
            const routes = await import(`${path.join(fePath, 'routes.ts')}`);
            return routes.default;
        }
        const { pages } = await collectPages(pagesPath);
        const routes: any[] = [];
        for (const page of pages) {
            let route = page.route;
            const suffix = '/index';
            if (page.route.endsWith(suffix)) {
                route = page.route.slice(0, -suffix.length);
            }
            const { ext } = path.parse(page.path);
            const pagePath = page.path.replace(ext, '');
            routes.push({
                path: route,
                element: `{{/* webpackChunkName: '${route.replace(/\//gi, '-').replace(/^-/i, '')}' */ '@/pages${pagePath}'}}`
            });
        }
        return routes;
    }

}