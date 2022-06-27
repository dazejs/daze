import path from 'path';
import { collectPages } from '../../../utils/collect_page';

/**
 * 根据目录获取 mpa 入口地址
 * @param pagesDir
 * @param maxDepth
 * @returns
 */
export async function makeEntries(
    pagesDir: string,
    maxDepth = 10,
) {
    const pages = await collectPages(pagesDir, maxDepth);
    return pages.pages.reduce((p, c) => {
        const key = ['/404', '/500'].includes(c.route)
            ? c.route.slice(1)
            : 'pages' + c.route;
        p[key] = path.join(pagesDir, c.path);
        return p;
    }, {} as Record<string, string>);
}
