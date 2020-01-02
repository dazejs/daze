import { Config, Module, Provide, ProvideOnConfig, ProvideOnMissing } from "../../../decorators";
import { RedisStore } from "./redis-store";

@ProvideOnConfig("daze.redis")
@Module()
export class RedisAutoModule {
  
  @Config("daze.redis")
  private redisConfig: object = { };
  
  @Provide()
  @ProvideOnMissing(RedisStore)
  redisStore(): RedisStore {
    return new RedisStore(this.redisConfig);
  }
}
