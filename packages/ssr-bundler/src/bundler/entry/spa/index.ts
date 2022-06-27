import path from 'path';

/**
 * 生成 SPA 模式下 服务端入口
 * @returns
 */
export async function makeSpaServerEntries() {
  // const pageEntries = await makeEntries(pagesPath);
  return {
    __entry: path.join(__dirname, './server_entry'),
  } as any;
}

/**
 * 生成 SPA 模式下客户端入口
 * @returns
 */
export async function makeSpaClientEntries() {
  return {
    __entry: path.join(__dirname, './client_entry')
  };
}



