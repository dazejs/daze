import { middleware } from '../../decorators';
import { MiddlewareInterface } from '../../interfaces';
import { Request } from '../../request';
import { Next } from '../../middleware';
import {EResourceTypeList } from '../resource';
import { ResourceItem } from '../item';
import { ResourceCollection } from '../collection';


@middleware()
export class ResourceMiddleware implements MiddlewareInterface {

  private resource: any;

  private type: EResourceTypeList;

  constructor(resource: any, type: EResourceTypeList) {
    this.resource = resource;
    this.type = type;
  }

  async resolve(_request: Request, next: Next) {
    const response = await next();

    if (this.resource && this.type) {
      if (this.type === EResourceTypeList.Item) {
        const data = new ResourceItem(this.resource).setData(response.getData()).output();
        return response.setData(data);
      }
      if (this.type === EResourceTypeList.Collection) {
        const data = new ResourceCollection(this.resource).setData(response.getData()).output();
        return response.setData(data);
      }
    }

    return response;
  }
}