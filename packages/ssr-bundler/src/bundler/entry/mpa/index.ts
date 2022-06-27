import path from 'path';
import { pagesPath } from '../../../utils/consts';
import { makeEntries } from '../utils/make_entry';

/**
 * 生成 MPA 模式下 服务端入口
 * @returns
 */
export async function makeMpaServerEntries() {
    const pageEntries = await makeEntries(pagesPath);
    return {
        ...pageEntries,
        __entry: path.join(__dirname, './server_entry'),
    } as any;
}


/**
 * 生成 MPA 模式下客户端入口
 * @returns
 */
export async function makeMpaClientEntries() {
    const pageEntries = await makeEntries(pagesPath);
    return {
        ...pageEntries,
        __entry: path.join(__dirname, './client_entry')
    } as any;
}



