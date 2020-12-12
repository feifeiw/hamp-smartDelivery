// pages/register/register.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    name: '',
    code: '',
    second: 60,
    getCodeValue: '获取验证码',
    errMsg: '',
    OPEN_ID: '',
    globalData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData)
		that.setData({
			OPEN_ID: app.globalData.OPEN_ID,
			globalData: app.globalData,
			wxlogin: app.wxLogin
		})
  },
  
  // 输入手机号
	bindphoneNumberInput(e) {
    var val = e.detail.value
		this.setData({
			phoneNumber: val
    })
	},
  // 获取验证码
  getCode(e) {
    var that = this
    if (that.data.phoneNumber === '') {
      that.setData({errMsg: '手机号不能为空！'})
      return false
    }
		var sessionId = wx.getStorageSync('sessionId')
		wx.request({
			url: 'https://51jka.com.cn/wxCourt/getsms',
			data: {
				phoneNum: that.data.phoneNumber
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Cookie": sessionId
			},
			method: 'GET',
			success: function(res) {
				if (res.data.result == true) {
					that.timer()
				} else {
					wx.showModal({
						title: '短信验证码已发送，无需重复申请！',
						content: res.data.msg
					})
				}
			}
		})
  },
  // 验证码倒计时
  timer: function() {
    console.log('开始倒计时')
		let promise = new Promise((resolve, reject) => {
			let setTimer = setInterval(() => {
        var second = this.data.second - 1;
        this.setData({
          second: second,
          getCodeValue: second + '秒',
        })
        if (this.data.second <= 0) {
          this.setData({
            second: 60,
            getCodeValue: '获取验证码',
          })
          resolve(setTimer)
        }
      }, 1000)
		})
		promise.then((setTimer) => {
			clearInterval(setTimer)
		})
  },
  // 提交注册
  registerSubmit(e) {
    var that = this
    var formObj = e.detail.value
    var sessionId = wx.getStorageSync('sessionId')
    console.log('注册信息', this.data)
    if (!formObj.phoneNumber || !formObj.name || !formObj.verificationCode) {
      this.setData({errMsg: '请填写完整信息！'})
      return false
    }
    wx.showLoading({
      title: '注册中...',
    })
    console.log('注册入参', e.detail.value)
    wx.request({
      url: 'https://51jka.com.cn/wxCourt/saveUser',
      data: {
        wechatid: that.data.OPEN_ID,
        name: formObj.name,
        phone: formObj.phoneNumber,
        gender: '',
        area: '',
        validateCode: formObj.verificationCode,
        sessionId:sessionId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": sessionId
      },
      method: 'GET',
      success(res) {
        console.log('注册成功！', res)
        if (res.data.result == true) {
          //隐藏loading
          wx.hideLoading()
          wx.showModal({
            title: '成功',
            content: '注册成功',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.login({
                  success: res1 => {
                    wx.getSetting({
                      success: res2 => {
                        if (res2.authSetting['scope.userInfo']) {
                          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                          wx.getUserInfo({
                            success: loginres => {
                              console.log("loginres.userInfo=" + loginres.userInfo)
                              that.data.globalData.userInfo = loginres.userInfo
                              console.log("that.globalData.userInfo=" + that.data.globalData.userInfo)
                              if (that.userInfoReadyCallback) {
                                that.userInfoReadyCallback(loginres)
                              }
                              wx.showLoading({
                                title: '加载中',
                                mask: true,
                                success: function(res1) {},
                                fail: function(res1) {},
                                complete: function(res1) {},
                              })
                              wx.request({
                                url: 'https://51jka.com.cn/wxJudge/getOpenid',
                                data: {
                                  js_code: res1.verificationCode,
                                  grant_type: 'authorization_code',
                                  encryptedData: loginres.encryptedData,
                                  iv: loginres.iv
                                },
                                timeout: 30000,
                                method: 'GET',
                                success: function(res) {
                                  if (res.data.result) {
                                    let jsonObj = res.data.data; //json字符串
                                    let jsonObj2 = JSON.parse(jsonObj); //json字符串转json对象
                                    if (jsonObj2.unionId.length > 10) {
                                      wx.hideLoading();
                                      // let OPEN_ID = jsonObj2.unionId; //获取到的unionId 
                                      // that.data.globalData.OPEN_ID = OPEN_ID;
                                    } else {
                                      that.onLaunch()
                                    }
                                    if (res.data.wxlogin.retcode != 0) {
                                      wx.navigateTo({
                                        url: '/pages/register/register',
                                      })
                                      wx.showModal({
                                        title: '未绑定微信，不允许登录',
                                        content: res.data.wxlogin.retmessage
                                      })
                                    } else {
                                      wx.setStorageSync('courtid', res.data.wxlogin.courtid)
                                      wx.setStorageSync('staffid', res.data.wxlogin.staffid)
                                      wx.setStorageSync('retcode', res.data.wxlogin.retcode)
                                      wx.setStorageSync('retmessage', res.data.wxlogin.retmessage)
                                      // 跳转我的页面
                                      wx.navigateTo({
                                        url: '/pages/user/user',
                                      })
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
                          console.log('需要授权登陆')
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
                });
                wx.switchTab({
                  url: '/pages/user/user'
                })
              }
            }
          })
        } else {
          //隐藏loading
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg
          })
        }
      },
      fail(err) {
        //隐藏loading
        wx.hideLoading();
        console.log(err)
        wx.showToast({
          title: '提交失败，请检查网络！',
          icon: 'none',
          mask: true,
          success: function(err) {},
          fail: function(err) {},
          complete: function(err) {},
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})