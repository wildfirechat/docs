# Server FAQ

#### Q. 如何把IM服务倒入到IDE中？
A. [回答](server/q1.md)

#### Q. 我部署完成Demo服务后，客户端能登陆，但一只显示连接中？
A. [回答](server/q2.md)

#### Q. 消息存储在数据库中的那张表中
A. 使用h2db存储消息时，消息存储在t_message标中；使用mysql存储消息时，消息存储在t_message_X表中，X等于 ***月份-1+(年份%3)*12***，例如2019年4月存储在t_message_3表中(4-1+(2019%3)*12).

#### Q. IM服务启动脚本在windows下改过之后，放到linux服务器上运行报错
A. 这是因为Windows下有些编辑器更改完会把脚本转变成DOS格式，linux服务器无法识别DOS格式。解决办法是保存时选择保存为unix格式，或者在linux服务上使用vim打开，然后输入命令```:set fileformat=unix```，最后保存。

#### Q. 为什么数据库中的敏感词数目要比通过API获取到的数目要多
A. 敏感词列表是从网络上搜索出来的，里面有部分重复敏感词。通过server api获取到的敏感词是个集合数据结构，去掉了重复的内容，所以导致了不一致，可以不进行处理，没有任何影响，如果您想清除掉重复内容，请使用下面语句删除重复内容，注意执行时间较长，需要耐心等待
```
DELETE from  `t_sensitiveword` WHERE `_word` IN (SELECT `_word` FROM (SELECT * from `t_sensitiveword`) as t1 GROUP BY `_word` HAVING count(`_word`) > 1) AND `id` NOT IN (SELECT min(`id`) FROM (SELECT * from `t_sensitiveword`) as t2 GROUP BY `_word` HAVING count(`_word`) > 1);
```

#### Q. 为什么在数据库中添加了一个用户/群组/好友，为啥不起作用？
A. 因为服务使用了大量的缓存，只更新数据库是不能起效果的，另外数据还有完整性需求，直接写数据库可能会出问题。所以可以直接从数据库中读信息，但所有更新操作都***必须只能通过服务API的接口来进行***。

#### Q. 为什么机器人服务部署以后，一直提示加密方式错误？
A. 机器人是个demo服务，为了演示机器人服务收发功能，对接了图灵机器人，客户也可以更换任何的自助问答服务。代码里的图灵机器人配置是无效的，需要可以去图灵注册账户，开通机器人权限，然后更新机器人服务的key。图灵地址在[这里](http://www.turingapi.com)
