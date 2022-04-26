# 系统调优
当商用时，请按照此说明进行系统调优。以下部分内容是仅针对于Linux系统的，建议使用Linux系统，如果使用其它系统，请自行调节系统参数。不同的linux操作系统也会有细微的差异，如果无法设置或者设置无法起到作用，请自行百度查询。

## Linux操作系统调优
系统全局允许分配的最大文件句柄：
```
sysctl -w fs.file-max=2000000
sysctl -w fs.nr_open=2000000
echo 2000000 > /proc/sys/fs/nr_open
```
修改 /etc/sysctl.conf 文件的参数fs.file-max：
```
fs.file-max = 1000000
```
修改/etc/systemd/system.conf：
```
DefaultLimitNOFILE=1000000
```
修改/etc/security/limits.conf，设置允许用户打开的最大文件句柄数：
```
*      soft   nofile      1000000
*      hard   nofile      1000000
```

## TCP协议栈参数
并发连接 backlog 设置:
```
sysctl -w net.core.somaxconn=32768
sysctl -w net.ipv4.tcp_max_syn_backlog=16384
sysctl -w net.core.netdev_max_backlog=16384

```
可用端口范围:
```
sysctl -w net.ipv4.ip_local_port_range='1025 65535'
```
TIME-WAIT Socket 最大数量、回收与重用设置:
```
sysctl -w net.ipv4.tcp_max_tw_buckets=1000000
```
FIN-WAIT-2 Socket 超时设置:
```
sysctl -w net.ipv4.tcp_fin_timeout=15
```
设置端口回收的策略（压测客户端设置，服务器不用设置）
```
sysctl -w net.ipv4.tcp_tw_recycle=1
sysctl -w net.ipv4.tcp_tw_reuse=1
sysctl -w net.ipv4.tcp_timestamps=1
```
## JVM参数调优
修改野火启动脚本/bin/wildjfirechat.sh，设置最大内存/最小内存为野火预留的内存，建议使用大内存。
```
JAVA_OPTS="$JAVA_OPTS -Xmx12G"
JAVA_OPTS="$JAVA_OPTS -Xms12G"
```
## 修改日志登记
专业版修改野火日志配置文件/config/log4j2.xml，修改直接写入为false
```
immediateFlush="false"
```
## DB优化
单独部署MySQL数据库，选择使用SSD硬盘，另外需要对MySQL数据库进行参数调优，设置较大的缓存，设置异步写等，请参考[mysql调优](./mysql_tune.md)。也可以自己百度查询解决。

## IM服务配置
```
# 如果是linux系统，一定要打开下面这个参数，能大幅度提高性能
netty.epoll true
```
