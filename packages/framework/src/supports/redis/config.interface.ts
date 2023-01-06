import { RedisOptions, ClusterNode,  ClusterOptions } from  'ioredis';

type clusterConfig = {
  cluster: boolean,
  nodes: ClusterNode[],
} & ClusterOptions

export interface RedisConfigInterface {
  default: RedisOptions | clusterConfig,
  schedule: RedisOptions | clusterConfig,
  cache: RedisOptions | clusterConfig,
  [key: string]: RedisOptions | clusterConfig,
}