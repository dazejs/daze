
import childProcess from 'child_process'
import path from 'path'
// @ts-ignore
import autocannon from 'autocannon'

const basePath = path.resolve(__dirname, './benchmarks')

const sleep = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

// dazejs

const dazePath = path.join(basePath, 'dazejs')



async function runDaze() {
  const child = childProcess.spawn('node', [dazePath], {
    stdio: 'ignore',
  });
  await sleep(2000)

  const result = await autocannon({
    url: 'http://127.0.0.1:3000',
    connections: 10,
    pipelining: 8,
    duration: 10
  })
  console.log(result)
  child.kill()
}

runDaze()