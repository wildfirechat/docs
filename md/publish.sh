gitbook build
mv _book docs
cp -af ../trickle-ice docs/webrtc/
cp -af ../abilitytest docs/webrtc/
tar -czvf docs.tar.gz docs
scp docs.tar.gz wfccn:/var/wildfirechat_sites/
ssh wfccn 'cd /var/wildfirechat_sites; rm -rf docs; tar -xzvf docs.tar.gz; rm -rf docs.tar.gz'
rm -rf docs docs.tar.gz
