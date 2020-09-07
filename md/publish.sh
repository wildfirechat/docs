gitbook build
mv _book wildfirechat_docs
cp -af ../trickle-ice wildfirechat_docs/webrtc/
tar -czvf docs.tar.gz wildfirechat_docs
scp docs.tar.gz dali3:~/
ssh dali3 'rm -rf wildfirechat_docs; tar -xzvf docs.tar.gz'
rm -rf wildfirechat_docs docs.tar.gz
