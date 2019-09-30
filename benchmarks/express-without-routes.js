const express = require('express');
const app = express();

// app.get('/hello', function (req, res) {
//   res.send('Hello World');
// });

const controller = (req, res) => {
  res.send('Hello World')
}

app.use(controller)

// for (let index1 = 1; index1 <= 10; index1++) {
//   for (let index2 = 1; index2 <= 10; index2++) {
//     for (let index3 = 1; index3 <= 10; index3++) {
//       const url = `/uuid${index1}/uuid${index2}/uuid${index3}`
//       app.get(url, controller)
//       app.post(url, controller)
//       app.put(url, controller)
//       app.delete(url, controller)
//       app.patch(url, controller)
//     }
//   }
// }

app.listen(3000);