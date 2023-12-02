# 数据库重复消息ID的问题
只有专业版IM服务+MySQL，且会大量更新消息场景的用户才需要做此修复，其他情况都没有问题。

使用MySQL数据库时，消息表中消息id字段```mid```被错误的设置为普通索引，没有设置为唯一索引。这样就导致当更新消息时，会产生重复的数据。在其他类型的数据库中，比如达梦/mongodb等，都不存在这个问题。在2023年12月3日之前的IM服务版本创建的数据库有此问题。

# 问题的影响
使用过程中基本是没有影响的(加载消息会加载最后一条消息，也不会有问题)，唯一的影响是冗余的数据占用部分空间。只有专业版IM服务才有更新消息功能，并且更新的频率非常低（相对于消息总量来说），所以绝大部分客户都可以忽略此问题。有一个客户有个特殊的业务，会产生流式数据，然后重复更新消息直至数据全部生成，如果不修复将会产生大量冗余数据，这种情况就需要解决这个问题了。

# 如何修复问题
修改的方法就是去除重复数据，然后删掉原来旧的索引，然后再生成新的索引。

## 第一步检查是否有重复数据
下面是查询第一张消息表，检查从t_messages_0到t_messages_35这36张表是否有重复数据
```
SELECT _mid, COUNT(_mid) AS count FROM t_messages_0 GROUP BY _mid HAVING count > 1;
```
如果没有重复数据，可以跳到第三步。如果有重复数据请执行下面第二步。

## 第二步删掉重复数据
需要对36张表做操作，下面是对表0的修改，其他表以此类推。
```
DELETE t1
FROM t_messages_0 t1
JOIN (
  SELECT a1._mid, MAX(a1.id) AS max_id
  FROM t_messages_0 a1
  JOIN (
    SELECT _mid, COUNT(_mid) AS count
    FROM t_messages_0
    GROUP BY _mid HAVING count > 1
  ) a2 on a1._mid = a2._mid GROUP BY a1._mid
) t2 ON t1._mid = t2._mid AND t1.id < t2.max_id;
```

## 修改索引
在每个表上删除掉原来旧的索引，然后添加上新的唯一索引。如果消息量比较大，这一步耗时多一些。
```
DROP INDEX message_uid_index ON t_messages_0;
ALTER TABLE t_messages_0 ADD UNIQUE KEY `message_uid_index` (`_mid`);
```
