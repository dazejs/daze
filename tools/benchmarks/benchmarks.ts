
import childProcess from 'child_process'
import path from 'path'
import fs from 'fs'
// @ts-ignore
import autocannon from 'autocannon'
// @ts-ignore
import table from 'markdown-table'
import size from 'filesize'

const basePath = path.resolve(__dirname, '../../benchmarks')

const sleep = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

const benchmarksMDPath = path.join(basePath, 'README.md')
const benchmarksMDStream = fs.createWriteStream(benchmarksMDPath)

fs.writeFileSync(benchmarksMDPath, '')

benchmarksMDStream.write('# Benchmarks\n')

const opt = {
  connections: 100,
  pipelining: 10,
  duration: 10
}

const libWithoutRoutes = [
  'daze-without-routes',
  'express-without-routes',
  'koa-without-routes',
];

const libWith1000Routes = [
  'daze-with-1000-routes',
  'express-with-1000-routes',
  'koa-with-1000-routes'
]

async function run(lib: string, url: string) {
  const _targetPath = path.join(basePath, lib)

  const child = childProcess.spawn('node', [_targetPath], {
    stdio: 'inherit',
  });
  await sleep(2000)

  benchmarksMDStream.write('\n')
  benchmarksMDStream.write(`--------------- ${lib} ---------------\n`)
  benchmarksMDStream.write('\n')

  const { requests, throughput } = await autocannon({
    ...opt,
    url,
  })
  child.kill()

  benchmarksMDStream.write(table([
    ['Stat', 'Avg', 'Stdev', 'Min'],
    ['Req/Sec', requests.average, requests.stddev, requests.min],
    ['Bytes/Sec', size(throughput.average), size(requests.stddev), size(requests.min)]
  ]))
  benchmarksMDStream.write('\n')
  benchmarksMDStream.write('\n')
}

(async () => {
  for (const lib of libWithoutRoutes) {
    await run(lib, 'http://localhost:3000/hello')
  }

  for (const lib of libWith1000Routes) {
    await run(lib, 'http://localhost:3000/uuid5/uuid5/uuid5')
  }
})()

