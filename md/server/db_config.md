# 服务器数据库配置
为了让用户快速体验，野火IM使用了嵌入式数据库h2 database，这样让用户可以不用安装配置数据库就能快速体验到野火IM的功能。但嵌入式数据库相对性能差，也无法做主从备份。客户在用户数100人以下或者体验时可以使用h2db，免去配置的麻烦，本文档可以跳过。其它客户建议在正式使用时使用mysql数据库或其它关系型数据库，专业版客户还可以选择关系数据库+mongodb的组合，使用mongodb存储消息和用户消息记录，可以支持更大量的数据。

## 支持数据库类型
社区版只能支持h2 database和MySQL。

专业版目前支持h2 database，MySql，KingbaseV8，Dameng8，SQL Server，PostgreSql。如果客户有需求，未来可以支持更多的常见数据库。

## 数据库版本
mysql5.7及以上，支持utf8mb4.（对表情的支持需要utf8mb4）；Kingbase V8版本及以上；达梦8版本及以上；SQL Server 2014及以上。

## 支持长索引
mysql5.7默认不支持长索引，其他数据库都没有问题。如果是mysql5.7，请执行如下命令:
```
set global innodb_large_prefix=on;
```

## 修改事物隔离级别
大多数的数据库系统的默认事务隔离级别都是 ```Read committed```，但MySQL默认事务隔离级别是：```Repeatable read```。需要把Mysql的默认等级修改成 ```Read committed```，不然高压力情况下容易出现事务超时的问题，修改方法如下：
```
set global transaction_isolation='read-committed';
```

## 建库建表
除了达梦和金仓外，其它数据库类型使用了flyway管理，不用手动建表建库和表。运行程序时会自动创建数据库和表结构。

达梦和金仓需要按照专业版文档来建库建表。

## 修改服务配置
进入到config目录下，修改```c3p0-config.xml```，在这个文件里有所有支持关系型数据库配置的模版，找到您选定数据库的模版，然后配置 ***db地址***，***用户名*** 和 ***密码***。
```
        <property name="jdbcUrl">jdbcurlxxxx</property>
        <property name="user">root</property>
        <property name="password">xxxxxx</property>
```

## 设置数据库类型
修改```wildfirechat.conf```中的下面属性改为您要使用的数据类型
```
## 是否使用内置DB。0使用mysql；1使用h2db；2使用mysql+mongodb；3使用kingbase-v8；4使用dameng；5使用sql server；6使用postgresql。社区版只支持0和1，专业版还支持2,3,4,5,6。专业版集群部署时不能使用1。
embed.db 0
```

## 注意事项
数据库中有部分数据是二进制数据，MySQL做数据备份时需要加上参数```--hex-blob```，如果不加可能备份的数据无法正确恢复。

## 性能建议
野火IM服务器使用大量的内存缓存，一般情况下，数据库的数据仅用来备份以备系统重启。如果数据库出现瓶颈，可以从这几项入手解决，提高野火IM服务器缓存使用减少db的读取次数，db单独部署，提高db服务器的性能，尤其是换SSD，优化默认配置等，另外高级版具有更好的性能，使用专业版也能减少服务器压力。

## 使用mongodb
专业版本可以组合使用关系型和mongodb，需要先配置关系型数据库再正确配置mongodb。修改下面开关，改成```true```。在专业版的使用手册里有mongodb的配置方式。
```
## 消息是否存储在mongodb中。当embed.db为2时，db.save_message_in_mongodb取true值(兼容历史配置)。
## 当save_messages_in_mongodb为true时，必须配置后面的mongodb相关配置。
db.save_messages_in_mongodb false
```
