import path from 'path';
import fs from 'fs';
import { CacheStore, StorageItemInterface } from './store';
import { app } from '../../../helpers';
import { encrypt } from '../../../utils/encrypt';

/**
 * 使用内存存储缓存数据
 */
export class FsCacheStore extends CacheStore {
    
  private cachePath: string;

  constructor() {
    super();
    this.cachePath = path.join(app().storeagePath, './cache');
  }

  private getPath(key: string) {
    const sha = encrypt('sha1', key);
    const chunks:string[] = [];
    for (let i = 0; i < sha.length;  i += 2) {
      chunks.push(sha.substring(i, i + 2));
    }
    const parts = chunks.slice(0, 2);
    return path.join(this.cachePath, parts.join('/'), sha);
  }

  private getPayload(key: string) {
    const p = this.getPath(key);
    if (!fs.existsSync(p)) return;
    const contents = fs.readFileSync(p);
    const json = JSON.parse(contents.toString());
    const expiresAt = json.expiresAt ?? 0;
    // 发现已经过期了，则删除文件
    if (expiresAt !== 0 && Date.now() > expiresAt) {
      fs.unlinkSync(p);
      return;
    }
    return json;
  }
    
  /**
     * 获取缓存
     * @param key 
     * @returns 
     */
  async get(key: string) {
    const payload = this.getPayload(key);
    if (!payload) return;
    return payload.value;
  }

  /**
     * 设置缓存
     * @param key 
     * @param value 
     * @param seconds 
     * @returns 
     */
  async set(key: string, value: any, seconds?: number) {
    const p = this.getPath(key);
    if (!fs.existsSync(p)) {
      fs.mkdirSync(path.dirname(p), { recursive: true });
    }
    const item: StorageItemInterface = {
      value,
      expiresAt: seconds ? Date.now() + seconds * 1000 : 0
    };
    fs.writeFileSync(p, JSON.stringify(item));
    return true;
  }

  async add(key: string, value: any, seconds: number) {
    if (await this.get(key)) return false;
    return this.set(key, value, seconds);
  }

  /**
     * 缓存数据增长
     * @param key 
     * @param value 
     * @returns 
     */
  async increment(key: string, value = 1) {
    const existing = this.getPayload(key);
    // 存在正常数据
    if (existing) {
      value = existing.value + 1;
      await this.set(key, value, existing.expiresAt);
    }
    await this.forever(key, value);
    return value; 
  }

  /**
     * 缓存诗句减少
     * @param key 
     * @param value 
     * @returns 
     */
  async decrement(key: string, value = 1) {
    return this.increment(key, value * -1);
  }

  /**
     * 设置一个不会过期的缓存
     * @param key 
     * @param value 
     * @returns 
     */
  async forever(key: string, value: any) {
    return this.set(key, value, 0);
  }

  /**
     * 删除一个缓存
     * @param key 
     * @returns 
     */
  async remove(key: string) {
    const p = this.getPath(key);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      return true;
    }
    return false;
  }

  /**
     * 清空所有缓存
     * @returns 
     */
  async flush() {
    this.emptyDir(this.cachePath);
    this.rmEmptyDir(this.cachePath);
    return true;
  }


  private emptyDir(filePath: string) {
    const files = fs.readdirSync(filePath);//读取该文件夹
    files.forEach((file) => {
      const nextFilePath = `${filePath}/${file}`;
      const states = fs.statSync(nextFilePath);
      if (states.isDirectory()) {
        this.emptyDir(nextFilePath);
      } else {
        fs.unlinkSync(nextFilePath);
      }
    });
  }

  private rmEmptyDir(filePath: string) {
    const files = fs.readdirSync(filePath);
    if (files.length === 0) {
      fs.rmdirSync(filePath);
    } else {
      let tempFiles = 0;
      files.forEach((file) => {
        tempFiles++;
        const nextFilePath = `${filePath}/${file}`;
        this.rmEmptyDir(nextFilePath);
      });
      if(tempFiles === files.length) {
        fs.rmdirSync(filePath);
      }
    }
  }

    
}