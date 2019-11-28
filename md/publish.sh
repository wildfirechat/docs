gitbook build
mv _book wildfirechat_docs
tar -czvf docs.tar.gz wildfirechat_docs
scp docs.tar.gz dali2:~/
ssh dali2 'rm -rf wildfirechat_docs; tar -xzvf docs.tar.gz'
rm -rf wildfirechat_docs docs.tar.gz
