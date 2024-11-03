# 朋友圈开发
朋友圈功能依赖于专业版并且专业版必须使用mongodb数据库，因为朋友圈信息存储在mongodb中。朋友圈SDK封装了所有的功能，包括发布、拉取、评论、设置等功能等功能。

## IM服务配置
IM服务必须配置mongodb，另外还有下面几个配置关于朋友圈的，分别如下：
```
## 朋友圈是否全局可见。如果全局可见，用户可以看到所有人的朋友圈（黑名单除外），如果不是全局可见，仅好友可见。
moments.global_visible false

## 允许朋友圈功能的机器人列表，如果有多个，以英文逗号分开。
moments.allow_robot_list FireRobot,Helpers

## 当朋友圈不是全局可见时，这个开关是决定机器人朋友圈是否是全局可见。如果机器人朋友圈是全局可见，那么它发送的朋友圈会分发给所有人，也可以在发送朋友圈中指定任意接受者。
## 如果机器人朋友圈非全局，那么它的行为跟普通用户一样。
moments.robot_global_visible true
```

## 客户端API
### 1. 发布朋友圈
```
public Feed postFeed(int type, String text, List<FeedEntry> medias, List<String> toUsers, List<String> excludeUsers, List<String> mentionedUsers, String extra, final PostCallback callback);
```
其中type是朋友圈类型，野火预置了文本(0)、图片(1)、视频(2)和链接(3)这4种类型，客户可以自定义更多的类型; medias是这条朋友圈的媒体信息; toUsers是定向发送给的用户; excludeUsers是需要排除的用户; mentionedUsers是需要提醒的用户。
### 2. 发布评论
```
public Comment postComment(int type, long feedId, String text, String replyTo, long replyId, String extra, final PostCallback callback);
```
其中type为评论的类型，0是评论，1是点赞; feedId是朋友圈的Id; replyTo是回复某个用户的; replyId是回复的评论ID。

### 3. 拉取朋友圈
```
public void getFeeds(long fromIndex, int count, String user, final GetFeedsCallback callback);
```
从某一条记录开始拉取更旧的朋友圈，如果fromIndex为0，拉取最新的。一般情况下，进入到朋友圈后，fromIndex为0，拉取到最新的20条，当滑动到底部时，以fromIndex为最后一条的ID，再拉取更早的20条消息，以此类推。
### 4. 删除评论
```
public void deleteComment(String userId, long feedId, long commentId, final GeneralCallback callback);
```

### 5. 删除朋友圈
```
public void deleteFeed(String userId, long feedUid, final GeneralCallback callback);
```

### 6. 拉取朋友圈设置
```
public void getUserProfile(final String userId, final UserProfileCallback callback);
```
可以获取自己获取其他人的朋友圈设置
### 7. 更新自己的朋友圈设置
```
public void updateUserProfile(int updateUserProfileType, String strValue, int intValue, final GeneralCallback callback);
```
更新自己的朋友圈设置，type为0时，是修改朋友圈背景链接，strValue填链接地址; type为1时，是设置陌生人允许查看的条数，intValue为条数; type为2时，是查看的范围，intValue的值的意思分别是：0是不限制，1是3天，2是一个月，3是半年。
### 8. 更新黑名单和屏蔽名单
```
public void updateBlackOrBlockList(boolean isBlock, List<String> addList, List<String> removeList, final GeneralCallback callback);
```
设置某一个名单，addList是添加的，removeList是删除的。拉黑是他看不到你的朋友圈，屏蔽是你不看他的朋友圈。
### 9. 监听朋友圈消息
```
public void setMomentMessageReceiveListener(OnReceiveFeedMessageListener momentMessageReceiveListener);
```
有2种消息，一种是朋友圈@了当前用户，另外一种是评论或回复评论。当被删除时，还会收到撤回消息。朋友圈消息的line是通过1发送的。

### 10. 获取朋友圈消息
```
List<Message> getFeedMessages(long fromIndex, boolean isNew);
```

## 设置
同微信朋友圈接近，有一系列的朋友圈个人设置，包括如下：
1. backgroupUrl，背景图片地址；
2. blackList，不让他（她）看的用户列表；
3. blockList，不看他（她）的用户列表；
4. strangerVisiableCount，陌生人可见的条数；
5. visiableScope，可见范围，0是不限制，1是3天，2是一个月，3是6个月；

## 机器人朋友圈
从2024.11.5开始，野火支持机器人朋友圈，也就是可以以机器人的身份来操作朋友圈。需要有以下一些注意的点：
1. 不是所有机器人都有这个功能，需要在IM服务端配置支持朋友圈功能的机器人ID列表，只有在列表中的才可以使用朋友圈功能。
2. 机器人朋友圈分2中：一种是普通机器人朋友圈，像普通用户一样的权限，只有好友才能有权限；另外一种是全局机器人，可以认为是所有人的好友。当全局机器人发送一条消息时，会分发给系统内的所有用户，当系统内用户数量非常庞大时，需要注意压力。
3. 当有被@或者被回复，机器人会收到对应的消息。
4. 没有类似于客户端获取朋友圈消息的接口。如果需要使用到历史消息，需要把收到的消息记录下来。
