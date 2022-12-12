import { CacheConfigInterface } from '../../../packages/common/dist';

export default {
    /**
     * 默认使用的存储器
     * 可选：memory ｜ redis | fs
     */
    store: 'fs'
    
} as CacheConfigInterface;