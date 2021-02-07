//app.js
App({
  globalData: {
		userInfo: null,
		OPEN_ID: ''
	},
  onLaunch: function () {
    const that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.request({
			url: 'https://51jka.com.cn/wxCourt/getSessionId',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: 'POST',
			success: function(res) {
				wx.setStorageSync('sessionId', 'JSESSIONID=' + res.data)
			}
    })
    // 登录
    wx.login({
      success: resOne => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登陆信息', resOne)
        wx.getSetting({
          success: resTwo => {
            if (resTwo.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: resThree => {
                  // 可以将 res 发送给后台解码出 unionId
                  console.log('globalData.userInfo', resThree.userInfo)
                  that.globalData.userInfo = resThree.userInfo
                  if (that.userInfoLoadCallback) {
                    that.userInfoLoadCallback(resThree.userInfo)
                  }
                  wx.showLoading({
                    title: '加载中',
                    mask: true,
                    success: function(resOne) {},
                    fail: function(resOne) {},
                    complete: function(resOne) {},
                  })
                  wx.request({
                    url: 'https://51jka.com.cn/wxCirculation/getOpenid',
                    data: {
                      js_code: resOne.code,
                      grant_type: 'authorization_code',
                      encryptedData: resThree.encryptedData,
                      iv: resThree.iv
                    },
                    timeout: 30000,
                    method: 'GET',
                    success: function(res) {
                      console.log('openid', JSON.parse(res.data.data))
                      if (res.data.result) {
                        let jsonObj = JSON.parse(res.data.data); //json字符串转json对象
                        wx.setStorageSync('avatarUrl',jsonObj.avatarUrl)
                        if (jsonObj.unionId.length > 10) {
                          wx.hideLoading();
                          //(原先使用的是openid，后来关联多个小程序时，多个小程序中的openid不相同.所以使用的是unionid)
                          wx.setStorageSync('appCourtid',jsonObj.unionId)
                          let OPEN_ID = jsonObj.unionId; //获取到的unionId 
                          that.globalData.OPEN_ID = OPEN_ID;
                        } else {
                          that.onLaunch();
                        }
                        if (res.data.wxlogin.retcode != 0) {
                          wx.setStorageSync('courtid',res.data.wxlogin.courtid)
                          wx.setStorageSync('staffid',res.data.wxlogin.staffid)
                          wx.setStorageSync('retcode',res.data.wxlogin.retcode)
                          wx.setStorageSync('retmessage',res.data.wxlogin.retmessage)
                          wx.navigateTo({
                            url: '/pages/register/register',
                            success: function(res) {},
                            fail: function(res) {},
                            complete: function(res) {},
                          })
                          wx.showModal({
                            title: '请注册',
                            content: res.data.wxlogin.retmessage
                          })
                        } else {
                          wx.setStorageSync('courtid',res.data.wxlogin.courtid)
                          wx.setStorageSync('staffid',res.data.wxlogin.staffid)
                          wx.setStorageSync('retcode',res.data.wxlogin.retcode)
                          wx.setStorageSync('retmessage',res.data.wxlogin.retmessage)
                          // 获取权限标识
                          wx.showLoading({
                            title: '获取权限标识...',
                          })
                          wx.request({
                            url: 'https://51jka.com.cn/wxCirculation/getAuth',
                            data: {
                              courtid: res.data.wxlogin.courtid,
                              staffid: res.data.wxlogin.staffid
                            },
                            method: 'GET',
                            success: function(data) {
                              wx.hideLoading();
                              console.log('权限标识', data.data)
                              if (!data.statusCode == 200) return
                              wx.setStorageSync('userAuth', data.data.data)
                            },
                            fail: function(err) {
                              wx.hideLoading();
                              wx.showToast({
                                title: '获取权限标识失败，请重试！',
                                icon: 'none',
                                mask: true
                              })
                            }
                          })
                        }
                      }
                    },
                    fail: function() {
                      wx.showModal({
                        title: '失败',
                        content: '连接服务器失败',
                      })
                    }
                  })
                }
              })
            } else {
              // 未授权
              wx.navigateTo({
                url: '/pages/authorization/authorization',
              })
              wx.showModal({
                title: '未授权，请先授权',
                content: "未授权，请先授权"
              })
            }
          }
        })
      }
    })    
  }
})