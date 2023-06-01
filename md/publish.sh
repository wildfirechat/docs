gitbook build
mv _book docs
cp -af ../trickle-ice docs/webrtc/
cp -af ../abilitytest docs/webrtc/
cp -af ../wstool docs/web/
find docs/ -type f -name "*.html" -exec sed -i 's|https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css|https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css|g' {} \;
find docs/ -type f -name "*.html" -exec sed -i 's|https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js|https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js|g' {} \;
tar -czvf docs.tar.gz docs
scp docs.tar.gz wfccn:/var/wildfirechat_sites/
ssh wfccn 'cd /var/wildfirechat_sites; rm -rf docs; tar -xzvf docs.tar.gz; rm -rf docs.tar.gz'
rm -rf docs docs.tar.gz
