//app.js
App({
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
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        wx.setStorageSync('latitude', res.latitude)
        wx.setStorageSync('longitude', res.longitude)
      }
    })
    // 登录
    wx.login({
      success: resOne => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登陆', resOne.code)
        // 获取用户信息
        wx.getSetting({
          success: resTwo => {
            console.log(resTwo.authSetting)
            if (resTwo.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: resThree => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = resThree.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(resThree)
                  }
                  wx.showLoading({
                    title: '加载中',
                    mask: true,
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
                      console.log(res)
                      wx.hideLoading()
                      if (res.data.result) {
                        let jsonObj = res.data.data; //json字符串
                        let jsonObj2 = JSON.parse(jsonObj); //json字符串转json对象
                        if (jsonObj2.unionId.length > 10) {
                          //(原先使用的是openid，后来关联多个小程序时，多个小程序中的openid不相同.所以使用的是unionid) 
                          let OPEN_ID = jsonObj2.unionId; //获取到的unionId 
                          that.globalData.OPEN_ID = OPEN_ID;
                        } else {
                          that.onLaunch();
                        }
                        console.log(res.data.wxlogin)
                        if (res.data.wxlogin.retcode != 0) {
                          that.wxlogin.courtid = null;
                          that.wxlogin.staffid = null;
                          that.wxlogin.retcode = null;
                          that.wxlogin.retmessage = '';
                          wx.navigateTo({
                            url: '/pages/register/register',
                            success: function(res) {},
                            fail: function(res) {},
                            complete: function(res) {},
                          })
                          // wx.showModal({
                          //   title: '未绑定微信，不允许登录',
                          //   content: res.data.wxlogin.retmessage
                          // })
                        } else {
                          wx.setStorageSync('courtid',res.data.wxlogin.courtid)
                          wx.setStorageSync('staffid',res.data.wxlogin.staffid)
                          wx.setStorageSync('retcode',res.data.wxlogin.retcode)
                          wx.setStorageSync('retmessage',res.data.wxlogin.retmessage)
                          that.wxlogin.courtid = res.data.wxlogin.courtid;
                          that.wxlogin.staffid = res.data.wxlogin.staffid;
                          that.wxlogin.retcode = res.data.wxlogin.retcode;
                          that.wxlogin.retmessage = res.data.wxlogin.retmessage;
                        }
                      } else {
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
  },

  globalData: {
		userInfo: null,
		OPEN_ID: ''
	},
	wxlogin: {
		courtid: null,
		staffid: null,
		retcode: null,
		retmessage: ''
	}
})