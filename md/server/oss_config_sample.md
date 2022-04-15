# 对象存储服务
下面是每个对象存储服务配置的示例，可以参考一下。

## 七牛云存储配置示例
```
## qiniu media server configuration
## 上传地址，不同的区域，上传地址也不同，七牛文档上有区域和地址的对应关系，华东地区默认是up.qbox.me。
## server_host与社区版不同，不能带http头和port。port配置在media.server_port和media.server_ssl_port属性。
media.server_host  up.qbox.me
media.server_port 80
media.server_ssl_port 443
media.access_key tU3vdBK5BL5j4N7jI5N5uZgq_HQDo170w5C9Amnn
media.secret_key YfQIJdgp5YGhwEw14vGpaD2HJZsuJldWtqens7i5
## bucket名字及Domain
media.bucket_general_name media
media.bucket_general_domain http://cdn.wildfirechat.cn
media.bucket_image_name media
media.bucket_image_domain http://cdn.wildfirechat.cn
media.bucket_voice_name media
media.bucket_voice_domain http://cdn.wildfirechat.cn
media.bucket_video_name media
media.bucket_video_domain http://cdn.wildfirechat.cn
media.bucket_file_name media
media.bucket_file_domain http://cdn.wildfirechat.cn
media.bucket_sticker_name media
media.bucket_sticker_domain http://cdn.wildfirechat.cn
media.bucket_moments_name media
media.bucket_moments_domain http://cdn.wildfirechat.cn
media.bucket_portrait_name storage
media.bucket_portrait_domain http://cdn2.wildfirechat.cn
media.bucket_favorite_name storage
media.bucket_favorite_domain http://cdn2.wildfirechat.cn
```

## 阿里云云存储配置示例
```
##阿里云对象存储配置
##基础配置
##AliOss endpoint，server_host与社区版不同，不能带http头和port。port配置在media.server_port和media.server_ssl_port属性。
media.server_host oss-cn-beijing.aliyuncs.com
media.server_port 80
media.server_ssl_port 443
##AliOss access_key_id
media.access_key LTAI30gTOPPTuKtW
##AliOss access_key_secret
media.secret_key 4p7HlgNSOQWGtX26IKV1HzaVKH47yU
##bucket名字和Domain
media.bucket_general_name wfcim
media.bucket_general_domain http://wfcim.oss-cn-beijing.aliyuncs.com
media.bucket_image_name wfcim
media.bucket_image_domain http://wfcim.oss-cn-beijing.aliyuncs.com
media.bucket_voice_name wfcim
media.bucket_voice_domain http://wfcim.oss-cn-beijing.aliyuncs.com
media.bucket_video_name wfcim
media.bucket_video_domain http://wfcim.oss-cn-beijing.aliyuncs.com
media.bucket_file_name wfcim
media.bucket_file_domain http://wfcim.oss-cn-beijing.aliyuncs.com
media.bucket_sticker_name wfcstatic
media.bucket_sticker_domain http://wfcim.oss-cn-beijing.aliyuncs.com
media.bucket_moments_name wfcstatic
media.bucket_moments_domain http://wfcim.oss-cn-beijing.aliyuncs.com
media.bucket_portrait_name wfcstatic
media.bucket_portrait_domain http://wfcstatic.oss-cn-beijing.aliyuncs.com
media.bucket_favorite_name wfcstatic
media.bucket_favorite_domain http://wfcstatic.oss-cn-beijing.aliyuncs.com
```

