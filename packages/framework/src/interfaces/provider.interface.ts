import { Application } from '../foundation/application';

export interface ProviderInterface {
  register?: (app: Application) => any;
  launch?: (app: Application) => any;
  [key: string]: any;
}