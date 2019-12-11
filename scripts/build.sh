
#!/bin/bash
set -e
cp ./README.md ./packages/framework/README.md
cp ./README_en.md ./packages/framework/README_en.md
lerna run build