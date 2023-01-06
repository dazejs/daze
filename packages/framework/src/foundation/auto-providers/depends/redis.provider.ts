import { Provide, Provider, AppendAgent } from '../../../decorators';
import { Redis } from '../../../supports/redis';
import { app } from '../../../helpers';


@Provider()
@AppendAgent()
export class RedisProvider{
  @Provide(Redis)
  _database() {
    return new Redis();
  }

  @Provide('redis')
  _databaseAlias() {
    return app().get(Redis);
  }
}