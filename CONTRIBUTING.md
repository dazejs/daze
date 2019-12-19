# 贡献指南

# Contributing to Transcriptase

我们非常乐意看到大家的建议与意见！我们希望为这个项目做贡献尽可能简单和透明，不管它是不是:

- 报告 Bug
- 讨论 Daze.js 的现状
- 提交 Pull Request
- 新功能建议
- 成为项目维护者

## 我们通过 Github 贡献代码
We use github to host code, to track issues and feature requests, as well as accept pull requests.
我们使用 Github 托管代码，跟踪 Issue 和 Pull Request，以及接受 Pull Request。

## 我们使用 [Github Flow](https://guides.github.com/introduction/flow/index.html)，所以所有的代码更改都是通过 Pull Request 进行的

Pull requests 提议更改代码库的最佳方式 ([Github Flow](https://guides.github.com/introduction/flow/index.html)). 我们非常欢迎您的 Pull Requests:

1. Fork 本仓库并从 `master` 创建您自己的分支
2. 如果您添加了应该测试的代码，请添加测试。
3. 如果更改了 api，请更新文档
4. 确保测试全部通过
5. 确保你的代码可以通过风格检测
6. 提交你的 Pull Request!

## 所有贡献都是基于 MIT License

简而言之，您的所有提交都将使用该项目下的 [MIT License](http://choosealicense.com/licenses/mit/)，如果有疑问，请随时联系维护人员。

## 使用 Github 的 [issues](https://github.com/dazejs/daze/issues) 报告 Bug
我们使用 Github 的 Issues 来跟踪 Bug. 报告 Bug 通过 [opening a new issue]()!

## Write bug reports with detail, background, and sample code
## 报告 Bug 请尽可能详细

**一个合格的Bug报告** 应该包含:

```txt
Daze version: X.Y.Z
    <!-- Check whether this is still an issue in the most recent Daze version -->
    
    For Tooling issues:
    - Node version: XX  <!-- run `node --version` -->
    - Platform:  <!-- Mac, Linux, Windows -->

    Others:
    <!-- Anything else relevant?  Operating system version, IDE, package manager, ... -->
```

## 使用一致的代码风格

* 2个空格用于缩进而不是制表符
* 您可以执行 `npm run lint` 来检测代码风格

## Commit 提交规范

使用 [angular Commits](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) 风格提交 commit， 这样 history 看起来更加清晰，还可以自动生成 changelog


```xml
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### type

提交 commit 的类型，包括以下几种:

- feat: 新功能
- fix: 修复问题
- docs: 修改文档
- style: 修改代码格式，不影响代码逻辑
- refactor: 重构代码，理论上不影响现有功能
- perf: 提升性能
- test: 增加修改测试用例
- chore: 修改工具相关（包括但不限于文档、代码生成等）
- deps: 升级依赖

#### scope

修改文件的范围（包括但不限于 doc, model, controller, db, provider......) 等内置模块

#### subject

一句话清楚的描述这次提交做了什么

#### body

补充 subject，适当增加原因、目的等相关因素，可选

#### footer

- 当有非兼容修改(Breaking Change)时必须在这里描述清楚
- 关联相关 issue，如 `Closes #1`, `Closes #2, #3`

## License
MIT License
