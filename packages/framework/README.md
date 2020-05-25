
[![GitHub issues](https://img.shields.io/github/issues/dazejs/daze.svg)](https://github.com/dazejs/daze/issues)
[![npm](https://img.shields.io/npm/v/@dazejs/framework.svg)](https://www.npmjs.com/package/@dazejs/framework)
[![npm](https://img.shields.io/npm/dm/@dazejs/framework.svg)](https://www.npmjs.com/package/@dazejs/framework)
[![actions](https://github.com/dazejs/daze/workflows/Node%20CI/badge.svg)](https://github.com/dazejs/daze/actions)
[![codecov](https://codecov.io/gh/dazejs/daze/branch/master/graph/badge.svg)](https://codecov.io/gh/dazejs/daze)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/09d6f0f7a58d406c9c9b8ec4abaab2a6)](https://www.codacy.com/manual/dazejs/daze?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dazejs/daze&amp;utm_campaign=Badge_Grade)
[![GitHub license](https://img.shields.io/github/license/dazejs/daze.svg)](https://github.com/dazejs/daze/blob/master/LICENSE)

<div align="center">
  <a href="https://github.com/dazejs/daze">
    <img width="200" heigth="200" src="https://github.com/dazejs/daze/blob/master/assets/logo.png">
  </a>  
  <h1>Daze.js</h1>
  <h4>Node.js 的 Web 框架</h4>
</div>

中文 | [English](README_en.md)


访问 [https://dazejs.org/](https://dazejs.org/) 了解更多

## 介绍

`Daze.js` 是一款高性能、高扩展性、功能强大的 `Node.js` 服务端 Web 开发框架。

## 特性

- 基于 TypeScript 开发
- 面向切面编程（AOP）
- 提供 ORM、验证器、资源层、服务层、中间层等抽象层能力
- 基于 IOC 容器设计模式，模块高度解耦，支持依赖注入
- 高性能路由设计，性能优异
- 可通过服务提供者模式进行扩展，具有非常强大的扩展能力

## 快速开始

##### 安装工具

```bash
$ npm install -g @dazejs/cli
```

##### 创建工程

```bash
$ daze create example
$ cd example
$ npm start
```

访问 `http://localhost:8080` 进行预览

## 文档 & 社区

- [中文文档](https://dazejs.org/)

## 贡献者

请告诉我们可以为你做点什么，在此之前，首先查看 [Issues](https://github.com/dazejs/daze/issues) 来获取 BUG 报告或建议。

想成为一个贡献者, 请参考我们的[贡献指南](CONTRIBUTING.md)

感谢所有为这个项目做出贡献的人！

## 基准测试

基准测试对比了一些其他的框架，主要通过没有路由与定义1000个路由的情况下进行比较，详见[benchmarks](benchmarks/README.md)

## License

Daze.js is [MIT licensed](https://github.com/dazejs/daze/blob/master/LICENSE)

