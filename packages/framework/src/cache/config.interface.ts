export interface CacheConfigInterface {
  store: 'memory' | 'redis' | 'fs';
  connection: string;
}