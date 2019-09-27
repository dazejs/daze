require('reflect-metadata');
const Controller = require('../../dist/base/controller');
const Router = require('../../dist/router');

class Example extends Controller {
  index() {
    return 'test';
  }
}

const router = new Router();

for (let index = 1; index <= 10; index++) {
  for (let index2 = 1; index2 <= 10; index2++) {
    for (let index3 = 1; index3 <= 10; index3++) {
      for (let index4 = 1; index4 <= 10; index4++) {
        router.register(`/a${index}/b${index2}/c${index3}/d${index4}`, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], Example, 'index', []);
      }
    }
  }
}

function log(index = 1) {
  const p = `/a${index}/b${index}/c${index}/d${index}`;
  console.time(p);
  router.trie.match({
    path: p,
    method: 'GET',
  });
  console.timeEnd(p);
}


log(1);
log(2);
log(3);
log(4);
log(5);
log(6);
log(7);
log(8);
log(9);
log(10);
