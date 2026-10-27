#!/bin/bash
# Docker 版本的 publish.sh:在 Docker 中构建文档并发布到服务器
# (旧版 gitbook-cli 依赖 Node 10,本机无法安装,因此在 Docker 中构建)
#
# 用法:
#   ./docker-publish.sh                   构建文档(含 PDF)并发布
#   WITH_PDF=false ./docker-publish.sh    不生成 PDF,构建更快、镜像更小
set -e

WITH_PDF=${WITH_PDF:-true}

# 构建并打包(生成 docs/ 和 docs.tar.gz)
WITH_PDF=$WITH_PDF ./docker-build.sh

echo "==> 发布到服务器"
scp docs.tar.gz wfccn:/var/wildfirechat_sites/
ssh wfccn 'cd /var/wildfirechat_sites; rm -rf docs; tar -xzvf docs.tar.gz; rm -rf docs.tar.gz'

echo "==> 清理本地产物"
rm -rf docs docs.tar.gz

echo "发布完成"
