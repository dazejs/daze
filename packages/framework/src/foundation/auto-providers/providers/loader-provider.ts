import { Provide, Disable } from '../../../decorators';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';

export class LoaderProvider {

  // @inject() app: Application;

  @Provide(Loader)
  @Disable
  _loader(app: Application) {
    return new Loader(app);
  }

  @Provide('loader')
  @Disable
  _loaderAlias(app: Application) {
    return app.get(Loader);
  }
}