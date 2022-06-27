/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import fs from 'fs';
import { DazeConfigInterface } from '../config.interface';

/**
 * 注入默认值
 * @param target 
 */
function resolveDefaultValues(target: Record<any, any> = {}) {
  target.dynamic = target.dynamic ?? true;
  return target;
}

/**
 * 加载用户自定义配置
 * daze.config.ts
 * @returns
 */
export async function loadCustomConfig() {
  const cwd = process.cwd();
  const ts = path.resolve(cwd, 'daze.config.ts');
  const js = path.resolve(cwd, 'daze.config.js');
  let deflector: { new(): DazeConfigInterface } | DazeConfigInterface | undefined;
  if (fs.existsSync(ts)) {
    deflector = (await import(ts)).default;
  } else if (fs.existsSync(js)) {
    deflector = (await import(js)).default;
  }
  // 未找到文件
  if (!deflector) return resolveDefaultValues();
  // 定义的类格式
  if (typeof deflector === 'function') {
    return resolveDefaultValues(new deflector());
  }
  // 对象格式
  return resolveDefaultValues(deflector);

}