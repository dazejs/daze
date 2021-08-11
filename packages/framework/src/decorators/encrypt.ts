

export const encryptResponse: MethodDecorator | ClassDecorator = function (...args: any[]) {
    // decorator class
    if (args.length === 1) {
        const [target] = args;
        Reflect.defineMetadata('encrypt', true, target);
    }
    // decorator method
    else {
        const [target, name] = args;
        Reflect.defineMetadata('encrypt', true, target.constructor, name);
    }
  };

export const EncryptResponse = encryptResponse;