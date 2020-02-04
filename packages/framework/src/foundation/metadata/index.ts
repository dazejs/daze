
export class Metadata {
  static get(metadataKey: any, target: Record<string, any>) {
    return Reflect.getMetadata(metadataKey, target);
  }

  static set(metadataKey: any, metadataValue: any, target: Record<string, any>) {
    return Reflect.defineMetadata(metadataKey, metadataValue, target);
  }
}