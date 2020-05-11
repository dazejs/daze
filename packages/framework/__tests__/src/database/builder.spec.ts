import path from 'path';
import 'reflect-metadata';
import { Application } from '../../../src';
import { initDb } from './init';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());
beforeEach(() => initDb());


afterAll(() => app.get('db').connection().close());

describe('insert record use builder', () => {
  it('should return id when insert success', async () => {
    const id = await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    expect(id).toBe(1);
  });
});

describe('columns in builder',  () => {
  it('should return set columns', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    const record = await app.get('db').connection().table('users').columns('name', 'age').first();
    expect(record).toEqual({
      name: 'dazejs',
      age: 18
    });
  });
  it('should return all columns default', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    const record = await app.get('db').connection().table('users').columns().first();
    expect(record).toEqual({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: null
    });
  });
});

describe('find record use builder', () => {
  it('should return records when find success', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'dazejs',
      age: 20
    });
    const records = await app.get('db').connection().table('users').columns('id', 'name', 'age').find();
    expect(records).toEqual([{
      id: 1,
      name: 'dazejs',
      age: 18
    }, {
      id: 2,
      name: 'dazejs',
      age: 20
    }]);
  });
});


describe('get record by id use builder', () => {
  it('should return record when get success', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    const record = await app.get('db').connection().table('users').columns('id', 'name', 'age').first();
    expect(record).toEqual({
      id: 1,
      name: 'dazejs',
      age: 18
    });
  });
});


describe('update record use builder', () => {
  it('should return rows number when update success', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    const rows = await app.get('db').connection().table('users').where('id', 1).update({
      age: 20
    });
    const record = await app.get('db').connection().table('users').columns('id', 'name', 'age').first();
    expect(rows).toBe(1);
    expect(record).toEqual({
      id: 1,
      name: 'dazejs',
      age: 20
    });
  });
});

describe('whereIn in builder', () => {
  it('should return record use where', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'zewail',
      age: 20
    });
    const record1 = await app.get('db').connection().table('users').columns('id', 'name', 'age').where('id', '=', 1).first();
    const record2 = await app.get('db').connection().table('users').columns('id', 'name', 'age').where('id', 2).first();
    expect(record1).toEqual({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    expect(record2).toEqual({
      id: 2,
      name: 'zewail',
      age: 20
    });
  });

  it('should return records use whereIn', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'zewail',
      age: 20
    });
    await app.get('db').connection().table('users').insert({
      id: 3,
      name: 'test',
      age: 22
    });
    const records = await app.get('db').connection().table('users').columns('id', 'name', 'age').whereIn('id', [1, 2]).find();
    expect(records).toEqual([{
      id: 1,
      name: 'dazejs',
      age: 18
    }, {
      id: 2,
      name: 'zewail',
      age: 20
    }]);
  });
});

describe('whereNull in builder', () => {
  it('should return null column', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'test'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'dazejs',
      age: 20,
    });
    const record = await app.get('db').connection().table('users').columns('id', 'description').whereNull('description').first();
    expect(record).toEqual({
      id: 2,
      description: null
    });
  });
});

describe('columns in builder', () => {
  it('should return pre-defined columns witt muti args', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'test'
    });
    const record = await app.get('db').connection().table('users').columns('id', 'description').first();
    expect(record).toEqual({
      id: 1,
      description: 'test'
    });
  });

  it('should return pre-defined columns witt array arg', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'test'
    });
    const record = await app.get('db').connection().table('users').columns(['id', 'description']).first();
    expect(record).toEqual({
      id: 1,
      description: 'test'
    });
  });

  it('should return pre-defined fields ', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'test'
    });
    const record = await app.get('db').connection().table('users').fields('id', 'description').first();
    expect(record).toEqual({
      id: 1,
      description: 'test'
    });
  });
});

describe('orWhere in builder', () => {
  it('should return eligible records', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'test'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'zewail',
      age: 20,
      description: 'test2'
    });
    const records = await app.get('db').connection().table('users').where('id', 1).orWhere('id', 2).fields('id').find();
    expect(records).toEqual([{
      id: 1
    }, {
      id: 2
    }]);
  });
});

describe('whereRaw in builder', () => {
  it('should return eligible records', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'test'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'zewail',
      age: 20,
      description: 'test2'
    });
    const record = await app.get('db').connection().table('users').columns('id').whereRaw('id = ?', [2]).first();
    expect(record).toEqual({
      id: 2
    });
  });
});

describe('orWhereRaw in builder', () => {
  it('should return eligible record', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'test'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'zewail',
      age: 20,
      description: 'test2'
    });
    const records = await app.get('db').connection().table('users').where('id', 1).orWhereRaw('id = ?', [2]).fields('id').find();
    expect(records).toEqual([{
      id: 1
    }, {
      id: 2
    }]);
  });
});

describe('whereColumn in builder', () => {
  it('should return eligible record', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'dazejs'
    });
    const record = await app.get('db').connection().table('users').whereColumn('name', 'description').fields('id').first();
    expect(record).toEqual({
      id: 1
    });
  });
}); 


describe('count() in builder', () => {
  it('should return counts', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'dazejs'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'dazejs',
      age: 18,
      description: 'dazejs'
    });
    const count = await app.get('db').connection().table('users').count();
    expect(count).toBe(2);
  });
});

describe('max() in builder', () => {
  it('should return max age', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'dazejs'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'dazejs',
      age: 20,
      description: 'dazejs'
    });
    const max = await app.get('db').connection().table('users').max('age');
    expect(max).toBe(20);
  });
});

describe('min() in builder', () => {
  it('should return min age', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'dazejs'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'dazejs',
      age: 20,
      description: 'dazejs'
    });
    const min = await app.get('db').connection().table('users').min('age');
    expect(min).toBe(18);
  });
});

describe('sum() in builder', () => {
  it('should return sum', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'dazejs'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'dazejs',
      age: 20,
      description: 'dazejs'
    });
    const sum = await app.get('db').connection().table('users').sum('age');
    expect(sum).toBe(38);
  });
});

describe('avg() in builder', () => {
  it('should return avg age', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'dazejs'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'dazejs',
      age: 20,
      description: 'dazejs'
    });
    const avg = await app.get('db').connection().table('users').avg('age');
    expect(avg).toBe(19);
  });
});

describe('orderBy in builder', () => {
  it('should return sorted recoreds', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'test'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'zewail',
      age: 20,
      description: 'test2'
    });
    const records = await app.get('db').connection().table('users').fields('id').orderBy('id', 'desc').find();
    expect(records).toEqual([{
      id: 2
    }, {
      id: 1
    }]);
  });
});