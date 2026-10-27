#!/bin/bash
# 使用 Docker 构建野火IM开发手册
# (旧版 gitbook-cli 依赖 Node 10,本机无法安装,因此在 Docker 中构建)
#
# 用法:
#   ./docker-build.sh                   构建文档(含 PDF),输出 docs/ 和 docs.tar.gz
#   WITH_PDF=false ./docker-build.sh    不生成 PDF,构建更快、镜像更小
set -e

IMAGE_NAME="wildfire-gitbook-builder"
WITH_PDF=${WITH_PDF:-true}

echo "==> 构建 Docker 镜像 (WITH_PDF=$WITH_PDF)"
docker build --build-arg WITH_PDF=$WITH_PDF -f Dockerfile.gitbook -t "$IMAGE_NAME" .

echo "==> 从镜像中导出构建产物"
rm -rf docs
cid=$(docker create "$IMAGE_NAME")
docker cp "$cid":/gitbook/_book ./docs
docker rm -v "$cid" > /dev/null

if [ "$WITH_PDF" != "true" ]; then
  rm -rf docs/pdf
fi

echo "==> 拷贝附加静态资源"
cp -af ../trickle-ice docs/webrtc/
cp -af ../abilitytest docs/webrtc/
cp -af ../wstool docs/web/
cp -af ../pricing-calculator docs/price/

echo "==> 打包 docs.tar.gz"
tar -czf docs.tar.gz docs

echo ""
echo "构建完成,产物:"
echo "  docs/          静态站点目录"
echo "  docs.tar.gz    打包文件"
echo ""
echo "如需发布到服务器,请执行:"
echo "  scp docs.tar.gz wfccn:/var/wildfirechat_sites/"
echo "  ssh wfccn 'cd /var/wildfirechat_sites; rm -rf docs; tar -xzvf docs.tar.gz; rm -rf docs.tar.gz'"
