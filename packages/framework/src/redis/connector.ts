
import IORedis from 'ioredis';


export class Connector {
  connect(options: any) {
    if (options.cluster === true) {
      const nodes = options.nodes || [];
      if (!nodes || !nodes.length) return;
      return new IORedis.Cluster(nodes, options);
    } else if (options.sentinels) {
      if (!options.sentinels || !options.sentinels.length) return;
      return new IORedis(options);
    } else {
      return new IORedis(options);
    }
  }
}