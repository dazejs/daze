// import { pagesPath } from 'src/utils/constants';
import webpack from 'webpack';


export class SSRMainifestPlugin {
    static filename = 'ssr.json'
    static pluginName = 'SSRMainifestPlugin'

    option: any = {}

    constructor(option: {
        isMpa?: boolean
    }) {
        this.option = option;
    }

    getFilename(nameWithSuffix: string) {
        const dot = nameWithSuffix.indexOf('.');
        return dot !== -1 ? nameWithSuffix.slice(0, dot) : nameWithSuffix;
    }

    apply(compiler: webpack.Compiler) {
        compiler.hooks.compilation.tap(SSRMainifestPlugin.pluginName, (compilation) => {
            compilation.hooks.processAssets.tap({
                name: SSRMainifestPlugin.pluginName,
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY,
            }, async (chunks) => {
                const options = compiler.options.optimization?.splitChunks;
                if (!options) return;
                const pages: Record<string, any> = {};
                const delimiter = options.automaticNameDelimiter || '-';
                const chunkKeys = Object.keys(chunks);

                for (const chunkKey of chunkKeys) {
                    const sourceName = chunkKey;
                    // console.log(sourceName, 'sourceName');
                    const isMainFile = sourceName.endsWith('.js');
                    const name = this.getFilename(sourceName.split(delimiter)[0]);

                    // console.log(isMainFile, name, 'name');
                    if (name.startsWith('pages/')) {
                        const untreatedRoutePath = name.replace(/^pages/, '');
                        const routePath = untreatedRoutePath.startsWith('/') ? untreatedRoutePath : `/${untreatedRoutePath}`;
                        if (!pages[routePath]) pages[routePath] = {};
                        if (isMainFile) {
                            pages[routePath].source = sourceName;
                        } else {
                            if (pages[routePath].styles) {
                                pages[routePath].styles.push(sourceName);
                            } else {
                                pages[routePath].styles = [sourceName];
                            }
                        }
                    }
                }

                compilation.assets[SSRMainifestPlugin.filename] = new webpack.sources.RawSource(
                    JSON.stringify({
                        pages,
                        isMpa: !!this.option.isMpa
                    }, null, 2),
                    true,
                );
            });
        });
    }
}