## 野火对象存储配置示例
```
## 野火对象存储，注意下面的server_host和bucket_XXX_domain都应该是公网地址
## server_host与社区版不同，不能带http头和port。port配置在media.server_port和media.server_ssl_port属性。
media.server_host  47.58.66.148
media.server_port 80
media.server_ssl_port 443
## AK/SK在minio服务启动的控制台输出有打印，默认是minioadmin，请注意修改成复杂字符串。
media.access_key minioadmin
media.secret_key minioadmin
## bucket名字及Domain
media.bucket_general_name media
media.bucket_general_domain http://47.58.66.148/media
media.bucket_image_name media
media.bucket_image_domain http://47.58.66.148/media
media.bucket_voice_name media
media.bucket_voice_domain http://47.58.66.148/media
media.bucket_video_name media
media.bucket_video_domain http://47.58.66.148/media
media.bucket_file_name media
media.bucket_file_domain http://47.58.66.148/media
media.bucket_sticker_name media
media.bucket_sticker_domain http://47.58.66.148/media
media.bucket_moments_name media
media.bucket_moments_domain http://47.58.66.148/media
media.bucket_portrait_name static
media.bucket_portrait_domain http://47.58.66.148/static
media.bucket_favorite_name static
media.bucket_favorite_domain http://47.58.66.148/static
```

## 火对象存储网关配置示例
```
## 野火对象存储网关，注意下面的server_host和bucket_XXX_domain都应该是公网地址
## server_host与社区版不同，不能带http头和port。port配置在media.server_port和media.server_ssl_port属性。
media.server_host  192.168.1.6
media.server_port 8088
media.server_ssl_port 443
media.access_key 0M7YVO70QPKBPWBZW5FconfW
media.secret_key ZrBsSST++1Qjap+Nfs3P2BujHCHDuqrsrYi0zNn8
## bucket名字及Domain
media.bucket_general_name media
media.bucket_general_domain http://192.168.1.6/media
media.bucket_image_name media
media.bucket_image_domain http://192.168.1.6/media
media.bucket_voice_name media
media.bucket_voice_domain http://192.168.1.6/media
media.bucket_video_name media
media.bucket_video_domain http://192.168.1.6/media
media.bucket_file_name media
media.bucket_file_domain http://192.168.1.6/media
media.bucket_sticker_name media
media.bucket_sticker_domain http://192.168.1.6/media
media.bucket_moments_name media
media.bucket_moments_domain http://192.168.1.6/media
media.bucket_portrait_name static
media.bucket_portrait_domain http://192.168.1.6/static
media.bucket_favorite_name static
media.bucket_favorite_domain http://192.168.1.6/static

```
## 腾讯云对象存储配置示例
```
## 腾讯云对象存储网关
## server_host 是 cos.<Region>.myqcloud.com。比如Region是南京，那么server_host 是 cos.ap-nanjing.myqcloud.com
## 如果开启全球加速，server_host为 cos.accelerate.myqcloud.com
media.server_host  cos.ap-nanjing.myqcloud.com
media.server_port 80
media.server_ssl_port 443
media.access_key AKMDgBBQAopqd4D5g03qMbZGgphIdgSBx80A
media.secret_key 91d99yYrteBTTCfmrAnujBSTFK8fvta0

## bucket名字及Domain
media.bucket_general_name wfim-1256208601
## domain为 https://<bucket_name>.cos.<Region>.myqcloud.com
media.bucket_general_domain https://wfim-1256208601.cos.ap-nanjing.myqcloud.com
media.bucket_image_name wfim-1256208601
media.bucket_image_domain https://wfim-1256208601.cos.ap-nanjing.myqcloud.com
media.bucket_voice_name wfim-1256208601
media.bucket_voice_domain https://wfim-1256208601.cos.ap-nanjing.myqcloud.com
media.bucket_video_name wfim-1256208601
media.bucket_video_domain https://wfim-1256208601.cos.ap-nanjing.myqcloud.com
media.bucket_file_name wfim-1256208601
media.bucket_file_domain https://wfim-1256208601.cos.ap-nanjing.myqcloud.com
media.bucket_sticker_name wfim-1256208601
media.bucket_sticker_domain https://wfim-1256208601.cos.ap-nanjing.myqcloud.com
media.bucket_moments_name static-1256208601
media.bucket_moments_domain https://static-1256208601.cos.ap-nanjing.myqcloud.com
media.bucket_portrait_name static-1256208601
media.bucket_portrait_domain https://static-1256208601.cos.ap-nanjing.myqcloud.com
media.bucket_favorite_name static-1256208601
media.bucket_favorite_domain https://static-1256208601.cos.ap-nanjing.myqcloud.com

```
