import path from 'path';

export const isDev = process.env.NODE_ENV !== 'production';
export const fePath = path.join(process.cwd(), process.env.FE_PATH ?? './web');
export const pagesPath = path.join(fePath, process.env.PAGES_PATH ?? './pages');
export const serverOutputPath = path.join(process.cwd(), './public/ssr');
export const clientOutputPath = path.join(process.cwd(), './public/static');
export const moduleFileExtensions = [
    '.mjs',
    '.js',
    '.ts',
    '.tsx',
    '.json',
    '.jsx',
    '.vue',
    '.css',
    '.less',
    '.scss',
];

const builtinPages = ['_html'];
export function isValidatePage(name: string, ext: string) {
    return (
        (/^[a-z0-9-][a-z0-9-_]*$/.test(name) && /^\.?(tsx?|jsx?|vue)$/.test(ext)) || builtinPages.includes(name)
    );
}

export function isReactPage(name: string, ext: string) {
    return (
        (/^[a-z0-9-][a-z0-9-_]*$/.test(name) && /^\.?(tsx?|jsx?)$/.test(ext)) || builtinPages.includes(name)
    );
}

export function isVuePage(name: string, ext: string) {
    return (
        (/^[a-z0-9-][a-z0-9-_]*$/.test(name) && /^\.?(vue)$/.test(ext)) || builtinPages.includes(name)
    );
}

