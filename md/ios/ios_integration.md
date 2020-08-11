1. 编译ios-chat项目，真机和模拟器都编译一遍。
2. 把项目wfchat目录下的FrameWorks拖拽到新工程中。
3. 把野火的库都改成Embed & Sign
4. 添加库 CallKit.framework, UserNotifications.framework.
5. Build Settings -> Allow Non-modular Includes In Framework Modules 设置为YES
6. 在AppDelegate文件中做如下处理:
    1. 引入header
```
#import <WFChatClient/WFCChatClient.h>
#import <WFAVEngineKit/WFAVEngineKit.h>
#import <WFChatUIKit/WFChatUIKit.h>
#import <UserNotifications/UserNotifications.h>
```

    2. 在application:didFinishLaunchingWithOptions:函数中初始化client，
```
    [WFCCNetworkService startLog];
    [WFCCNetworkService sharedInstance].connectionStatusDelegate = self;
    [WFCCNetworkService sharedInstance].receiveMessageDelegate = self;
    [[WFCCNetworkService sharedInstance] setServerAddress:IM_SERVER_HOST];
```

    3. 初始化音视频
    ```
    [[WFAVEngineKit sharedEngineKit] addIceServer:ICE_ADDRESS userName:ICE_USERNAME password:ICE_PASSWORD];
    [[WFAVEngineKit sharedEngineKit] setVideoProfile:kWFAVVideoProfile360P swapWidthHeight:YES];
    [WFAVEngineKit sharedEngineKit].delegate = self;
    [WFAVEngineKit sharedEngineKit].maxVideoCallCount = 4;
    [WFAVEngineKit sharedEngineKit].maxAudioCallCount = 9;
```

    4. 设置AppServerProvider
    ```
    //[WFCUConfigManager globalManager].appServiceProvider = [AppService sharedAppService];
    ```
    > ChatUIKit有些操作需要上层来完成，需要设置appServiceProvider，快速集成时可以先注释掉。

    5. 设置QRCode的代理
    ```
    setQrCodeDelegate(self);
    ```

7. 处理推送token
    1. 先在application:didFinishLaunchingWithOptions:函数中注册用户通知设置
    ```
    if (@available(iOS 10.0, *)) {
        //第一步：获取推送通知中心
        UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
        center.delegate = self;
        [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert|UNAuthorizationOptionSound|UNAuthorizationOptionBadge)
                              completionHandler:^(BOOL granted, NSError * _Nullable error) {
                                  if (!error) {
                                      NSLog(@"succeeded!");
                                      dispatch_async(dispatch_get_main_queue(), ^{
                                          [application registerForRemoteNotifications];
                                      });
                                  }
                              }];
    } else {
        UIUserNotificationSettings *settings = [UIUserNotificationSettings
                                                settingsForTypes:(UIUserNotificationTypeBadge |
                                                                  UIUserNotificationTypeSound |
                                                                  UIUserNotificationTypeAlert)
                                                categories:nil];
        [application registerUserNotificationSettings:settings];
    }
    ```

    2. 然后在application:didRegisterUserNotificationSettings:函数中注册远程推送
    ```
    - (void)application:(UIApplication *)application didRegisterUserNotificationSettings:
    (UIUserNotificationSettings *)notificationSettings {
      // register to receive notifications
      [application registerForRemoteNotifications];
    }
    ```

    3. 在application:didRegisterForRemoteNotificationsWithDeviceToken:函数中设置推送token到client
    ```
    if ([deviceToken isKindOfClass:[NSData class]]) {
        const unsigned *tokenBytes = [deviceToken bytes];
        NSString *hexToken = [NSString stringWithFormat:@"%08x%08x%08x%08x%08x%08x%08x%08x",
                              ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                              ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                              ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];
        [[WFCCNetworkService sharedInstance] setDeviceToken:hexToken];
    } else {
        NSString *token = [[[[deviceToken description] stringByReplacingOccurrencesOfString:@"<"
                                                                                 withString:@""]
                            stringByReplacingOccurrencesOfString:@">"
                            withString:@""]
                           stringByReplacingOccurrencesOfString:@" "
                           withString:@""];

        [[WFCCNetworkService sharedInstance] setDeviceToken:token];
    }
    ```

