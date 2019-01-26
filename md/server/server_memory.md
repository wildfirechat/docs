# 机器内存的选择
野火IM使用了[hazelcast](https://hazelcast.com)作为内存缓存。在内存越来越便宜的情况下，合理地使用缓存，会带来性能的大幅提升。野火IM针对不同的数据使用不同的缓存策略。

## 消息数据

#### 消息对内存的占用
野火IM采用了先进的设计，对于消息只保存一条原始数据。也就是说1对1聊天和群聊每发一条消息，野火IM只保存一条消息。另外野火IM的消息尺寸比较小，对于图片视频语音都是作为媒体文件上传到媒体服务器，消息体内只保存一个url，消息使用pb格式存储，平均下来不会大于1K字节。

####缓存的配置
消息数据会随着时间线性积累，而且旧的消息可能再也用不到，因此对于消息，野火IM的建议每个用户缓存最新100条7天以内消息。预估一下，假如每条消息1K，10W活跃用户，10W * 100 * 1K = 10G。当用户接收消息缓存没有命中时，会从数据库加载该消息，不会丢失消息。修改配置```config/hazelcast.xml```, ```max-size```修改为您的用户数*100
```
<map name="messages_map">
    <!-- 7 days -->
    <time-to-live-seconds>604800</time-to-live-seconds>
    <eviction-policy>LRU</eviction-policy>
    <max-size policy="PER_NODE">10000000</max-size>
    <eviction-percentage>10</eviction-percentage>
    <map-store enabled="true">
        <class-name>io.wildfirechat.persistence.MessageLoader</class-name>
        <write-delay-seconds>0</write-delay-seconds>
    </map-store>
</map>
```
> 注：活跃用户数指7天以内登陆的用户数。

## 其它数据
其它数据比如用户，好友，群组，设置。基本与用户数成比例，每人不会超过30K数据，为了提高访问速度，因此全部放到内存缓存中。预计有10W活跃用户， 10W * 30K = 3G。

## 总结
如果您的用户需求较高且用户比较活跃，建议您每10W活跃用户配置16G内存。也可以适当降低缓存数减少内存消耗。
