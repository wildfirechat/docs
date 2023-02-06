# Uniapp常见问题

## Q. 如何替换定制端口的协议栈
A. 野火可以给部分政企客户提供定制端口的协议栈。此时就无法直接使用DCloud官网发布的插件了，需要修改野火SDK，然后使用本地插件。

对于Android客户端，把DCloud插件市场上下载的插件，替换那个mars开头的文件，进行使用即可。

对于iOS客户端则比较麻烦一些，需要打包野火IMSDK，下载[iOS原生项目代码](https://gitee.com/wfchat/ios-chat)，替换协议栈文件[mars.xcframework](https://gitee.com/wfchat/ios-chat/tree/master/wfclient/WFChatClient/Proto)，然后执行项目下的```release_libs.sh```脚本，执行成功后得到```WFChatClient.xcframework```库，进入这个库目录删除```ios-arm64_x86_64-simulator```文件夹，这样野火定制端口的库就准备好了。最后在下载插件市场的插件，替换```WFChatClient.xcframework```库就好了。

## Q. 如何使用本地原生插件
1. 从[uni-wfc-client项目](https://gitee.com/wfchat/uni-wfc-client/tree/main/nativeplugins)拷贝插件目录到项目目录下，拷贝之后，项目目录下有```nativeplugins```目录，里面是对应的插件。或者从市场下载插件。
2. ```HBuilder X```里面取消勾选云端插件
3. ```HBuilder X```勾选本地插件，并选中步骤 1 中的两个插件