8. 设置角标，当程序退到后台时读取未读数，设置角标。如果还有其它用用的未读信息，需要进行累计。

  ```
  - (void)applicationDidEnterBackground:(UIApplication *)application {
    WFCCUnreadCount *unreadCount = [[WFCCIMService sharedWFCIMService] getUnreadCount:@[@(Single_Type), @(Group_Type), @(Channel_Type)] lines:@[@(0)]];
    int unreadFriendRequest = [[WFCCIMService sharedWFCIMService] getUnreadFriendRequestStatus];
    [UIApplication sharedApplication].applicationIconBadgeNumber = unreadCount.unread + unreadFriendRequest;
  }
  ```

9. 程序停止运行时停止日志

  ```
  - (void)applicationWillTerminate:(UIApplication *)application {
    [WFCCNetworkService startLog];
  }
  ```
10. 实现各种delegate和provider
    1. 先声明实现这些代理
    ```
    @interface AppDelegate () <ConnectionStatusDelegate, ReceiveMessageDelegate, WFAVEngineDelegate,UNUserNotificationCenterDelegate, QrCodeDelegate>
    @property(nonatomic, strong) AVAudioPlayer *audioPlayer;
    @end
    ```

    2. ConnectionStatusDelegate 是连接状态的处理，有些状态码需要进行处理，比如密钥错误或者token错误，示例代码如下:

    ```
    - (void)onConnectionStatusChanged:(ConnectionStatus)status {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (status == kConnectionStatusRejected || status == kConnectionStatusTokenIncorrect || status == kConnectionStatusSecretKeyMismatch) {
                [[WFCCNetworkService sharedInstance] disconnect:YES clearSession:YES];
            } else if (status == kConnectionStatusLogout) {
                //UIViewController *loginVC = [[WFCLoginViewController alloc] init];
                //UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:loginVC];
                //self.window.rootViewController = nav;
            }
        });
    }

    ```

    3. ReceiveMessageDelegate 接受消息的代码，如果在后台，需要实现本地通知。

    ```
    - (void)onReceiveMessage:(NSArray<WFCCMessage *> *)messages hasMore:(BOOL)hasMore {
      if ([UIApplication sharedApplication].applicationState == UIApplicationStateBackground) {
        WFCCUnreadCount *unreadCount = [[WFCCIMService sharedWFCIMService] getUnreadCount:@[@(Single_Type), @(Group_Type), @(Channel_Type)] lines:@[@(0)]];
        int count = unreadCount.unread;
        [UIApplication sharedApplication].applicationIconBadgeNumber = count;

        for (WFCCMessage *msg in messages) {
            //当在后台活跃时收到新消息，需要弹出本地通知。有一种可能时客户端已经收到远程推送，然后由于voip/backgroud fetch在后台拉活了应用，此时会收到接收下来消息，因此需要避免重复通知
            if (([[NSDate date] timeIntervalSince1970] - (msg.serverTime - [WFCCNetworkService sharedInstance].serverDeltaTime)/1000) > 3) {
                continue;
            }

            if (msg.direction == MessageDirection_Send) {
                continue;
            }

            int flag = (int)[msg.content.class performSelector:@selector(getContentFlags)];
            WFCCConversationInfo *info = [[WFCCIMService sharedWFCIMService] getConversationInfo:msg.conversation];
            if((flag & 0x03) && !info.isSilent && ![msg.content isKindOfClass:[WFCCCallStartMessageContent class]]) {
              UILocalNotification *localNote = [[UILocalNotification alloc] init];

              localNote.alertBody = [msg digest];
              if (msg.conversation.type == Single_Type) {
                WFCCUserInfo *sender = [[WFCCIMService sharedWFCIMService] getUserInfo:msg.conversation.target refresh:NO];
                if (sender.displayName) {
                    if (@available(iOS 8.2, *)) {
                        localNote.alertTitle = sender.displayName;
                    } else {
                        // Fallback on earlier versions
                    }
                }
              } else if(msg.conversation.type == Group_Type) {
                  WFCCGroupInfo *group = [[WFCCIMService sharedWFCIMService] getGroupInfo:msg.conversation.target refresh:NO];
                  WFCCUserInfo *sender = [[WFCCIMService sharedWFCIMService] getUserInfo:msg.fromUser refresh:NO];
                  if (sender.displayName && group.name) {
                      if (@available(iOS 8.2, *)) {
                          localNote.alertTitle = [NSString stringWithFormat:@"%@@%@:", sender.displayName, group.name];
                      } else {
                          // Fallback on earlier versions
                      }
                  }else if (sender.displayName) {
                      if (@available(iOS 8.2, *)) {
                          localNote.alertTitle = sender.displayName;
                      } else {
                          // Fallback on earlier versions
                      }
                  }
                  if (msg.status == Message_Status_Mentioned || msg.status == Message_Status_AllMentioned) {
                      if (sender.displayName) {
                          localNote.alertBody = [NSString stringWithFormat:@"%@在群里@了你", sender.displayName];
                      } else {
                          localNote.alertBody = @"有人在群里@了你";
                      }

                  }
              }

              localNote.applicationIconBadgeNumber = count;
              localNote.userInfo = @{@"conversationType" : @(msg.conversation.type), @"conversationTarget" : msg.conversation.target, @"conversationLine" : @(msg.conversation.line) };

                dispatch_async(dispatch_get_main_queue(), ^{
                  [[UIApplication sharedApplication] scheduleLocalNotification:localNote];
                });
            }
        }

      }
    }
    ```

    4. WFAVEngineDelegate 音视频代理。

    ```
    - (void)didReceiveCall:(WFAVCallSession *)session {
        UIViewController *videoVC;
        if (session.conversation.type == Group_Type && [WFAVEngineKit sharedEngineKit].supportMultiCall) {
            videoVC = [[WFCUMultiVideoViewController alloc] initWithSession:session];
        } else {
            videoVC = [[WFCUVideoViewController alloc] initWithSession:session];
        }

        [[WFAVEngineKit sharedEngineKit] presentViewController:videoVC];
        if ([UIApplication sharedApplication].applicationState == UIApplicationStateBackground) {
            UILocalNotification *localNote = [[UILocalNotification alloc] init];

            localNote.alertBody = @"来电话了";

                WFCCUserInfo *sender = [[WFCCIMService sharedWFCIMService] getUserInfo:session.participantIds[0] refresh:NO];
                if (sender.displayName) {
                    if (@available(iOS 8.2, *)) {
                        localNote.alertTitle = sender.displayName;
                    } else {
                        // Fallback on earlier versions

                    }
                }

            localNote.soundName = @"ring.caf";

            dispatch_async(dispatch_get_main_queue(), ^{
                [[UIApplication sharedApplication] scheduleLocalNotification:localNote];
            });
        }
    }

    - (void)shouldStartRing:(BOOL)isIncoming {

        if([UIApplication sharedApplication].applicationState == UIApplicationStateBackground) {
            AudioServicesAddSystemSoundCompletion(kSystemSoundID_Vibrate, NULL, NULL, systemAudioCallback, NULL);
            AudioServicesPlaySystemSound (kSystemSoundID_Vibrate);
        } else {
            AVAudioSession *audioSession = [AVAudioSession sharedInstance];
            //默认情况按静音或者锁屏键会静音
            [audioSession setCategory:AVAudioSessionCategorySoloAmbient error:nil];
            [audioSession setActive:YES error:nil];

            if (self.audioPlayer) {
                [self shouldStopRing];
            }

            NSURL *url = [[NSBundle mainBundle] URLForResource:@"ring" withExtension:@"mp3"];
            NSError *error = nil;
            self.audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:&error];
            if (!error) {
                self.audioPlayer.numberOfLoops = -1;
                self.audioPlayer.volume = 1.0;
                [self.audioPlayer prepareToPlay];
                [self.audioPlayer play];
            }
        }
    }

    void systemAudioCallback (SystemSoundID soundID, void* clientData) {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            if([UIApplication sharedApplication].applicationState == UIApplicationStateBackground) {
                if ([WFAVEngineKit sharedEngineKit].currentSession.state == kWFAVEngineStateIncomming) {
                    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
                }
            }
        });
    }

    - (void)shouldStopRing {
        if (self.audioPlayer) {
            [self.audioPlayer stop];
            self.audioPlayer = nil;
            [[AVAudioSession sharedInstance] setActive:NO withOptions:AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation error:nil];
        }
    }
    ```

    5. UNUserNotificationCenterDelegate

    ```
    - (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler API_AVAILABLE(ios(10.0)){
        NSLog(@"----------willPresentNotification");
    }
    //已经完成推送
    - (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler API_AVAILABLE(ios(10.0)){
        NSLog(@"============didReceiveNotificationResponse");
        NSString *categoryID = response.notification.request.content.categoryIdentifier;
        if ([categoryID isEqualToString:@"categoryIdentifier"]) {
            if ([response.actionIdentifier isEqualToString:@"enterApp"]) {
                if (@available(iOS 10.0, *)) {

                } else {
                    // Fallback on earlier versions
                }
            }else{
                NSLog(@"No======");
            }
        }
        completionHandler();
    }
    ```

    6. QrCodeDelegate ChatUIKit需要显示二维码或者扫码二维码

    ```
    - (void)showQrCodeViewController:(UINavigationController *)navigator type:(int)type target:(NSString *)target {
            CreateBarCodeViewController *vc = [CreateBarCodeViewController new];
            vc.qrType = type;
            vc.target = target;
            [navigator pushViewController:vc animated:YES];
        }

        - (void)scanQrCode:(UINavigationController *)navigator {
        //    QQLBXScanViewController *vc = [QQLBXScanViewController new];
        //    vc.libraryType = SLT_Native;
        //    vc.scanCodeType = SCT_QRCode;
        //
        //    vc.style = [StyleDIY qqStyle];
        //
        //    //镜头拉远拉近功能
        //    vc.isVideoZoom = YES;
        //
        //    vc.hidesBottomBarWhenPushed = YES;
        //    __weak typeof(self)ws = self;
        //    vc.scanResult = ^(NSString *str) {
        //        [ws handleUrl:str withNav:navigator];
        //    };
        //    [navigator pushViewController:vc animated:YES];
        }
    ```

