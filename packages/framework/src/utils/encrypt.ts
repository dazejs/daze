
import { createHash, BinaryLike } from 'crypto';

export const encrypt = (algorithm: string, content: BinaryLike) => {
  const hash = createHash(algorithm);
  hash.update(content);
  return hash.digest('hex');
};