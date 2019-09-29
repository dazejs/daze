
import childProcess from 'child_process'
import path from 'path'
// @ts-ignore
import autocannon from 'autocannon'

const basePath = path.resolve(__dirname, '../../benchmarks')

const sleep = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

// dazejs

const dazePath = path.join(basePath, 'dazejs')



async function runDaze() {
  const child = childProcess.spawn('node', [path.join(dazePath, 'dist')], {
    stdio: 'inherit',
  });
  await sleep(2000)

  const result = await autocannon({
    url: 'http://localhost:3000/pathto5/pathto5/pathto5',
    connections: 1024,
    pipelining: 1,
    duration: 10
  })
  console.log(result)
  child.kill()
}

runDaze()