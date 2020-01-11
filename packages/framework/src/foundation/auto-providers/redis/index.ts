import { RedisStore } from "./redis-store";
import { Provide, ProvideOnConfig, ProvideOnMissing, Provider } from "../../../decorators/provider";
import { Config } from "../../../decorators";

@ProvideOnConfig("daze.redis")
@Provider()
export class RedisProvider {
  
  @Config("daze.redis")
  private redisConfig: object = { };
  
  @Provide()
  @ProvideOnMissing(RedisStore)
  redisStore(): RedisStore {
    return new RedisStore(this.redisConfig);
  }
}
