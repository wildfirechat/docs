# 服务器数据库配置
为了让用户快速体验，野火IM使用了嵌入式数据库h2 database，这样让用户可以不用安装配置数据库就能快速体验到野火IM的功能。但嵌入式数据库相对性能差，也无法做主从备份。客户在用户数100人以下或者体验时可以使用h2db，免去配置的麻烦，本文档可以跳过。其它客户建议在正式使用时使用mysql数据库，商业版客户建议使用mysql+mongodb。

#### mysql数据库版本
mysql7以上，支持utf8mb4.（对表情的支持需要utf8mb4）

#### 建库建表
进入到sql目录，执行
```
./initial_db.sh -u{user} -p{password}"
```

#### 修改服务配置
进入到config目录下，修改```c3p0-config.xml```，正确配置 ***db地址***，***用户名*** 和 ***密码***。
```
        <!--MySQL数据库驱动程序-->
        <property name="driverClass">com.mysql.jdbc.Driver</property>
        <!--MySQL数据库地址-->
        <property name="jdbcUrl">jdbc:mysql://localhost:3306/wfchat?useSSL=false&amp;serverTimezone=GMT&amp;allowPublicKeyRetrieval=true</property>
        <!--MySQL数据库用户名-->
        <property name="user">root</property>
        <!--MySQL数据库密码-->
        <property name="password">xxxxxx</property>
```

#### 使用mysql
修改```wildfirechat.conf```中的下面属性改为0。服务器不再使用内置数据库。
```
embed.db 0
```

#### 注意事项
野火IM服务器使用大量的内存缓存，一般情况下，数据库的数据仅用来备份以备系统重启。如果数据库出现瓶颈，可以从这几项入手解决，提高野火IM服务器缓存使用减少db的读取次数，db单独部署，提高db服务器的性能，尤其是换SSD，优化默认配置等。

#### 使用mongodb
商业版本组合使用mysql和mongodb，需要按照mysql的配置说明再正确配置mongodb。在商业版的使用手册里有mongodb的配置方式。
