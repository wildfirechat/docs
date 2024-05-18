# 国产化系统鲲鹏CPU+UOS适配经历
一直想要给[野火IM](https://github.com/wildfirechat)做国产化系统适配，但一直苦于无法购买到国产化主机。最近正好有个客户需要做国产化项目，系统中的IM子系统是使用我们的，就跟他们商量借用一段时间。本周二客户邮寄的国产化主机收到了，拆箱的那一刻，我的心里复现出一个念头，这是我们公司及我个人历史性的一刻，我们有幸参与了国产化这一伟大而又艰巨的任务。国产化是国家强大过程中的必经之路，国产化能够避免被他国技术限制，摆脱让他国不断讹诈威胁和限制的困境。虽然我们公司很渺小，但还有无数其它或伟大或渺小的公司和个人共同参与，汇流成河、聚沙成塔，这件事情一定会做成功的。

废话不多说了，开箱吧。打开箱子，拿出来主机，主机如下图所示，机箱比较小，还是很漂亮的，各种接口也都比较丰富。
![thtf_pc1](http://static.wildfirechat.cn/uos_11_thtf_pc.png)

再拍一下铭牌
![thtf_pc2](http://static.wildfirechat.cn/uos_12_thtf_pc.png)

开机看一下吧。开机的一刹那风扇“嗡”的一声吓我一跳，之后风扇运作平稳，听不到任何噪声，因为没有专业仪器，没有办法测试到分贝数。在执行重度编译任务时，风扇没有发现任何变化，完全没有觉察到声音，这可能就是arm架构的优势，能耗比较低，而且PC又不像手机那样空间狭窄，拥有了足够的空间，散热不是问题，所以风扇的压力就很小。

进入到系统以后，第一感觉可谓是惊艳。笔者重度使用MacOS和Ubuntu，UOS的界面非常漂亮，可以甩Ubuntu 几条街，个人感觉比mac os也要漂亮一些。当然这是个人的直观感受，没有量化指标，可能不同的人有不同的感觉，但Deepin的漂亮还是在网上比较公认的。
![Desktop](http://static.wildfirechat.cn/uos_1_desktop.png)

下面是系统信息，可以看到UOS的版本及CPU信息
![Info](http://static.wildfirechat.cn/uos_2_info.png)

软件方面，系统附带有应用商店，各种常用的软件也是一应俱全，对付一般的办公应该绰绰有余，搜索到自己需要的软件点击安装就自动安装了，十分方便。但也仅限于此，目前生态还不完善，很多专业的软件都比较匮乏。生态和用户数量就是个先有鸡还是先有蛋的问题，随着国家推进国产化系统，用户数量就会上升，软件厂商也会跟进，这样就能形成良性循环。也真心希望系统厂商能够目光长远，降低使用门槛，让更多的用户用上国产操作系统，只有这样才能真正的依靠自己活下去，壮大起来。
![Store1](http://static.wildfirechat.cn/uos_3_store.png)

下载排行，可以看到平台上软件排行状态
![Store2](http://static.wildfirechat.cn/uos_4_store.png)

由于职业病的原因，特意研究了一下商店里的微信。微信不能直接使用，还必须要发送邮寄到UOS去申请开通，猜测可能是使用了Web或者以前旧有的协议，需要联系微信打开这些开关。如果您的微信在浏览器上无法登录，我猜测在UOS登录成功后，应该就可以在WEB登录了。没有实际验证，如果谁验证了，可以告诉我结果。
![wechat](http://static.wildfirechat.cn/uos_5_wechat.png)

另外一些其它常用的聊天软件和企业协同版本软件也都没有。但居然还有电报，能登录上去吗？由于时间关系，没有去验证，登录不上去是大概率事件。
![IM](http://static.wildfirechat.cn/uos_10_im.png)

由上图可见社交沟通类的软件非常少，这就是我们公司此次工作目的了，完成野火IM在UOS上的适配，让客户可以在国产化系统上使用完全私有部署的沟通软件。

由于UOS也是源于debian的，在命令行下apt命令和ubuntu下一样方便，笔者后面很多开发的软件都是apt安装的。apt安装需要打开开发者模式，在控制中心搜索开发者模式，按照提示操作就可以打开。


由于本文是记录国产化适配，就不做过多的测评了。如果想了解更多，大家可以看一下机器的[官网指标参数](https://www.tongfangpc.com/index.php/gallery-75.html)和[评测视频](https://search.bilibili.com/all?keyword=鲲鹏920)。我的最终感觉要比评测视频里说的要好得多，无论是鲲鹏920还是UOS，可能是因为我是程序员的原因吧。

UOS我重装了几回（因为要测试没有开发环境的软件运行情况，查找软件依赖），安装非常简单，X86的可以在UOS官网下载，国产CPU版本的操作系统通过客服就可以要到。下载ISO镜像后，用官方提供的工具在windows系统下制作一个安装U盘，然后插上去，点几下就完成了安装。大家有兴趣可以安装看一下。

检查一下Web的兼容性，用UOS自带的浏览器打开web地址，扫码登录，功能一切正常。商店里还有火狐，应该也都没有问题。界面如下图所示。
![web-chat](http://static.wildfirechat.cn/uos_7_web_wildfirechat.png)

下面正式开始适配。适配分成两部分，一部分是PC客户端pc-chat的适配；另外一部分是server的适配，server需要使用到国产数据库。由于篇幅的问题，本文只讲适配PC客户端吧，server的适配等到有空再写。

[pc-chat](https://github.com/wildfirechat/pc-chat)是野火IM在PC上的客户端，界面和功能和微信/钉钉的PC端类似，实现是通过electron实现的，其中协议栈是C++的库，上层UI是H5写的。pc-chat已经在linux x86上完成了开发，所以在UOS arm64上只需要重新编译即可。

## C++协议栈编译，
安装依赖cmake，python，build-essential，node， node-gyp，其中cmake在应用商店里有，点击安装就可以了

另外两个通过命令行安装
```
sudo apt update
sudo apt install python，build-essential
```

node的安装方法是在nodejs.org上下载arm版本的，然后解压到```/usr/local/lib/nodejs```，然后把bin目录添加到PATH中就可以用了。

node安装完成之后，通过```npm install -g node-gyp```安装node-gyp。

由于mars中使用了openssl的静态库，所以需要重新编译openssl库，从github openssl release处下载1.0.2f版本，然后按照readme上的说明，如下编译
```
./configure
make
```
编译完成后，找到```libcrypt.a```和```libssl.a```，在mars项目建立文件夹“openssl_lib_linux_arm64”，然后再修改linux的编译脚本，引用arm64的静态库。

mars的编译：对比linux_x86的编译脚本，创建arm64的编译脚本python build_linux_arm64.py， 运行之后开始了C++和node库的编译，编译成功后就得到了marswrapper.node协议栈库。

编译到这里的顺利程度远超出我的想象的，基本上没有遇到任何问题，这也就是说明arm的生态非常的好，常用的工具链中都有arm版本的。有些库没有对应架构版本，也很容易编译得到。

## 截图插件的编译
pc-chat的截图插件是QT的，好处是跨平台，可以在各个平台上运行，只需要在对应的平台上编译一次就可以了。商店里有QT Csreator，直接安装，但发现无法编译，因为没有装QT，在QT官方的download页面也无法找到arm版本，而在网上找到的UOS安装QT都是针对x86平台的，正当一筹莫展的时候突然想到是不是可以试试命令行模式，通过```apt install qt5-default```命令，顺利地编译出了截图插件。
![QT](http://static.wildfirechat.cn/uos_8_qt.png)

## 打包Electron软件包
下面就是编译Electron了，修改一下打包的脚本，electron-builder添加```--arm64```参数，然后执行```npm install```, ```npm run package-linux-arm64```，编译打包失败，原来还依赖fpm，fpm最新版本还有问题，还需要回退到上一个版本，折腾一番后，顺利打包成功。运行起来以后，所有功能都是正常的，非常地成功。
![pc-chat](http://static.wildfirechat.cn/uos_9_pc_wildfirechat.png)

我们还录制了一个简单的视频，放到了B站上，可以点击[这里](https://www.bilibili.com/video/BV14f4y1R7gd?from=search&seid=15341063283696866854)观看。

其实打包electron时还是有些担心的，因为用到了太多的库，有些库是平台依赖的，需要node-gyp进行编译，但真没有想到所有的依赖都是一遍就通过的，只有打包的时候遇到fpm的问题。

鲲鹏920适配过了，应该所有的arm64的CPU都可以支持了，应该也能支持飞腾CPU了，后面还要找机会找台飞腾的PC测试一下。

## 总结
可以看出arm的生态环境还是非常的好，工具链齐全，大部分代码都是一遍通过，偶尔出现问题，也都是可以通过stackoverflow查找解决的。通过这次适配，我感觉所有的在x86 linux上运行的软件都应该可以比较容易地移植到arm64 linux上去。

另外一个感觉就是，arm的性能稍微差了点，我用一台i3的NUC对比过，这台机器的编译时间大概是NUC的1.2倍到1.8倍不等。应该是单核的性能相对X86差了不少，但能效比应该是能够吊打X86的，毕竟arm是比较省电的。INTEL在过去的十年太佛系了，没有太大的进步。

生态完善，能效比高，苹果都要转向arm了，可见未来arm的发展前景了。

Arm加油！国产化系统加油！中国加油！


2020.7.26

李大雨
