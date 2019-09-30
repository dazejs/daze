
#!/bin/bash
set -e
cp ./README.md ./packages/framework/README.md
cp ./README_zh.md ./packages/framework/README_zh.md
lerna run build