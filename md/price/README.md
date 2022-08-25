# 费用说明
野火需要做一个平衡，既满足大量客户低成本、高质量的即时通讯和实时音视频能力需求，又要能够维持野火公司的运营，确保项目的可持续发展。因此野火开源免费了大量完善、闭环的产品，确保大部分人需要的移动项目能够完全免费地使用IM和音视频，又能在某些商业应用项目上收取一定的费用来维持团队的运作。下面分别说明一下。

## 免费项目
| 项目 | 包含内容 | 源码 |
| ------ | ------ | ------ |
| 社区版IM服务 | 核心服务，处理所有IM的业务。| [码云](https://gitee.com/wfchat/im-server)/[Github](https://github.com/wildfirechat/im-server) |
| Demo应用服务 | 用来演示登录换取IM token，可以直接使用，也可移植到已有服务。 | [码云](https://gitee.com/wfchat/app_server)/[Github](https://github.com/wildfirechat/app_server) |
| 推送服务 | 处理推送业务 | [码云](https://gitee.com/wfchat/push_server)/[Github](https://github.com/wildfirechat/push_server) |
| 机器人服务 | 演示自动应答功能 | [码云](https://gitee.com/wfchat/robot_server)/[Github](https://github.com/wildfirechat/robot_server) |
| 开放平台服务 | 开放平台，第三方系统可以通过开放平台对接 | [码云](https://gitee.com/wfchat/open-platform)/[Github](https://github.com/wildfirechat/open-platform) |
| Demo日报服务 | 第三方系统对接的Demo | [码云](https://gitee.com/wfchat/daily-report)/[Github](https://github.com/wildfirechat/daily-report) |
| 频道（公众号）服务 | 处理频道相关业务，实现类似于微信公众号的功能 | 即将发布 |
| Android原生客户端 | Android平台原生客户端，包括SDK，和应用，拥有完善的即时通讯和实时音视频功能，协议栈闭源其他都开源 | [码云](https://gitee.com/wfchat/android-chat)/[Github](https://github.com/wildfirechat/android-chat) |
| iOS原生客户端 | iOS平台原生客户端，包括SDK，和应用，拥有完善的即时通讯和实时音视频功能，协议栈闭源其他都开源 | [码云](https://gitee.com/wfchat/ios-chat)/[Github](https://github.com/wildfirechat/ios-chat) |
| UniApp插件SDK | UniApp平台的插件，支持IM和实时音视频功能，基于原生客户端SDK封装而来，支持iOS和Android平台 | [码云](https://gitee.com/wfchat/uni-wfc-client)/[Github](https://github.com/wildfirechat/uni-wfc-client) |
| UniApp客户端 | UniApp平台应用，基于UniApp平台插件开发，支持iOS和Andoid平台，具有IM和实时音视频能力 | [码云](https://gitee.com/wfchat/uni-chat)/[Github](https://github.com/wildfirechat/uni-chat) |
| Flutter平台插件 | 基于原生客户端SDK封装，只有功能库，需要客户自己开发UI | [码云](https://gitee.com/wfchat/flutter_imclient)/[Github](https://github.com/wildfirechat/flutter_imclient) |
| 免费版音视频SDK | 基于Mesh架构的音视频SDK，可以支持多人音视频通话，包含在各个平台的客户端项目中 | 闭源，可以免费商用 |

上述免费内容可以完成一套高质量的移动社交App，支持常见即时通讯功能和多人实时音视频通话，可以进行二开，添加自定义消息和通过server api对接其他系统。嵌入到其他现有系统也是很方便的，把Demo应用服务逻辑移植到现有服务中，把客户端SDK集成到现有App中，即可给已有应用添加上即时通讯和实时音视频功能。可以自行从码云或者Github上下载源码、二开开发和进行商用。

## 收费项目
IM相关，有如下收费项目

| 项目 | 包含内容 | 价格 |
| ------ | ------ | ------ |
| 专业版IM服务 | [专业版IM服务](../commercial_server/README.md)的软件包，不包含源码 | 2.9W/套 |
| PC SDK（Electron版本 Win/Mac平台） | 功能库闭源，提供[开源Demo](https://github.com/wildfirechat/vue-pc-chat)，不影响二次开发(仅包含win/mac平台) | 2.9W/套 |
| Web SDK | Web功能库（发布包，提供[开源Demo](https://github.com/wildfirechat/web-chat)，依赖专业版IM） | 1W/套 |
| 小程序SDK | 小程序功能库（发布包，支持微信、QQ、支付宝、百度、今日头条，提供开源的[微信小程序Demo](https://github.com/wildfirechat/wx-chat)，依赖专业版IM) | 1W/套 |

如果需要更高质量的音视频功能或者二开Mesh架构音视频，可以选用如下：

| 项目 | 包含内容 | 价格 |
| ------ | ------ | ------ |
| 音视频高级版 | SFU模式，支持多人实时音视频，支持会议模式，媒体服务闭源，SDK闭源，UI开源。依赖IM服务专业版 | 5.9W/套
| Mesh架构音视频源码 | 免费版本音视频SDK的源码，Mesh架构，仅当有部分特殊需求进行二开才需要购买，SDK是可以免费使用的 | 5W

其他收费项目

| 项目 | 包含内容 | 价格 |
| ------ | ------ | ------ |
| 国产化Linux PC SDK（Electron版本 Linux平台） | 功能库闭源，提供[开源Demo](https://github.com/wildfirechat/vue-pc-chat)，不影响二次开发，仅包含linux平台，支持X86/Arm64/longarch64架构，按照架构收费 | 2.9W/套/架构 |
| PC SDK（VC++/VC#版本） | DLL版本SDK，可以在windows原生应用中使用，不包含UI代码，没有开源UI | 2.9W/套 |
| 朋友圈SDK | sdk闭源，UI开源，只支持移动端，依赖专业版IM服务。 | 1W/套 |
| 对讲SDK | sdk闭源，UI开源，只支持移动端，依赖专业版IM服务。 | 1W/套 |
| 管理后台 | 包括数据统计，用户管理，敏感词管理，群组管理，消息查看，消息撤回，机器人管理，频道管理。现有截图参考[后台管理](https://github.com/wildfirechat/admin/blob/master/README.md) | 3W（源码） |

> 专业版及各个SDK闭源绑定域名或IP，以上是每套的价格；音视频源码和管理后台源码以源码形式提供，可以用于多个项目。

> 开发团队量大从优，享受阶梯价格，具体详情请联系我们。

> 除了Mesh架构音视频源码外，其他所有收费项目都可以进行试用，试用后再购买，试用方法请查阅快速开始。

> 专业版IM服务和收费SDK都是终身授权的，另外包含一年的免费版本升级服务。可选延长升级服务，每年费用为产品价格的20%。

> 教育优惠计划，高校或IT培训机构不以盈利为目的的使用用途时，可以免费使用。

上述内容只适合有开发能力的团队或公司，我们提供技术github和bbs支持，购买方式参考[购买流程](../faq/buy.md)。我们不提供定制开发工作和产品商业化服务，如果您没有开发能力，就需要找个开发团队来帮助您定制化和商业化，感谢理解！

## 购买流程
必须先试用，试用满意后再购买。点击[试用方法](../trial/README.md)来申请试用。点击[购买流程](../faq/buy.md)进行购买。
