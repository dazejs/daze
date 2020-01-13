import { RedisStore } from './redis-store';
import { Provide, ProvideOnConfig, ProvideOnMissing } from '../../../decorators/provider';
import { Provider } from '../../../decorators/provider/provider';
import { Config } from '../../../decorators';
import { Provider as BaseProvider } from '../../../base/provider';

@ProvideOnConfig('daze.redis')
@Provider()
export class RedisProvider extends BaseProvider {
  
  @Config('daze.redis')
  private redisConfig: object = { };
  
  @Provide()
  @ProvideOnMissing(RedisStore)
  redisStore(): RedisStore {
    return new RedisStore(this.redisConfig);
  }
}
