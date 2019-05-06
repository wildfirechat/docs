# Server FAQ

#### Q. 如何把IM服务倒入到IDE中？
A. [回答](server/q1.md)

#### Q. 我部署完成Demo服务后，客户端能登陆，但一只显示连接中？
A. [回答](server/q2.md)

#### Q. 消息存储在数据库中的那张表中
A. 使用h2db存储消息时，消息存储在t_message标中；使用mysql存储消息时，消息存储在t_message_X表中，X等于年份%3+月份，例如19年4月存储在t_message_27表中