11. 处理OpenUrl

```
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
    return [self handleUrl:[url absoluteString] withNav:application.delegate.window.rootViewController.navigationController];
}

- (BOOL)handleUrl:(NSString *)str withNav:(UINavigationController *)navigator {
    NSLog(@"str scanned %@", str);
    if ([str rangeOfString:@"wildfirechat://user" options:NSCaseInsensitiveSearch].location == 0) {
        NSString *userId = [str lastPathComponent];
        WFCUProfileTableViewController *vc2 = [[WFCUProfileTableViewController alloc] init];
        vc2.userId = userId;
        vc2.hidesBottomBarWhenPushed = YES;

        [navigator pushViewController:vc2 animated:YES];
        return YES;
    } else if ([str rangeOfString:@"wildfirechat://group" options:NSCaseInsensitiveSearch].location == 0) {
        //NSString *groupId = [str lastPathComponent];
        //GroupInfoViewController *vc2 = [[GroupInfoViewController alloc] init];
        //vc2.groupId = groupId;
        //vc2.hidesBottomBarWhenPushed = YES;
        //[navigator pushViewController:vc2 animated:YES];
        return YES;
    } else if ([str rangeOfString:@"wildfirechat://pcsession" options:NSCaseInsensitiveSearch].location == 0) {
        //NSString *sessionId = [str lastPathComponent];
        //PCLoginConfirmViewController *vc2 = [[PCLoginConfirmViewController alloc] init];
        //vc2.sessionId = sessionId;
        //vc2.hidesBottomBarWhenPushed = YES;
        //[navigator pushViewController:vc2 animated:YES];
        return YES;
    }
    return NO;
}
```

12. Background Modes 勾选 "Voice over IP" 和 "Remote notifications"
13. 添加URL Schemes。注意我们demo使用的是```wildfirechat```，需要更换成你们自己的，然后步骤11，Scheme替换成你们自己的
14. 添加ATS。如果IM服务媒体服务支持https，可以不用添加ATS支持。
15. 添加权限，麦克风，地理位置，相机，相册等
16. 添加登录代码。应用登录时返回token，然后使用token连接
```
//需要注意token跟clientId是强依赖的，一定要调用getClientId获取到clientId，然后用这个clientId获取token，这样connect才能成功，如果随便使用一个clientId获取到的token将无法链接成功。另外不能多次connect，如果需要切换用户请先disconnect，然后3秒钟之后再connect（如果是用户手动登录可以不用等，因为用户操作很难3秒完成，如果程序自动切换请等3秒）。
[[WFCCNetworkService sharedInstance] connect:savedUserId token:savedToken];
```
> 登录成功后可以保存在NSUserDefaults，下次应用启动时可以直接使用保存的userId&token进行连接。

17. 打开会话列表
```
WFCUConversationTableViewController *vc = [[WFCUConversationTableViewController alloc] init];
    //Show vc
```
