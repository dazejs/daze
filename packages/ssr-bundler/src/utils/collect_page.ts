
import fs from 'fs';
import path from 'path';
import { isReactPage, isVuePage } from '../utils/consts';

export interface PageInfo {
    name: string;
    path: string;
    ext: string;
    route: string;
    type?: 'react' | 'vue',
}

async function _collectPages(
    rootDir: string,
    currentDir: string,
    pages: PageInfo[],
    invalidPages: PageInfo[],
    depth = 1,
    maxDepth = 10,
) {
    if (depth > maxDepth) return;
    const subFiles = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const file of subFiles) {
        const pathname = path.join(currentDir, file.name);
        if (file.isDirectory()) {
            const { name } = path.parse(pathname);
            if (name.startsWith('_')) continue;
            await _collectPages(
                rootDir,
                pathname,
                pages,
                invalidPages,
                depth + 1,
                maxDepth,
            );
        } else {
            const { name, ext } = path.parse(pathname);
            const relativePath = pathname.replace(rootDir, '');
            const route = relativePath.replace(ext, '');
            const info: PageInfo = {
                name,
                path: relativePath,
                ext,
                route,
            };

            if (isReactPage(name, ext)) {
                pages.push({
                    ...info,
                    type: 'react'
                });
            } else if (isVuePage(name, ext)) {
                pages.push({
                    ...info,
                    type: 'vue'
                });
            } else {
                invalidPages.push(info);
            }
        }
    }
}

/**
 * 递归查询页面
 * @param rootDir
 * @param maxDepth
 * @returns
 */
export async function collectPages(
    rootDir: string,
    maxDepth = 10,
) {
    const pages: PageInfo[] = [];
    const invalidPages: PageInfo[] = [];
    await _collectPages(rootDir, rootDir, pages, invalidPages, 1, maxDepth);
    return {
        pages,
        invalidPages,
    };
}