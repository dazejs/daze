import { RedisStore } from "./redis-store";
import { Provide, ProvideOnConfig, ProvideOnMissing } from "../../../decorators/provider";
import { Provider } from "../../../decorators/provider/provider";
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
