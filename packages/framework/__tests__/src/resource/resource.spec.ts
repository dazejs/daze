/* eslint-disable @typescript-eslint/camelcase */
import * as path from 'path';
import request from 'supertest';
import { Application } from '../../../src';
import { Resource } from '../../../src/resource/resource';


const app = new Application(path.resolve(__dirname, './'));

beforeAll(() => app.run(7777));
afterAll(() => app.close());

describe('Resource Feature', () => {
  it('should return resource when return resource instance in controller (item)', async () => {
    const res = await request(app._server)
      .get('/resource/item')
      .expect(200);

    expect(res.text).toBe(JSON.stringify({
      data: {
        name: 'dazejs',
        type: 'node',
      },
    }));
  });

  it('should return resource when return resource instance in controller (collection)', async () => {
    const res = await request(app._server)
      .get('/resource/collection')
      .expect(200);
    expect(res.text).toBe(JSON.stringify({
      data: [{
        name: 'dazejs',
        type: 'node',
      }, {
        name: 'dazejs',
        type: 'node',
      }],
    }));
  });

  it('should return resource when use @useItemResource in controller (item)', async () => {
    const res = await request(app._server)
      .get('/resource/useItemResource')
      .expect(200);

    expect(res.text).toBe(JSON.stringify({
      data: {
        name: 'dazejs',
        type: 'node',
      },
    }));
  });

  it('should return resource when use @useCollectionResource in controller (collection)', async () => {
    const res = await request(app._server)
      .get('/resource/useCollectionResource')
      .expect(200);
    expect(res.text).toBe(JSON.stringify({
      data: [{
        name: 'dazejs',
        type: 'node',
      }, {
        name: 'dazejs',
        type: 'node',
      }],
    }));
  });

  it('should return resource when nest resource in controller', async () => {
    const res = await request(app._server)
      .get('/resource/wrap')
      .expect(200);
    expect(res.text).toBe(JSON.stringify({
      data: {
        name: 'dazejs',
        wrap: {
          key: 'daze',
          type: 'node',
        }
      }
    }));
  });

});

// MARK: Units


describe('Resource units', () => {
  it('should setFormatter and getFmatter suucessful', () => {
    const resource = new Resource();
    const formatter = () => {
      //
    };
    resource.setFormatter(formatter);
    expect(resource.getFormatter()).toBe(formatter);
  });

  it('should setMetaFormatter and getMetaFmatter suucessful', () => {
    const resource = new Resource();
    const formatter = () => {
      //
    };
    resource.setMetaFormatter(formatter);
    expect(resource.getMetaFormatter()).toBe(formatter);
  });

  it('should getKey and setKey scuessful', () => {
    const resource = new Resource();
    resource.setKey('data');
    expect(resource.getKey()).toBe('data');
  });

  it('should setData and getData successful', () => {
    const resource = new Resource();
    const data = {};
    resource.setData(data);
    expect(resource.getData()).toBe(data);
  });

  it('should setMeta and getMeta successful', () => {
    const resource = new Resource();
    const data = {};
    resource.setMeta(data);
    expect(resource.getMeta()).toBe(data);
  });

  describe('Resource#addMeta', () => {
    it('should add meta with string params', () => {
      const resource = new Resource();
      resource.addMeta('key', 'value');
      expect(resource.getMeta()).toEqual({
        key: 'value',
      });
    });

    it('should add meta with object params', () => {
      const resource = new Resource();
      resource.addMeta({
        aaa: 'bbb',
      });
      expect(resource.getMeta()).toEqual({
        aaa: 'bbb',
      });
    });
  });

  it('should set null with withoutKey method', () => {
    const resource = new Resource();
    resource.withoutKey();
    expect(resource.getKey()).toBeUndefined();
  });

});
