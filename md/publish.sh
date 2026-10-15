set -e

gitbook build
mv _book docs
gitbook pdf .  野火IM开发文档.pdf
mkdir -p docs/pdf
mv 野火IM开发文档.pdf docs/pdf
cp -af ../trickle-ice docs/webrtc/
cp -af ../abilitytest docs/webrtc/
cp -af ../wstool docs/web/
cp -af ../pricing-calculator docs/price/

system=`uname`
if [ "$system" == "Darwin" ]; then
  find docs/ -type f -name "*.html" -exec sed -i '' 's|https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css|https://static.wildfirechat.cn/bootstrap-3.3.7.min.css|g' {} \;
  find docs/ -type f -name "*.html" -exec sed -i '' 's|https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js|https://static.wildfirechat.cn/bootstrap-3.3.7.min.js|g' {} \;
else
  find docs/ -type f -name "*.html" -exec sed -i 's|https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css|https://static.wildfirechat.cn/bootstrap-3.3.7.min.css|g' {} \;
  find docs/ -type f -name "*.html" -exec sed -i 's|https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js|https://static.wildfirechat.cn/bootstrap-3.3.7.min.js|g' {} \;
fi

tar -czvf docs.tar.gz docs
scp docs.tar.gz wfccn:/var/wildfirechat_sites/
ssh wfccn 'cd /var/wildfirechat_sites; rm -rf docs; tar -xzvf docs.tar.gz; rm -rf docs.tar.gz'
rm -rf docs docs.tar.gz
