import { Provider } from '../base/provider';
import { provide } from '../decorators/provider';
import { Loader } from './loader';
import { Application } from '../foundation/application';

export class LoaderProvider extends Provider {
  @provide(Loader)
  _loader(app: Application) {
    return new Loader(app);
  }

  @provide('loader')
  _loaderAlias(app: Application) {
    return app.get(Loader);
  }

  async launch() {
    await this.app.get<Loader>(Loader).autoScanApp();
  }
}