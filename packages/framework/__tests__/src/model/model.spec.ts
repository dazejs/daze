/* eslint-disable @typescript-eslint/camelcase */
import path from 'path';
import { Application } from '../../../src';
import { initDb } from './init';
import User from '../../daze/src/app/entities/user';
import Profile from '../../daze/src/app/entities/profile';
import Comment from '../../daze/src/app/entities/comment';
import Role from '../../daze/src/app/entities/role';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());
beforeEach(() => initDb());

afterAll(() => app.get('db').connection().close());

describe('create a model', () => {
  it('should create model as insert', async () => {
    const user = new User();
    const model = await user.create({
      id: 1,
      name: 'dazejs',
      age: 30,
      description: 'test2'
    });
    expect(model.getAttributes()).toEqual({
      id: 1,
      name: 'dazejs',
      age: 30,
      description: 'test2'
    });
    const reuser = await user.get(1);
    expect(reuser.getAttributes()).toEqual({
      id: 1,
      name: 'dazejs',
      age: 30,
      description: 'test2'
    });
  });
});


describe('save a model', () => {
  it('should save model as insert', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'dazejs';
    user.age = 10;
    user.description = 'test1';
    const res = await user.save();
    expect(res).toBeTruthy();
    const record = await app.get('db').connection().table('users').where('id', 1).first();
    expect(record).toEqual({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1'
    });
  });
  it('should save model as update', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'dazejs';
    user.age = 10;
    user.description = 'test1';
    await user.save();
    const res = await user.get(1);
    res.age = 20;
    await res.save();
    const record = await app.get('db').connection().table('users').where('id', 1).first();
    expect(record).toEqual({
      id: 1,
      name: 'dazejs',
      age: 20,
      description: 'test1'
    });
  });
});

describe('get in model', () => {
  it('should return a model', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'dazejs';
    user.age = 10;
    user.description = 'test1';
    await user.save();
    const res = await user.get(1);
    expect(res).toBeInstanceOf(User);
  });
  it('should return rigth record attr', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'dazejs';
    user.age = 10;
    user.description = 'test1';
    await user.save();
    const res = await user.get(1);
    expect(res.getAttributes()).toEqual({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1'
    });
  });
});

describe('destroy in model', () => {
  it('should destroy record', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'dazejs';
    user.age = 10;
    user.description = 'test1';
    await user.save();
    const res = await user.destroy(1);
    const count = await app.get('db').connection().table('users').count();
    expect(res).toBe(1);
    expect(count).toBe(0);
  });
});

describe('one to one relation', () => {
  it('should return relation data', async () => {
    const user = new User();
    const profile = new Profile();
    await user.create({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1',
    });
    await profile.create({
      id: 1,
      user_id: 1,
      motto: 'test1'
    });

    const res = await user.with('profile').get(1);
    expect(res.getAttributes()).toEqual({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1',
      profile: {
        id: 1,
        motto: 'test1',
        user_id: 1,
      }
    });

  });
});


describe('one to many relation', () => {
  it('should return relation data', async () => {
    const user = new User();
    const comment = new Comment();
    await user.create({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1',
    });
    await comment.create({
      id: 1,
      user_id: 1,
      comment: 'test1'
    });
    await comment.create({
      id: 2,
      user_id: 1,
      comment: 'test2'
    });

    const res = await user.with('comments').get(1);
    expect(res.getAttributes()).toEqual({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1',
      comments: [
        {
          id: 1,
          comment: 'test1',
          user_id: 1,
        },
        {
          id: 2,
          comment: 'test2',
          user_id: 1,
        }
      ]
    });

  });

  it('should return belongs to relation data', async () => {
    const user = new User();
    const comment = new Comment();
    await user.create({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1',
    });
    await comment.create({
      id: 1,
      user_id: 1,
      comment: 'test1'
    });

    const res = await comment.with('user').get(1);
    expect(res.getAttributes()).toEqual({
      id: 1,
      comment: 'test1',
      user_id: 1,
      user: {
        id: 1,
        name: 'dazejs',
        age: 10,
        description: 'test1',
      }
    });

  });
});

describe('many to many relation', () => {
  it('should return many to many relation data', async () => {
    const user = new User();
    const role = new Role();
    await user.create({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1',
    });
    await user.create({
      id: 2,
      name: 'dazejs2',
      age: 11,
      description: 'test2',
    });
    await role.create({
      id: 1,
      description: 'test1'
    });
    await role.create({
      id: 2,
      description: 'test2'
    });
    await app.get('db').connection().table('user_role').insertAll([{
      user_id: 1,
      role_id: 1
    }, {
      user_id: 1,
      role_id: 2
    }]);
    const res = await user.with('roles').get(1);
    expect(res.getAttributes()).toEqual({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1',
      roles: [{
        id: 1,
        description: 'test1'
      }, {
        id: 2,
        description: 'test2'
      }]
    });
  });

  // it('should attach relation ship', async () => {
  //   const user = new User();
  //   const role = new Role();
  //   await user.create({
  //     id: 1,
  //     name: 'dazejs',
  //     age: 10,
  //     description: 'test1',
  //   });
  //   await user.create({
  //     id: 2,
  //     name: 'dazejs2',
  //     age: 11,
  //     description: 'test2',
  //   });
  //   await role.create({
  //     id: 1,
  //     description: 'test1'
  //   });
  //   await role.create({
  //     id: 2,
  //     description: 'test2'
  //   });
  //   const user1 = await user.get(1);
  //   await user1.attach('roles', 1, 2);
  //   const res = await user.with('roles').get(1);
  //   expect(res.getAttributes()).toEqual({
  //     id: 1,
  //     name: 'dazejs',
  //     age: 10,
  //     description: 'test1',
  //     roles: [{
  //       id: 1,
  //       description: 'test1'
  //     }, {
  //       id: 2,
  //       description: 'test2'
  //     }]
  //   });
  // });

  // it('should detach relation ship', async () => {
  //   const user = new User();
  //   const role = new Role();
  //   await user.create({
  //     id: 1,
  //     name: 'dazejs',
  //     age: 10,
  //     description: 'test1',
  //   });
  //   await user.create({
  //     id: 2,
  //     name: 'dazejs2',
  //     age: 11,
  //     description: 'test2',
  //   });
  //   await role.create({
  //     id: 1,
  //     description: 'test1'
  //   });
  //   await role.create({
  //     id: 2,
  //     description: 'test2'
  //   });
  //   const user1 = await user.get(1);
  //   await user1.attach('roles', 1, 2);
  //   await user1.detach('roles', 1);
  //   const res = await user.with('roles').get(1);
  //   expect(res.getAttributes()).toEqual({
  //     id: 1,
  //     name: 'dazejs',
  //     age: 10,
  //     description: 'test1',
  //     roles: [{
  //       id: 2,
  //       description: 'test2'
  //     }]
  //   });
  // });
});
