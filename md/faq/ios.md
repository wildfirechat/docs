# iOS FAQ

#### Q. 1编译WildfireChat工程报错，提示找不到部分依赖？
A. WildfireChat隐式依赖于WFChatUIKit和WFChatClient，第一次运行必须先运行WFChatClient，再运行WFChatUIKit。运行之后会自动把库文件和依赖资源拷贝到对应目录，WildfireChat就可以编译运行了。
