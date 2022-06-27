#!/bin/bash
set -o errexit

# 当前路径
CURDIR=$(cd `dirname $0`; pwd)

SRCDIR=${CURDIR}/..

# 编译
npm run build

mkdir -p ${SRCDIR}/build/src
cp -rf ${SRCDIR}/dist/* ${SRCDIR}/build/src
cp ${SRCDIR}/package.json ${SRCDIR}/build
cp -rf ${SRCDIR}/views ${SRCDIR}/build/views
cp -rf ${SRCDIR}/public ${SRCDIR}/build/public

# 只安装生产环境需要的依赖
cd build && npm install --production --registry http://npm.hz.infra.mail/registry/ --unsafe-perm=true --allow-root && cd -
