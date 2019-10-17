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

#### Q. 怎么修改小火机器人头像名称这些信息？
A. 使用server api的接口或者购买付费的管理后台可以添加或修改机器人。当然也可以在数据库中新建和修改机器人。新建的sql语句如下：
```
insert into t_user (`_uid`,`_name`,`_display_name`,`_portrait`,`_type`,`_dt`) values ('FireRobot','FireRobot','小火','http://cdn2.wildfirechat.cn/robot.png',1,1);

insert into t_robot (`_uid`,`_owner`,`_secret`,`_callback`,`_state`,`_dt`) values ('FireRobot', 'FireRobot', '123456', 'http://127.0.0.1:8883/robot/recvmsg', 0, 1);

```
新建的机器人是可以立即使用的。也可以修改机器人的user表，修改需要注意两点，一个是```_dt```字段需要增大以便客户端同步，另外一个就是更新后要重新启动IM服务，这两点不做会不生效。

#### Q. 如何做消息审查和过滤？
A. 消息审查和过滤是确保设计软件能够安全运营重要的一环。在野火IM中可以通过如下几种方式：
1. 使用内置的敏感词过滤。野火IM内置了敏感词，可以针对文本中的敏感词进行过滤。可以通过api接口对敏感词进行管理。命中敏感词时会有不通的策略，在配置文件中有说明（有发送失败，吞掉和替换成*三种策略）。命中敏感词的消息也会存储在一张特殊的消息表中（可以根据表明找出来）。野火IM官方提供的[管理后台](https://github.com/wildfirechat/admin)可以提供这方面的管理，客户也可以自己实现。这种方式的缺点是只能处理文本。
2. 使用消息转发功能，在野火IM配置文件中配置转发地址，这样客户端所有消息都会被转发到指定审核服务器，当出现违规信息时，使用api中的撤回功能，撤回消息。这种过滤方式可以过滤图片/视频/语音，或其他自定义消息。难点就是处理方式比较难，需要有大量的开发功能。

#### Q. 历史消息数据如何清理？
A. 野火IM的消息存放有3种选择。第一种是使用h2db，这种只能用户开发模式，或者用户数极少的情况下，对这种情况下重置数据库就行。第二种方法是使用mysql，其中对message表（t_messages_xxxx)和用户message关系表(t_user_message_xxx)都做了分表，message表是按照月份分的，按照文档说明找到对应的表清空就可以了。用户message关系表，是使用用户ID哈希成128个表，需要对每个表里的数据按照时间进行删除。如果表内数据比较大，需要在业务不繁忙阶段，分表分批次删除，需要部分的开发量。第三种方式就是mongodb的方式，系统会自动过期删除，不用人工干预。

#### Q. 服务器一直出现 ```javax.crypto.BadPaddingException: Given final block not properly padded. Such issues can arise if a bad key is used during decryption.``` 这个错误提示？
A. 野火IM客户端与服务器保存有每个客户端的密钥，如果因为某种原因服务器没有对应的密钥（更换服务器没有迁移数据或出现异常情况），服务器将与客户端无法进行配合工作。解决办法就是需要在客户端对某些特殊的状态码进行处理，请参考[连接状态码有什么需要注意的吗](./general.md).

#### Q. Windows系统部署，提示时区不合法（The server time zone value 'ÖÐ¹ú±ê×¼Ê±¼ä' xxx)

A. 去报Mysql版本5.6，或以上，然后参考[这个链接](https://www.cnblogs.com/smiler/p/9983146.html?tdsourcetag=s_pcqq_aiomsg)

