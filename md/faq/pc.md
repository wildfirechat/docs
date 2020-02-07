# PC 常见问题

#### Q. 如何抓取日志
A. 协议栈会自己抓取最近5M的日志，将会对问题的解决提供非常大的帮助。协议栈日志在不同系统上存在不同的目录。在MAC上的目录是```~/Library/Application Support/{包名}/wildfirechat/{用户Id}/wfchat_{日期}.xlog```；在Linux上的目录是```~/wildfirechat/{用户Id}/wfchat_{日期}.xlog```；在windows上的目录在```C:\Users\{登电脑登录用户名}\AppData\Roaming\wildfirechat\{用户Id}\wfchat_{日期}.xlog```。log是[mars](https://github.com/Tencent/mars)的```xlog```格式，没有密码。用户可以自己解压后分析，也可以发给我们分析问题。
