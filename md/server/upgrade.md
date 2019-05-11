# 服务器升级指南
本文档记录服务器版本升级说明，当您的版本要升级到最新版本时，请按照说明逐步升级。（比如您现在的版本是1.x，最新版本是3.0，需要先升级到2.0，再升级到3.0）

#### 0.20版本升级说明
0.20版本之前手动维护数据库的升级。0.20之后引入了flyway，自动处理数据库升级。因此需要处理他们的切换。使用mysql数据库的升级方式如下，h2的升级方式请参考本方式进行。
1. 停掉服务。

2. 备份数据，以确保出现问题能及时回滚

  ```
  mysqldump -uroot -p123456 wfchat >  backup.sql
  ```
3. 登录数据库，删除如下数据

  ```
  delete from t_chatroom where _cid = 'chatroom1';
  delete from t_chatroom where _cid = 'chatroom2’;
  delete from t_chatroom where _cid = 'chatroom3’;

  delete from t_user where _uid = 'FireRobot';

  delete from t_robot where _uid = 'FireRobot';
  ```

3. 导出数据

  ```
  mysqldump -t  -uroot -plt123456 wfchat >  data.sql
  ```
4. 删掉库

  ```
  drop database wfchat;
  ```
5. 启动0.20版本新服务(重建数据库)

6. 停掉新服务
7. 恢复数据，```data.sql```目录下，登录mysql，执行如下命令

  ```
  use wfchat;
  source data.sql
  ```
8. 启动新服务，测试是否正确

> 涉及到数据需要注意安全，在正式商用之前先在测试环境上进行演练。
