## 概述

野火JS-SDK是野火公众平台 面向网页开发者提供的基于野火内的网页开发工具包。

通过使用野火JS-SDK，网页开发者可借助野火高效地使用拍照、选图、语音、位置等手机系统的能力，同时可以直接使用野火分享等野火特有的能力，为野火用户提供更优质的网页体验。

此文档面向网页开发者介绍野火JS-SDK如何使用及相关注意事项。

## JSSDK使用步骤

### 步骤一：开通机器人或者频道

联系系统管理员，开通野火机器人或者野火频道，得到野火机器人或者频道id（后面统称为appId），得到野火机器人密钥或者频道密钥（后面统称为appsecret)。

### 步骤二：引入JS文件

在需要调用JS接口的页面引入如下JS文件，（支持https）：http://res.wildfirechet.net/open/js/jwfc-1.0.0.js

### 步骤三：通过config接口注入权限验证配置

所有需要使用JS-SDK的页面必须先注入配置信息，否则将无法调用（同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用。
```
wf.config({
  appId: '', // 必填，机器人或频道的唯一标识
  appType: 0,  // 必填，应用类型，0是机器人，1是频道
  timestamp: , // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '',// 必填，签名
  jsApiList: [] // 必填，需要使用的JS接口列表
});
```
签名算法见机器人或频道的api文档。

### 步骤四：通过ready接口处理成功验证
```
wf.ready(function(){
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
});
```
### 步骤五：通过error接口处理失败验证
```
wf.error(function(res){
  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
});
````

### 接口调用说明

所有接口通过wf对象(也可使用jWfc对象)来调用，参数是一个对象，除了每个接口本身需要传的参数之外，还有以下通用参数：

success：接口调用成功时执行的回调函数。
fail：接口调用失败时执行的回调函数。
complete：接口调用完成时执行的回调函数，无论成功或失败都会执行。
cancel：用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。

以上几个函数都带有一个参数，类型为对象，其中除了每个接口本身返回的数据之外，还有一个通用属性errMsg，其值格式如下：

调用成功时："xxx:ok" ，其中xxx为调用的接口名

用户取消时："xxx:cancel"，其中xxx为调用的接口名

调用失败时：其值为具体错误信息

## 基础接口

### 判断当前客户端版本是否支持指定JS接口
```
wf.checkJsApi({
  jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
  success: function(res) {
  // 以键值对的形式返回，可用的api值true，不可用为false
  // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
  }
});
```

### 分享接口

自定义“分享给朋友”的分享内容
```
wf.ready(function () {   //需在用户可能点击分享按钮前就先调用
  wf.updateAppMessageShareData({
    title: '', // 分享标题
    desc: '', // 分享描述
    link: '', // 分享链接
    imgUrl: '', // 分享图标
    success: function () {
      // 设置成功
    }
  })
});
```
