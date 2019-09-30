const express = require('express');
const app = express();

const controller = (req, res) => {
  res.send('Hello World')
}

for (let index1 = 1; index1 <= 10; index1++) {
  for (let index2 = 1; index2 <= 10; index2++) {
    for (let index3 = 1; index3 <= 10; index3++) {
      const url = `/uuid${index1}/uuid${index2}/uuid${index3}`
      app.get(url, controller)
    }
  }
}


app.listen(3000);