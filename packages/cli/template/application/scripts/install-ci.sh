#!/bin/bash
set -o errexit

npm install --registry http://npm.hz.infra.mail/registry/ --unsafe-perm=true --allow-root

