import { useMiddleware } from './use-middleware';
import { ResourceMiddleware } from '../../resource/middleares/resource-middleware';
import { EResourceTypeList } from '../../resource/resource';


export const useItemResource = function (resource: any): MethodDecorator {
  return useMiddleware(ResourceMiddleware, [resource, EResourceTypeList.Item]);
};

export const useCollectionResource = function (resource: any): MethodDecorator {
  return useMiddleware(ResourceMiddleware, [resource, EResourceTypeList.Collection]);
};

export const UseItemResource = useItemResource;
export const UseCollectionResource = useCollectionResource;