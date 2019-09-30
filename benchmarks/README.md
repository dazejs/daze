# Benchmarks

--------------- daze-without-routes ---------------
| Stat      | Avg      | Stdev   | Min      |
| --------- | -------- | ------- | -------- |
| Req/Sec   | 60309.82 | 3500.61 | 51373    |
| Bytes/Sec | 8.74 MB  | 3.42 KB | 50.17 KB |

--------------- express-without-routes ---------------
| Stat      | Avg      | Stdev   | Min      |
| --------- | -------- | ------- | -------- |
| Req/Sec   | 27583.28 | 4111.59 | 19551    |
| Bytes/Sec | 5.66 MB  | 4.02 KB | 19.09 KB |

--------------- koa-without-routes ---------------
| Stat      | Avg      | Stdev   | Min      |
| --------- | -------- | ------- | -------- |
| Req/Sec   | 53118.55 | 4037.6  | 42524    |
| Bytes/Sec | 7.7 MB   | 3.94 KB | 41.53 KB |

--------------- daze-with-1000-routes ---------------
| Stat      | Avg      | Stdev   | Min      |
| --------- | -------- | ------- | -------- |
| Req/Sec   | 32714.19 | 4912.22 | 17478    |
| Bytes/Sec | 4.74 MB  | 4.8 KB  | 17.07 KB |

--------------- express-with-1000-routes ---------------
| Stat      | Avg      | Stdev   | Min     |
| --------- | -------- | ------- | ------- |
| Req/Sec   | 11694.73 | 1660.15 | 6587    |
| Bytes/Sec | 2.4 MB   | 1.62 KB | 6.43 KB |

--------------- koa-with-1000-routes ---------------
| Stat      | Avg    | Stdev  | Min     |
| --------- | ------ | ------ | ------- |
| Req/Sec   | 6927.2 | 576.19 | 5260    |
| Bytes/Sec | 1 MB   | 576 B  | 5.14 KB |
