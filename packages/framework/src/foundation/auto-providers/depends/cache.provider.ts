import { Provide, Provider, AppendAgent } from '../../../decorators';
import { Cache } from '../../../supports/cache';
import { app } from '../../../helpers';


@Provider()
@AppendAgent()
export class CacheProvider{
  @Provide(Cache)
  _cache() {
    return new Cache();
  }

  @Provide('cache')
  _cacheAlias() {
    return app().get(Cache);
  }
}