import { provide, Provider, AppendAgent } from '../../../decorators';
import { Cache } from '../../../cache';
import { app } from '../../../helpers';


@Provider()
@AppendAgent()
export class CacheProvider{
  @provide(Cache)
  _cache() {
    return new Cache();
  }

  @provide('cache')
  _cacheAlias() {
    return app().get(Cache);
  }
}