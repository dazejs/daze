import { Pipeline } from '../../../src/pipeline';


describe('Pipeline', () => {
  describe('Pipeline#pipe', () => {
    it('should add stage to pipeline stages', () => {
      const pipeline = new Pipeline();
      const piper = (num: number) => num + 1;
      pipeline.pipe(piper);
      expect(pipeline.stages[0]).toBe(piper);
    });
  });

  describe('Pipeline#send', () => {
    it('should set payloads array', () => {
      const pipeline = new Pipeline();
      pipeline.send(1);
      expect(pipeline.payload).toEqual([1]);
    });
    it('should set payloads array when muilt params', () => {
      const pipeline = new Pipeline();
      pipeline.send(1, 2, 3);
      expect(pipeline.payload).toEqual([1, 2, 3]);
    });
  });

  describe('Pipeline#process', () => {
    it('should return stages apply result', async () => {
      const pipeline = new Pipeline();
      pipeline.pipe((target: any, next: any) => {
        target.a = 1;
        return next();
      });
      pipeline.pipe((target: any, next: any) => {
        target.b = 1;
        return next();
      });
      pipeline.pipe((target: any, next: any) => {
        target.c = 1;
        return next();
      });
      pipeline.send({});
      expect(await pipeline.process((target: any) => target)).toEqual({
        a: 1,
        b: 1,
        c: 1,
      });
    });

    it('should return process apply result whithout stages', async () => {
      const pipeline = new Pipeline();
      pipeline.send({});
      expect(await pipeline.process((target: any) => target)).toEqual({});
    });
  });
});
