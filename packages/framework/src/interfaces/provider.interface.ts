

export interface ProviderInterface {
  register?(): void | Promise<void>;
  launch?(): void | Promise<void>;
  [key: string]: any;
}