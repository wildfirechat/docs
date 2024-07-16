# 内置消息说明
在野火IM系统中内置消息和自定义消息没有什么区别，唯一的区别就是内置消息是野火团队预先定义好的，自定义消息是客户自主添加的。阅读本章节，需要先详细阅读和真正理解几个概念：[消息内容](../base_knowledge/message_content.md)、[消息负载](../base_knowledge/message_payload.md)和[自定义消息内容](../base_knowledge/custom_message_content.md)。

在服务器端，任何消息发送的格式都是[MessagePayload](https://gitee.com/wfchat/im-server/blob/wildfirechat/common/src/main/java/cn/wildfirechat/pojos/MessagePayload.java)。

本章节内容讲述，使用server api如何发送内置消息，其他自定义消息也可以参考。

## 发送格式
在server api中的message api中有个[发送消息](./admin_api/message_api.md#发送消息)的接口。接口的payload参数内容包括
```
{
  "type":1,
  "searchableContent":"hello",
  "pushContent":"",
  "pushData":"",
  "content":"",
  "base64edData":"",
  "mediaType":0,
  "remoteMediaUrl":"",
  "persistFlag":3,
  "expireDuration":0,
  "mentionedType":0,
  "mentionedTarget":[],
  "extra":"",
}
```
1. [type](../base_knowledge/message_payload.md#contentType)为消息内容的类型。
2. ```searchableContent```，可搜索内容，当一个消息可以被搜索时，这个字段填写被搜索的内容。
3. ```pushContent```，当自定义消息需要推送时，这里存放推送显示的内容。
4. ```pushData```，当自定义消息推送时，需要一些数据，这里是推送数据。
5. ```base64edData```，跟客户端定义的binaryContent是同一个字段，唯一的区别就是客户端是二进制数据，这里是二进制数据做base64编码的字符串。
6. ```mediaType```，媒体文件的类型，0是通用，1是图片，2是语音，3是视频，4是文件，5是头像，6是收藏，7是动态表情，8是朋友圈。
7. [persistFlag](../base_knowledge/message_content#消息类型)，是存储标志，在客户端定义在消息类中，不在消息对象中。
8. ```expireDuration```，是消息过期时间，单位是秒，在客户端是在发送函数中的参数。
9. ```mentionedType```，@信息类型，0是无@，1是@部分人，2是@全体成员。
10. ```mentionedTarget```，被@的人员列表，仅当mentionedType为1时有效。
11. ```extra```，扩展字段，消息内容的基类有个extra字段，对应到MessagePayload中的这个字段。

服务器端的MessagePayload和客户端的MessagePayload大致相同，只有部分表达方式不一样。

本章节只能给出部分消息的说明，如果本说明没有提到的消息，可以找到客户端源代码中消息内容的```encode```或者```decode```方法，找到客户端消息与客户端MessagePayload的转换规则，从而得到服务器端的MessagePayload。

## 文本消息
```
{
  "type":1,
  "persistFlag":3,
  "searchableContent":"hello world",
}
```
json中类型为1，存储标志为3，searchableContent存放文本消息的内容。


如果文本消息@某人，mentionedType值为1，mentionedTarget为被@的对象。如果@所有人，mentionedType值为2。加上mention信息的json为：
```
{
  "type":1,
  "persistFlag":3,
  "searchableContent":"hello world",
  "mentionedType":1,
  "mentionedTarget":["user1", "user2"]
}
```

如果文本消息引用某条消息，引用的json为：
```
{
  "quote":{
    "u":messageUid,
    "i":"userId",
    "n":"user nick name",
    "d":"message digest"  
  }
}
```
u为消息的uid，i为发送着的用户id，n为发送者的昵称，d为消息的摘要。此json字符串的字节做base64编码，放到base64edData字段中。加上引用内容的文本消息json为：
```
{
  "type":1,
  "persistFlag":3,
  "searchableContent":"hello world",
  "mentionedType":1,
  "mentionedTarget":["user1", "user2"],
  "base64edData":"ewogICJxdW90ZSI6ewogICAgInUiOm1lc3NhZ2VVaWQsCiAgICAiaSI6InVzZXJJZCIsCiAgICAibiI6InVzZXIgbmljayBuYW1lIiwKICAgICJkIjoibWVzc2FnZSBkaWdlc3QiICAKICB9Cn0=",
}
```

## 语音消息
```
{
  "type":2,
  "persistFlag":3,
  "searchableContent":"[声音]",
  "mediaType":2,
  "content":"{\"duration\":5}",
  "remoteMediaUrl":"https:\/\/media.wfcoss.cn\/media\/Y2djOGM4VlY-3D-2-1721008268-Ujazt1VcHcny.amr"
}
```

remoteMediaUrl存放语音文件的链接，content是个json格式字符串，里面存储语音消息的时长。

## 图片消息
```
{
  "type":3,
  "persistFlag":3,
  "searchableContent":"[图片]",
  "mediaType":1,
  "remoteMediaUrl":"https:\/\/media.wfcoss.cn\/media\/SmNnbUxtNTU-3D-1-1721007652-EY1taJNENJvg.jpg",
  "searchableContent":"[图片]",
  "base64edData":"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"
}
```

remoteMediaUrl存放图片消息的链接，base64edData为图片的缩略图。缩略图的生成规则是，把图片压缩到120X120大小的方框内，45%的质量压缩为JPG格式，再把二进制做base64编码得到字符串。

## 位置消息
```
{
  "type":4,
  "persistFlag":3,
  "searchableContent":"中国北京市海淀区阜成路北二街131号",
  "content":"{\"lat\":39.926537312885166,\"long\":116.32154022158235}",
  "base64edData":"\/9j\/4AAQSkZJRgABAQAASABIAAD\/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAALSgAwAEAAAAAQAAAHgAAAAA\/8AAEQgAeAC0AwEiAAIRAQMRAf\/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC\/\/EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29\/j5+v\/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC\/\/EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29\/j5+v\/bAEMAAwMDAwMDBQMDBQcFBQUHCQcHBwcJDAkJCQkJDA4MDAwMDAwODg4ODg4ODhERERERERQUFBQUFhYWFhYWFhYWFv\/bAEMBAwQEBgUGCgUFChcQDRAXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXF\/\/dAAQADP\/aAAwDAQACEQMRAD8A\/SGR0ZcRx7TkEHI7HPrUE5keJgeeD3qzG8boryksSAc7sD8BkcUxxB5MpJGcHbls9vrXJc2sPI+Y71UHP9\/\/AOtRtT+6v\/ff\/wBaozLIufnQ89SB\/jWbrGtWukWBvrpTJtdFVIgC7u52qqjPUk9zj1pt8qu3oOKcmoxWp0EewcIeB0qWuGtvFGkXKSTXoeykjkEEkNwgMiPwcHZuGMMpyDjB61JP4k8OxNKn2gfufvko+B8wUYwpzknt25rLmi9eY1dOaduU7GX7h9cH+VVYpNvy4+9iufj1zQ50jWG4w865RSHGeGPoOcKeDzT08Q6KwtpEuNwupPLiwj\/M64yPu8Yz3q4uNtyHTl2OmJaKxjDYVlJHB+lUo3SPLIxBY5YgKcn6kVkS+NfDqRPH9r+aJyrBUdiGIOOAp\/utz0rShvDcwpcQszJIodG8scg8g8pmtE4S0uQ4Sjq0WYEywKOzAIVw2MA8Y6ev9Kesc1upclD0HQ9yB61JGZfKPmYA6klVHHrwO1VZTCRIAzsNg25Zsbuf\/rUn2Qjzrxxrer6LexR2sz28P2ZpYmS1+0fabkMdsPPC8Y7gnOQeKh1K8uZr+4W4vJYLp7eNns13lEd4jIUBQk4wpOQu7dxXp4ikBKg4xwfmYf1qg+l6dPcNcSpEZA\/3nwTkJt6n2JH0rldKV22ztVeKily6rr3PJ9K1hra3sBcanJ8szblw\/wC96R4YSYbGT\/DwDn6U5dRktdPeEardEK8cbShGLZQyM45yMcE8nJxzgc16auiaPCAsdtERCpEZUcJkHOMdzgZpr6No0nMkETZ5O7acnk5I7k7jk9TnmkqT7luvBu9vyM3R9Nv21R9We9eezuogywuXAjLYIwrZHA6HIPJzXQSxp5VyM7go4P4CliEcUIt4yiogCKOOABgDJOTSSFzaT4YYC+nX8c11QXKcU5czuVdGk8uKY4J75AyPvN1rQz5rE+SrE8k7RWdo\/KOh6M+0\/TL1pxJuY+SxUbQfm7\/qa0lbmZktiUoQpRUAIxwv19KjliieRgfvE7fmQHGecjNWQVViHIJHFKWQ4AI96zuUUBsT5fN6f7P\/ANel3J\/z2\/8AHf8A69Wvs5PKlcf7oo+zN6r\/AN8iquu4WP\/Q\/SqGMAHdGq\/Tmo5olyGTBYHOCQOxpCzu2yTK4GcqAc5+mfSlQM6GQsuQTjKjscCuS3U2uMZdhXBXo3I7dPrVPWdNstXsm0++3NFIUJCMVYEMCGVgcqwPQirY+fZsBJbJOTjqM+9NZW2namMMFOW75HtSkk7qQ4yad4mLZeF\/D1jaCwjgE6PKbh3nJlkeU4Jdnbkk7QPTAxTIfCGhxXFzdurSLcLsdWLEY3BiOuCMjpjpxXQshjQu0ecf7X\/1qQyGLMTR55z97\/61EYxS5Yr8EVKcpS5pSd\/VmH\/wjuiiVZYYnEiqEB3sPlAx2PbtUX\/CN6KI4YxaqscLGSNASFVmAyQM8Zxn6810SyYUusYHb73\/ANaodqoFAUfdB6e1NQjfYbqS\/mM5vDeh3Ns7T2yMZnMrk5+Z9oXnB6YJ46c1eigS3t4bVGxEihUUksVVRgZ6n86vIEe0Vii8KxAxnsvrmqt9Pa2NkL+5AWOFS7lRzgKScYxUc0VLkS1E+Zxu3oOjjk2kqPlkU4x3GOCfTNRMyFWDZwV7g1g2\/iS3jSYaik1p5CK+xiHJR87SNueeCCOxFTS+JtFgk+zvM+XiaUZjJyigk4xtOflPHXIrezMzdaOFbjy\/l+93x9aEMDM7CPOW4PA4wPUiufj8V+HbiKNzJIRKxQAh\/vL14PNdIZEQbUUH5sZyD+fWpdwK7ySFXQLgEkrx6+4P9K0DDGMfe5PY1AksjPsPAwSMH0\/ClLyEhEJG4989hmiwHNeJPEv\/AAjjxK9u8qSQzyB\/NSMZhCnb855J3dv1rmtd8eGxv7LRpLBjNfRRum6Zesg4ThSN2SR15xkCu71HRrLU4ydSUy+WkiptkdCA4w4OxlyCAODWJfaFo9xILu4tUeaJNiu2SQoUqB1xwDgenXrVqxLuUdM1W4S5EYt3Fubv7MZQyffzIAdp525yK6yIYQoDyUHP4r\/jXNaZoumtPJqJhHnRyecG3P8A6wlxu27tuce1dIVkA\/dnJ2\/h2Pc+1E92C2JiZFlMTFW+YDLDPX8aeFkYbgqnPov\/ANehx5imcSAsibhhf\/r08SiNVVScc\/w5\/rWdyiLy5v7v6H\/Gjy5v7v6H\/Gn+cys2OckHOD6Cl+0Seh\/L\/wCvVXA\/\/9H9J5VAnwuB8g\/iK9z6EVCqgRsxA4ZuS\/oT7Gr7okn38H\/vr\/Cq4t7eNSzheCTnB6dfSuVGoiLMqxsyg7R0XGeR+FR73KSfuyMPuJJUdCCe9XQFXgH\/ANC\/wpjwr5ZRGHzryfm7\/hS5b6juVXulcAYGNwJ+Zeg59ajkkR2Levuv+NXJl2Qu8Mau6qSicjcQOBnHGTXNLqOvtaCRtKRZzCz+XvJw4chV7cFec5qoxtsJs2PMG3aPXPVf\/iqmj8qQAMMEKB94c4HsadZebNZxS3cKwzOil4+TtbHIz7GrXlxA\/dB4ByFPfmk1Jp2Gmr6kYwI4l4CsSrD6gf1qrKkMkL2l6hdDkbT0KkYx9CKvSRq0YUkqpJBG3GRx3JqI+SATvZQpxnJxnGe7EVxyhJSTvqbRcWmraGJaaBosEc6pCWjkChg7s5I54yxJwM8DNOu9I0K6\/eSWyNIFKBiCDtI2kcHpgnjtWwgQu+243A88Y6KPoafsjPV2P4n+gq2qrWjBOC3RyaeHtERfKS2QKhyAC2Mk59fUA1rkAsSc9s44P3hWgba1Lbgx5Vc4JHOOe1PjtoEbzFYkkEc5NTGlP2nNJ6IHOPLZIqxsiPlVYkgjlgcUpuAjodp6k\/Mw9DVlzGZACwBQ8gjHUU0RRy7ZY5MAAnpnIPHfNdtrnPcZ5iyHaQqK33iDkn26DrWfOU8qXeMny+OM85FaRtywAMo5BP3R2\/D0FV7iJRayOkhA2lTuGeM\/hjmmlYLmVpW7yZgMYYgHPX7z1tMYhFtR0Jxnk+2OKoaKkZWRQwYFh1U\/3m\/rx+Fahtrdju5BHTA\/POTVTXvMUXoVWMZV2EgxtPBPOcYqQloyUD7cds5\/pUrW0JUjJGRjP+Wp+Iv75\/P\/AOyqLFFVfN2gJLwBj8v+A0v7\/wD56\/p\/9jVnbH\/eP5\/\/AGVGI\/7x\/P8A+yosFz\/\/0v0iDtuClQM9SM5\/rRukkhcsexAX19qiJ2HKhEyOM9cfmK80l8PeJJ\/FYv4YmZWvIpUvzcMFjtV\/1kIhDjJbkfdKnOc5rgqVHBK0bnZSpqbak7aHpH9raarOWvYdkZAc+YnysTgBueCSDxST61piMqLdQ\/NH5hIkThRzu69MHOeK8Q1CwgEOoJLY3CiS\/iBO8YMmZHz\/AKs52hhnr29KtCSzS\/umTT5B5Nmzq5mB3\/uUJUDyyemQMdTzjHFY+3fVHY8Muj\/I9ohvrW4RJIJ\/MWQkIUIYEr1AwTnHeokv7ectLZzLMEXDFTnB64O3OK8r0+4CxaU50t5MmUxtlf3e12EpI8vnKqc56Z4wea6DwPJa\/Y7\/AMmy+zMzq7gvk\/OCRgFUwF6DGe\/fNXGrzNIxqYflTl2\/zPQDI6NhiTjrtBP5Upmlkj8xVcKox2\/h4PGR6UFolY5UuPYY\/ma4hb3Wv7XeFTOENwytCY\/3AtiPvCTGN\/Q\/ezk4xXV6HDc7diGhKShs53cgHI6evvUI2gYXIH4D\/wBmrj7bU\/FxN0rWSb4yoiBRwGUglzkbgSMD8Tjqat22o+KpNRnha0Jt1jZoiY9hZwAQNz4GCc9QDWboRbbkXGo1ojrLdSZDk\/LtYHv2PvTnht9wbIBJ4BUYz+dclqd540XRrubTLZY71IwYQ+05JiJYgAnJD9B6eteS\/DTXPHB16+Pi6K5i05idiX3zuk68FVkYKcHJJyNvQDmsHUVKUaSi3e\/oexh8ulicNVxntEuS2jeru7aLqfRDQIxyAg+mB\/PFMlby2SIHam0kkc859vaooissYljQFeoICf40sCu0xQZCggkEDngfX+ddd0eJYVltjj595JwAMZ\/XFIiSRShowUz8obA7kD6dKn8ozFtqqAG28g56CkBkgDKcYUKRjpySOlK7HYk3SspImyF4IAz+lZ1ww8iZjxlCDhSMkkdePbvUkxiLEna5yCeDuHHuMfrUDOFs5kCtjZ1xxyapNvcCvo4zBMPUgf8AjzVoi2VdwkZgFbaCSee471m6MT5cqhWPIPHszVoyyS5LSRlVJ9R\/WnJ+8yVsKYtsZKMRz1bv\/OmqjNhckn2I\/wDiaebslxHBjByScE\/oKVp59p2spbBwAvP86i7ZRAY5QAPmzgZ4HXv2pNk3q35D\/CrNvHLLEH8x+fc\/41P9nl\/56P8Amf8AGq+YH\/\/T\/SaKQZJbrgdPQf8A66ebuAHac5J2j5TyarebL321AihwG8xVKvuwSOCDXM0upqmW3lhkZPmIwxONp\/wqy0ieWHHQrkZ79azwoDFtwdQTgjHX8KmdmWKFCoOUHcjpn29qElYL6k9sSY8EYwSB7D0qSWISIy4GSCMmqKyPs8tlVh179STTJP8AVtiNQcHkE1FmVctuLgZYttA5\/hwPzFVWdA4d3JJHUYOCPbjtT3TKNiMAgZ4J\/rQ7+ZJkK2WPqPTPr7VaJsNwJB8hGMdX4zyPTPpUezkjarY4yMkfyp4ZVXYRyWJDZFOiXcwj4H3iW4PcYHt1ouFijPeQWCTXdyyQQW0Mks0jZ\/dxqpLNjHIwK8a8P+J\/CnxE1a7j0ua4862U3ZhnXZvgdgN6bS3TI3A4IzXsd9p8N4t1ZXUYnt7iFoJo243xurBlyOnHftXmfg74aeEvh9JfahoYufMuYykk946ERQAh2VNiqMHaMsecCvdwqwP1Wq8Q37TTltt8zycQ8X9Ypqglyfavv8j1SzUxQLDGQI1GMEnOPxFSExySNHtJIdRnjoQv41ylh4w0bULW5ksjIWtYfP2TIYTJGeFdPMwGUnjP6cjMMXibffWsUdsWF2FdmWQfuyDjB2hvT1B5AxnivnvawavGR7joVE7NWO4lEK+YixgEA8g45x1p0yW4jYD72PU9ua8+u\/G32SwN\/daXICJTGyGYk7Rn5yQPTqD0JGeoqxc+Lo0+3rHZ7hZIGJEuc7m2gYCMc+3NT7WHcv6vU7HaTPaWz7XYoTzyzc9qrXskb2LSRMSrHbnJx\/niuKuvEyX+rQWRtyhljDK4fK4ZS\/GVUnpg11DH\/iTr\/v4\/U1zUq8pVXTa0OFucajpzVla6JdFYBJFbozYP4Fz\/AErYcWwBwQxH8Oea5vRrq2cyRxyJIyuQyqwJHMgOcdPxrdlTbGZETkDcDuHUc9K9KbtJmkdh5YjaUUqVzg9evXingsku92dx\/EoHByO3PFMX7SW5OPzxU6icfeOal6Mdhn2WLt8o7AquQPzo+zRf3l\/75X\/GobqGWR1IJHy47epqt9ll9T+lLm8gsf\/U+5V1+5l1gBbqH7H5BdkBiWThC25QWYgdDyxwOtU5vEHiD\/iXjTriMqXK3Cu0JZm8wKwG3PABI45yRW7F4F0aa4a4lmuJiqGA73U5QxeWckKCTgnJ7nrSweFrG3eF4muM28pkTDJjcG+X+HouMAdhx6V5dpy0Z6vPSVml+BiX3iDV5ra6ksby185Z1WMDZwh3AI+XbDjBZh2Hc843tPl8TnVj\/aCpJpxt0MLqUALlRkjaS3JDnnjBFVF8F6V5MiB5lEjBXGV+YKG+98vJO85PXgV2m0rDDGSX2xcM3UkcZP1zWkIS3kzOpONrQX4BApd\/mJX5ONpI6E9amlhHlONz\/dP8R9PrVYPJHtZAvIIOc\/3h\/jUqtJPCzucLg8KMZ49ck4\/Kre5yo4DxuNfSW1ew\/tCW0MMmVsGCyfaePK8w4J8v8CufvdqyL67uLa\/sf7ZZjfiyC3CADywxhkZ8HzEBJweAuB154r1QxxiNQikEAdM1DNY6fPIjzQJIckEuu7Pyn1z6Vg6Lu5X3OyNdKKi1seOaTq2m2mm2kdtC7hbp5P3sKuQyiNcZEgADbxt7lhjr1dDbafaLqtwXuHjldEnVMB\/nkdiVZWHTnPXA4Iz09mj0\/TymwW0IUNu2iNcZPU4x14pX0+xUNi3iG45bCKM855wPWpVJ7Mt4latL+rnmcGmWGseI5ImklSWezKFwQV+aIBmxubkqwABbPU8gcdnpOk2+n6INAmY3cbK6OzqUDCXO4cZwDk4reit7QXAmSBFl67wqhueOuM9OKhnYrIV27gyqTk46nHp7VvGmrXe+pzTrOVkttDhdN+H9joMV0NLuJku5oVhimkYP5UKNkRJtCEKemeT6GrtpoOsR6hZ3T6m\/k2ykTKSQsjdQMHORzyScnA\/Dqg6ryyEjjOD+XJ+tA+ZztXGSSB17D\/69TGjGC5Yqw5Yicm3J3OLi0PXJXeSbUVUSIu3EjHb8i7hsJAO5wTkYIycVUk8O+IEu7SX+0hIkEQ8z946lpASw6Zz1AyTz1NejqgKhvMxUfkxFXO1Rlz1FN013Gq0vIadPWWOM3QDyqgVmHGTjk8epqK9t44NPZEGAGUj2O4U+SNVOMKeM9KZdKPskqRj+JDgD2HpVqmlJStqclo3cranj\/wAO4oIPFmvKdLuLWQknzpJQySgysPlURIByc\/ebgjr29icB0KqvJGBlv\/rV5R4AvdOufEviKGzvri5dHBeKREWKIiVx8jIx39QASBwOO9ewLGXhXbgEE1vLe4I8p8a+Pta8Pa4NNtIo0VIopI43Qu940jkNHEwddpUD0bn8AesvvEz2d5eWi24ZraLemZAC7YUlAMHnnt6c9RXUCIfaleUBmC5UkZxj09OtXa4FTlGUnzaM7XUpyjFcu3nucGPGNwLaCWW0jRpY95VpGyPmYdk74zzzzSf8JnL\/AM+0X\/f1\/wD43XZvcCNtm3djvTPtY\/55it+WRnzR7H\/\/1f0oigli3BWXDNu+6ep\/GqqqduTgkkn7p7k\/7VXUScqCzkHuCo4PcfhTBDcIAiScDpkDP8q4lvqdBVVSpwOhJOMYHP4mpmVHgifaGOwDOM8c1Myy7QHIPPWmBiIIQoYfKMlOvU9c1qnoQ9xhW2PWL9KVVt87Vj42kkd+o\/xqDJZd5L53Eck9Bj0xTh5j\/KozhQPwzU8vULkogEmWiYqAcYyRj9aiUhXVpHYgNjkkj7poR5I4mjJRM7vvdee\/btTirjZ8uCSe\/YDrn8aGtLATrLGv3WDfSpA3mj5e1VPOWJsueR2LCkNwjMWVgM9gy\/40WQFm3yZ2BPAYAfTIqrNuklJRd67VXIOOhz2qzaAZ3bgSWyRkH+L2zUMituQ7COwxg9vqKpPQTRWIUOV38BxgM3PGOOtTgDzkUPjgZ2kH+99aVUkdWU527mypIGOen5e9SeSwkCAIQ6nIPTqPSpb0GhrQlMqgds45OP6CkPTkEje3SmqkzqGESkH\/AGmP9ajljdFB8sD5gf4hn9aE3oBIVy2drgdqZdEi2lZSR8yg4OOgGajZnALeWnAzzk9PrT7ySIwvEjLgAEBSPr2qtboNLHlvgO8ubvxBrkdxewXBgCJ5UQcPGRLLw+5F+nBIyPxPrXPkLjPU9CR\/KvJ\/h9pmqQa7rFxqOmQ28Mh\/dSJgPKRK5y2Hc8A+wzXr2XUKqjYOgyN3J\/EU5vWwkVo1ZJlZtx+U9STxketXPNHpVWVpUm+8CcBeBjrk9z7UbrgfNsz342n+RrO1x3HvbGRt+cZ7U37Gf7wqi7tNIzkHqAPyHvSbD6foKq0guf\/W+\/dN8Sx61ZpqenXAlglZwrlAuSjFG4dAeGUjpV4anc5x5iE+m2P\/AAFeX\/Db\/kR7D\/rref8ApVLXYr\/r61SRNzpP7SvO4Q\/8AH9DUV1rDwWzzyrsihjLPsU\/dQFiQASenaokqhq\/\/IH1D\/r1n\/8ARRpOKGmzKt\/HWjOtlIsk0bag5jhidJFkLbwhLLg7QCRnPqK1NC8Z6f4i+0S6U7ubZ1ilEimMqxG4DDIOx614i3\/Id8M\/9fE3\/pRBW78Kfv8AiL\/r9i\/9FCo9nEttnoOv\/ENNG1BdJSymupWiDsIwDjOF9upIxVXTPiYl7fW2mXOl3Ns11xE8owp2gZ\/9CHcd+4IrkNf\/AOR8\/wC3aH\/0ZHST\/wDIe8O\/WT+lfPzxE1WcU9D9Xw+R4OeXqvKHvcl73e9rntS3ygsWizuOf0x6077dAesP+fyqgOgpK9zkR+UXZqw39ssi4jKZYZPPTP0qFLuIOXldyckADgAduDVE\/eX8P51DL\/rG\/CjlVhKTNk3dixyxOf8AaCn+dN8\/Sc4LKD+Fc9L96qEn+srJotHeC3t9qlGUbgG6jv04JHao7iB4YHnKuViUuWUnOFGenIqt2i\/3I\/5Vv3n\/ACCbr\/rhJ\/6BW0YptXIcnqea3\/i4WEcQuLW48yd\/LMeV3AYQ7sNgkYcdB1\/Ona3rF0llfQWcKx3KTQQpJP5gRjNIq5I2pnarA8E5zXN+M\/8AkP2H+f4beuh8W\/cl\/wCv6x\/9Ct6+ojgqPNB8vX9TwKmLq2lr\/VmVfBeo3Wp3N35kttdwiKKWCW2V1yJJJVbIYnoyHFehY\/eIUVgRk4J64xXj3wT\/AOPD\/txg\/wDSm6r2j\/lvH9G\/pXlZzRjSxUoU1Zafkd+W1JVMPGcnr\/wSs7MzvvUYJHUnsBx0P1qLyo2OAq8+h\/8AsRU8vf8A3\/8A2QVFF94V46PUGQyxbMvCTk5ByOnapfNtv+eB\/MVVj\/1Uf+6KdRyom5\/\/2Q=="
}
```

content是一个json字符串，包含经纬度：
```
{
  "lat":39.926537312885166,
  "long":116.32154022158235
}
```

searchableContent为地理位置的文本描述，content为一个json字符串，包含经纬度，base64edData为位置的缩略图。缩略图的生成规则是，把图片压缩到120X120大小的方框内，45%的质量压缩为JPG格式，再把二进制做base64编码得到字符串。

## 文件消息
```
{
  "type":5,
  "persistFlag":3,
  "searchableContent":"演讲.key",
  "mediaType":4,
  "content":"564471",
  "remoteMediaUrl":"https:\/\/media.wfcoss.cn\/media\/Y2djOGM4VlY-3D-4-1721008897-zJfgQC6AoZ3f.key"
}
```
content存放的为文件大小，searchableContent存放文件名。

## 视频消息
```
{
  "type":6,
  "persistFlag":3,
  "searchableContent":"[视频]",
  "mediaType":3,
  "content":"{\"d\":3,\"duration\":3}",
  "base64edData":"\/9j\/4AAQSkZJRgABAQAASABIAAD\/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAESgAwAEAAAAAQAAAHgAAAAA\/8AAEQgAeABEAwEiAAIRAQMRAf\/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC\/\/EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29\/j5+v\/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC\/\/EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29\/j5+v\/bAEMABwcHBwcHDAcHDBIMDAwSGBISEhIYHhgYGBgYHiQeHh4eHh4kJCQkJCQkJCwsLCwsLDMzMzMzOTk5OTk5OTk5Of\/bAEMBCQkJDw4PGQ4OGTwpISk8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PP\/dAAQABf\/aAAwDAQACEQMRAD8Ab\/wjfiDRJLuGK4g\/0qFH8tS4LGPIwpXHIH8684vLq8ijktHBjcqVbqCcg\/0r0PUo\/NSy03cvmyKQ7uoXGRlRuyeB04pdW0HT4oWZ2NyjIkjbUwdpOfkbgZ7cc8GnuTY89sbu4l0xbdU3IVXocHKnGfrUV5aG6tnv0ZVmj5kTpuA7n3qnbyT+R5S\/NHC+Adoz7e\/StnUAzRRXEMYQOCCBn5vf0\/KptqIyY3M0aEjBIAG0c\/U4q7CDav58TKwKkYbjPqCK63R9HhuLhVtVMe+BXD8hA4z7Y5xitOPwp9p0qS8mBjlwCgYjB\/2s8mnyhY8z+1AnZImAx6DjI9K257a50y1hitym53EiPGwLfMMYyPSruteGZdLtRI+DKMZAxgA\/StDR7lYLuMX0ZEKYxsUFs9sfWhIDotEfUpLeR78M7mTgsMErtXFbOJP7h\/IV0sMqXBkk8lfvY+Zueg681PiP\/njH\/wB9\/wD16odj\/9CK3jmaRL2Z40KyFRAqZViSOOhIzjPI4rZ1HTjdXsgMEayrH5zIpZ1LnjaDwAGznjkE1y8c1\/FeGaNdsRbarKTgAnIXPr06Y9+9dde6xNb+HZjBGq3kTkkELkKMkNxnjjsaEScRoulylb+Zk3iGQAx5IyrnY+AOThuDg9q6u78K20a7NMdZpgwURHIQBiPmAPH1OcVT03R73SraLWplzDB5ZcHDCRJGy5b6cHFdxqGkTwpPqNhPsaTB3OSQFXsB04GcfWrA57SrSSNLq22iGaEArsZgGB+9kr1x6V29noVu0DsG2pcKCFUDC5Azg47motEhtElaZMMq5Eci8Ixb7+OfUd66Tzk42\/yP6UAeeX+mWWmSSQy7bkzRkv52VRVQZGDzycetebrd3WmWyyLJsdsbR\/Ft6gj2r2e9hvZ3kkuU3QK42oeSR7Y9feuQv9B0XT3dE3PcStuXJGEz228cfyoYEujWVxf28l40WDK+7o3PyjnrWv8A2NN\/zz\/8db\/Gm6BfXt3YkyuqmNynT0A9a2\/Muf8Anqv\/AHyKQz\/\/0b1zYsl5JHb3ZlwjSorqeCueOflyTz71gXh1y+Kx3Kr5lzgMMjPlgAnIHIGB1xirmk+KoLDZPbEtKqhJAUAyB2B\/mT1xmuy8OWg1yW81yVfszTARIq8FQDk5xjqcfhimhG9o1rc3WlfYNTwrJ8pAxyuOPbGKtjw9AFMKTzLbnP7oMNo5zxkEgD0HFXbKxjtxyNzL\/F+A6fiK0iaoDBtbafSwIConhGBG4AUr6hgB+oH1rZjJcbzx7U7NMOVJYdD1FADbhwifdLHPAHc1w96VtL6S7vjE7LHvKgY2nsMn\/Gu9ODyaz73T7a+ieK5Xcrdun8qAM3QX1a4sjcC4OJHLYVeBkDgcVtbdW\/5+G\/75H+FZOjXMltaG1t7MskLlAQfT681q\/b7v\/nyb9P8AGgD\/0syDwu0sctxbkCOMDiXClj3U84Iz3zycjtXp3hZpE0eK0mV0O3zAyAlSM8DPr6iuP0DSri9Z5bqEwqu1\/MLEKCxyMDk5GSRk\/X1r1jTraa0tzFNJ5nJIPPA7DnmmIuIW3MW74Ip5NNzTSaYCk01j8poNJ1FMB+ahmRpYyisUJ7in0ZoETQuqJtbk\/hUvmp\/nFRRRRMpLAZz6VJ5MP90flSGf\/9P0Xw417JLdS3SL5YYCKQDaWHOcj8sGuqzXH6RqWi2FjHaw3OQvPzbifXnrituLWNOmTzEuEx05OD+RpiNTNJmsW513TbU7XlDH\/Y+b+VTQatp9xtEU6kt0BOD+RoC5pE0ZrPudSsrZS00oGOCByfyFFtqNndpuhcH2PB\/I0wuX80maz5NUsIpPKkmUN6VaeaKNd7uoHqTQIvw\/c\/GpqzbS\/s5YtyyjGTVn7Va\/89V\/OgZ\/\/9TDjmwfmrVtrK6vF3wKCAcZLAfzNUI0kZtwAH4f\/Wrb09HiiIA6tVNmaRQkL2zNDIcFTyB0oW5IOetW7m3kM5l6Emnx2lxIevWgmxAbot1qY3LBVb1qZtNuFGdvT3qhcX1tazJY3ThWbnOen1pNjSbJTcsetL9oY9ya1JLG5jQFuFUZzU39lTyASDB3c565qtBWNLQZs2bnn\/WH+Qrb8361U0WxmS1ZT\/fP8hWx9jmqR2P\/1eui023AG1MVejsoQuAtWVBHBxxUoyBTJKj2cRbO2rMVrGDnFSZGOetSqcc0CK13GI7eSRVB2qW59RzXzDLqiXV3DLdqeHzKVPLZbPHpgcV9QX2Xs5xnrG38q+Qm\/wBcF9TVRQmz6luNY0v+wzq6fvLYrwO\/pj61V8Iaomr6WzKhRInKKCckL1Az7dK52+Wy0nRE8O2+XR03sScnLHP4Vq+AYYYNMmEXTzOn4ClYo9J06JfJbj+L+grQ8pfSqVj\/AKo\/739BVykI\/9b0IPx6GnhmHNQHrU\/8NMgeGNSBgO+ahFC0ATz4aF19VI\/SvkC5Hl3Deoavr6T7jfQ\/yr5Dv\/8Aj6f\/AHquImfR15JDP4WhvZdit5Me5247Acmuf8Da3DJfXGmIQwI3Aj1GAcVb1T\/knv8A2xj\/AKVwnw4\/5GFv91v6UlsUz6W05\/3Lf739BV\/dWZpv+pb\/AHv6CtCkI\/\/Z",
  "remoteMediaUrl":"https:\/\/media.wfcoss.cn\/media\/Y2djOGM4VlY-3D-3-1721009625-3ECrMyipSf2B.mov"}
```
content是个json字符串，里面存放视频的时长，注意里面为了兼容某些版本，有2个字段是视频时长；base64edData为视频的缩略图。缩略图的生成规则是，选取视频首帧图片，图片压缩到120X120大小的方框内，45%的质量压缩为JPG格式，再把二进制做base64编码得到字符串。

## 动态表情消息
```
{
  "type":7,
  "persistFlag":3,
  "searchableContent":"[动态表情]",
  "mediaType":7,
  "base64edData":"eyJ4Ijo3NTMsInkiOjk2MH0=",
  "remoteMediaUrl":"https:\/\/media.wfcoss.cn\/sticker\/SmNnbUxtNTU-3D-7-1721012109-Ks3DNbSkon3b.jpg"}
```
base64edData是一个json字符串的字节做base64编码得到的字符串。json的格式如下，是表情的尺寸。
```
{
  "x":width,
  "y":"height"
}
```

## 链接消息
```
{
  "type":8,
  "persistFlag":3,
  "searchableContent":"产品介绍 · 野火IM开发手册",
  "base64edData":"eyJ1IjoiaHR0cHM6XC9cL2RvY3Mud2lsZGZpcmVjaGF0LmNuXC8iLCJ0IjoiaHR0cHM6XC9cL2RvY3Mud2lsZGZpcmVjaGF0LmNuXC9mYXZpY29uLmljbyJ9"
}
```
base64edData是一个json字符串的字节做base64编码得到的字符串。json的格式为:
```
{
  "d":"链接的摘要",
  "u":"链接的URL",
  "t":"缩略图的链接地址"
}
```

## 名片消息
```
{
  "type":10,
  "persistFlag":3,
  "content":"cgc8c8VV",
  "base64edData":"eyJkIjoi5aSn6ZuoIiwicCI6Imh0dHBzOlwvXC9tZWRpYS53ZmNvc3MuY25cL3N0YXRpY1wvWTJkak9HTTRWbFktM0QtNS0xNjY2NDI5OTY4LUdwTTE5VzNINjQ4MC5wbmciLCJuIjoiMTY4OCIsImYiOiJKY2dtTG01NSJ9"
}
```
content是目标ID（可能是用户id，群组id，频道ID等，根据t决定）。base64edData是一个json字符串的字节做base64编码得到的字符串。json的格式为:
```
{
  "t":0,
  "f":"来源用户ID",
  "n":"目标的名称",
  "d":"目标的昵称",
  "p":"目标的头像"
}
```
t是名片的类型，0是用户，1是群组，2是频道。当是用户名片时，n是用户的账户（name），d是用户的昵称（displayName），当不是用户时，这2个都是一样的，是群组或者频道的名称。如果有需要扩展更多类型，也是可以的，需要服务器和客户端对齐。

## 组合消息
```
{
  "type":11,
  "persistFlag":3,
  "searchableContent":"[声音] [声音] Untitled.key Hello ",
  "mediaType":0,
  "content":"大雨和Mr Dinosaur02 的聊天记录",
  "base64edData":"eyJtcyI6W3sidWlkIjo0MzA4NDM4MTQ4NTMyMTQzMzgsImN0eXBlIjoyLCJmcm9tIjoiSmNnbUxtNTUiLCJ0eXBlIjowLCJjYyI6IntcImR1cmF0aW9uXCI6Mn0iLCJ0YXJnZXQiOiJjZ2M4YzhWViIsInNlcnZlclRpbWUiOjE3MjAxNzgzNDAzMDQsImNzYyI6Ilvlo7Dpn7NdIiwibXJ1IjoiaHR0cHM6XC9cL21lZGlhLndmY29zcy5jblwvbWVkaWFcL1NtTm5iVXh0TlRVLTNELTItMTcyMDE3ODMzOS1keHRvWDJ3NmsweEcuYW1yIiwibGUiOiIiLCJzdGF0dXMiOjEsIm10IjoyfSx7ImRpcmVjdGlvbiI6MSwidWlkIjo0MzI1ODQzMDA4MzgyNTY3NzAsImN0eXBlIjoyLCJmcm9tIjoiY2djOGM4VlYiLCJ0eXBlIjowLCJjYyI6IntcImR1cmF0aW9uXCI6NX0iLCJ0YXJnZXQiOiJjZ2M4YzhWViIsInNlcnZlclRpbWUiOjE3MjEwMDgyNjg2OTUsImNzYyI6Ilvlo7Dpn7NdIiwibXJ1IjoiaHR0cHM6XC9cL21lZGlhLndmY29zcy5jblwvbWVkaWFcL1kyZGpPR000VmxZLTNELTItMTcyMTAwODI2OC1VamF6dDFWY0hjbnkuYW1yIiwibGUiOiIiLCJzdGF0dXMiOjcsIm10IjoyfSx7ImRpcmVjdGlvbiI6MSwidWlkIjo0MzI1ODU2MjAxNzk2NDg2NDIsImN0eXBlIjo1LCJmcm9tIjoiY2djOGM4VlYiLCJ0eXBlIjowLCJjYyI6IjU2NDQ3MSIsInRhcmdldCI6ImNnYzhjOFZWIiwic2VydmVyVGltZSI6MTcyMTAwODg5NzgwNiwiY3NjIjoiVW50aXRsZWQua2V5IiwibXJ1IjoiaHR0cHM6XC9cL21lZGlhLndmY29zcy5jblwvbWVkaWFcL1kyZGpPR000VmxZLTNELTQtMTcyMTAwODg5Ny16SmZnUUM2QW9aM2Yua2V5IiwibGUiOiIiLCJzdGF0dXMiOjYsIm10Ijo0fSx7InN0YXR1cyI6MSwidWlkIjo0MzI1OTUxMDE1NTQ4MzU1ODYsInRhcmdldCI6ImNnYzhjOFZWIiwic2VydmVyVGltZSI6MTcyMTAxMzQxODg3OCwiZnJvbSI6IkpjZ21MbTU1IiwiY3NjIjoiSGVsbG8iLCJ0eXBlIjowLCJjdHlwZSI6MX1dfQ==",
  "remoteMediaUrl":""
}
```
base64edData是一个json字符串的字节做base64编码得到的字符串，json包含消息列表。json的格式为:
```
{
"ms":[
    {
      "uid":430843814853214338,
      "type":0,
      "target":"cgc8c8VV",
      "line":0,
      "from":"JcgmLm55",
      "direction":0,
      "ctype":2,
      "cc":"{\"duration\":2}",
      "serverTime":1720178340304,
      "csc":"[声音]",
      "mru":"https:\/\/media.wfcoss.cn\/media\/SmNnbUxtNTU-3D-2-1720178339-dxtoX2w6k0xG.amr",
      "le":"",
      "status":1,
      "mt":2
    },
    {
      "uid":432584300838256770,
      "type":0,
      "target":"cgc8c8VV",
      "line":0,
      "from":"cgc8c8VV",
      "direction":1,
      "ctype":2,
      "cc":"{\"duration\":5}",
      "serverTime":1721008268695,
      "csc":"[声音]",
      "mru":"https:\/\/media.wfcoss.cn\/media\/Y2djOGM4VlY-3D-2-1721008268-Ujazt1VcHcny.amr",
      "le":"",
      "status":7,
      "mt":2
    },
    {
      "uid":432585620179648642,
      "type":0,
      "target":"cgc8c8VV",
      "line":0,
      "from":"cgc8c8VV",
      "direction":1,
      "ctype":5,
      "cc":"564471",
      "serverTime":1721008897806,
      "csc":"Untitled.key",
      "mru":"https:\/\/media.wfcoss.cn\/media\/Y2djOGM4VlY-3D-4-1721008897-zJfgQC6AoZ3f.key",
      "le":"",
      "status":6,
      "mt":4
    },
    {
      "uid":432595101554835586,
      "type":0,
      "target":"cgc8c8VV",
      "line":0,
      "from":"JcgmLm55",
      "direction":0,
      "status":1,
      "serverTime":1721013418878,
      "csc":"Hello",
      "ctype":1
    }
  ]
}
```
1. "uid"为消息的UID。
2. "type"、"target"和"line"构成会话。
3. "from"消息的发送者。
4. "direction"消息的方向，0是发送，1是接收。
5. "ctype":消息MessagePlayload的类型。
6. "csc" 消息MessagePlayload的searchableContent字段。
7. "cpc" 消息MessagePlayload的pushContent字段。
8. "cpd" 消息MessagePlayload的pushData字段。
9. "cc" 消息MessagePlayload的content字段。
10. "cbc" 消息MessagePlayload的base64edData字段。
11. "cmt" 消息MessagePlayload的mentionedType字段。
12. "cmts" 消息MessagePlayload的mentionedTargets字段。
13. "ce" 消息MessagePlayload的extra字段。
14. "mt" 消息MessagePlayload的mediaType字段。
15. "mru"消息MessagePlayload的remoteMediaUrl字段。
16. "status":消息的状态。
17. "serverTime":消息的时间

如果消息内容太多，base64edData太大，超过消息最大的大小限制（50KB），那么base64edData只存放前面3条消息内容，remoteMediaUrl存放整个消息列表json的内容。

## 富通知消息
```
{
  "type":12,
  "persistFlag":3,
  "pushContent":"产品审核通知",
  "content":"您好，您的SSL证书以审核通过并成功办理，请关注",
  "base64edData":"ewogICJyZW1hcmsiOiLosKLosKLmg6Dpob4iLAogICJleE5hbWUiOiLor4HkuablsI/liqnmiYsiLAogICJleFBvcnRyYWl0IjoiIiwKICAiZXhVcmwiOiJodHRwczovL3d3dy5iYWlkdS5jb20iLAogICJhcHBJZCI6IjEyMzQ1Njc4OTAiLAogICJkYXRhcyI6WwogICAgewogICAgICAia2V5Ijoi55m76ZmG6LSm5oi3IiwKICAgICAgInZhbHVlIjoi6YeO54GrSU0iLAogICAgICAiY29sb3IiOiIjMTczMTc3IgogICAgfSwKICAgIHsKICAgICAgImtleSI6IuS6p+WTgeWQjeensCIsCiAgICAgICJ2YWx1ZSI6IuWfn+WQjXdpbGRpZnJlY2hhdC5jbueUs+ivt+eahOWFjei0uVNTTOivgeS5piIsCiAgICAgICJjb2xvciI6IiMxNzMxNzciCiAgICB9LAogICAgewogICAgICAia2V5Ijoi5a6h5qC46YCa6L+HIiwKICAgICAgInZhbHVlIjoi6YCa6L+HIiwKICAgICAgImNvbG9yIjoiIzE3MzE3NyIKICAgIH0sCiAgICB7CiAgICAgICJrZXkiOiLor7TmmI4iLAogICAgICAidmFsdWUiOiLor7fnmbvpmYbotKbmiLfmn6XnnIvlpITnkIYiLAogICAgICAiY29sb3IiOiIjMTczMTc3IgogICAgfQogIF0KfQ=="
}
```

base64edData是一个json字符串的字节做base64编码得到的字符串。json的格式为:

```
{
  "remark":"谢谢惠顾",
  "exName":"证书小助手",
  "exPortrait":"",
  "exUrl":"https://www.baidu.com",
  "appId":"1234567890",
  "datas":[
    {
      "key":"登陆账户",
      "value":"野火IM",
      "color":"#173177"
    },
    {
      "key":"产品名称",
      "value":"域名wildifrechat.cn申请的免费SSL证书",
      "color":"#173177"
    },
    {
      "key":"审核通过",
      "value":"通过",
      "color":"#173177"
    },
    {
      "key":"说明",
      "value":"请登陆账户查看处理",
      "color":"#173177"
    }
  ]
}
```

## 文章消息
```
{
  "type":13,
  "persistFlag":3,
  "searchableContent":"文章头条的标题",
  "base64edData":"ewogICJ0b3AiOnsKICAgICJpZCI6IuaWh+eroElEIiwKICAgICJjb3ZlciI6IuaWh+eroOWwgemdouWbvueJh3VybCIsCiAgICAidGl0bGUiOiLmlofnq6DnmoTmoIfpopgiLAogICAgImRpZ2VzdCI6IuaWh+eroOeahOaRmOimgSIsCiAgICAidXJsIjoi5paH56ug55qE5Zyw5Z2AIiwKICAgICJyciI6dHJ1ZQogIH0sCiAgc3ViQXJ0aWNsZXM6WwogICAgewogICAgICAiaWQiOiLmlofnq6BJRCIsCiAgICAgICJjb3ZlciI6IuaWh+eroOWwgemdouWbvueJh3VybCIsCiAgICAgICJ0aXRsZSI6IuaWh+eroOeahOagh+mimCIsCiAgICAgICJkaWdlc3QiOiLmlofnq6DnmoTmkZjopoEiLAogICAgICAidXJsIjoi5paH56ug55qE5Zyw5Z2AIiwKICAgICAgInJyIjp0cnVlCiAgICB9LAogICAgewogICAgICAiaWQiOiLmlofnq6BJRCIsCiAgICAgICJjb3ZlciI6IuaWh+eroOWwgemdouWbvueJh3VybCIsCiAgICAgICJ0aXRsZSI6IuaWh+eroOeahOagh+mimCIsCiAgICAgICJkaWdlc3QiOiLmlofnq6DnmoTmkZjopoEiLAogICAgICAidXJsIjoi5paH56ug55qE5Zyw5Z2AIiwKICAgICAgInJyIjp0cnVlCiAgICB9LAogICAgewogICAgICAiaWQiOiLmlofnq6BJRCIsCiAgICAgICJjb3ZlciI6IuaWh+eroOWwgemdouWbvueJh3VybCIsCiAgICAgICJ0aXRsZSI6IuaWh+eroOeahOagh+mimCIsCiAgICAgICJkaWdlc3QiOiLmlofnq6DnmoTmkZjopoEiLAogICAgICAidXJsIjoi5paH56ug55qE5Zyw5Z2AIiwKICAgICAgInJyIjp0cnVlCiAgICB9CiAgXQp9"
}
```

base64edData是一个json字符串的字节做base64编码得到的字符串。json的格式为:

```
{
  "top":{
    "id":"文章ID",
    "cover":"文章封面图片url",
    "title":"文章的标题",
    "digest":"文章的摘要",
    "url":"文章的地址",
    "rr":true
  },
  subArticles:[
    {
      "id":"文章ID",
      "cover":"文章封面图片url",
      "title":"文章的标题",
      "digest":"文章的摘要",
      "url":"文章的地址",
      "rr":true
    },
    {
      "id":"文章ID",
      "cover":"文章封面图片url",
      "title":"文章的标题",
      "digest":"文章的摘要",
      "url":"文章的地址",
      "rr":true
    },
    {
      "id":"文章ID",
      "cover":"文章封面图片url",
      "title":"文章的标题",
      "digest":"文章的摘要",
      "url":"文章的地址",
      "rr":true
    }
  ]
}
```
json中的rr是readreport的缩写，当为true时，客户端在用户打开文章时，需要上报阅读信息。

## 流式内容正在生成消息
```
{
  "type":14,
  "persistFlag":4,
  "searchableContent":"正在生成的全量文本内容。。。",
  "content":"流的ID"
}
```
persistFlag为4，说明是透传消息，与其他消息不同。

## 流式内容生成完成消息
```
{
  "type":15,
  "persistFlag":4,
  "searchableContent":"生成的全量文本内容",
  "content":"流的ID"
}
```
persistFlag为3。

## 提醒消息（小灰条）
```
"type":90,
"persistFlag":4,
"content":"最近诈骗活动猖獗，请注意防范各种诈骗活动。",
```
