// pages/register/register.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    name: '',
    verificationCode: '',
    second: 60,
    getCodeValue: '获取验证码',
    accountNO: '',
    password: '',
    errMsg: '',
    isClickCode: true,
    activeIndex: 0,
    regiesterTabs: ['手机号注册', '账号注册']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let recode = wx.getStorageSync('recode')
    // if (recode )
    console.log('globalData信息', app.globalData)
  },
  // 切换注册
  tabClick(e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  // 输入账号
  bindAccountNO(e) {
    this.setData({
			password: e.detail.value
    })
  },
  // 输入密码
  bindPassword(e) {
    this.setData({
			password: e.detail.value
    })
  },
  // 输入姓名
  bindName(e) {
    let val = e.detail.value
		this.setData({
			name: val
    })
  },
  // 输入手机号
	bindPhoneInput(e) {
    let val = e.detail.value
		this.setData({
			phoneNumber: val
    })
  },
  // 输入验证码
  bindCode(e) {
    let val = e.detail.value
		this.setData({
      verificationCode: val
    })
  },
  // 获取验证码
  getCode(e) {
    var that = this
    if (that.data.phoneNumber === '') {
      that.setData({errMsg: '手机号不能为空！'})
      setTimeout(() => {
        that.setData({errMsg: ''})
      }, 1000);
      return false
    } else {
      let _reg = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/
      if (!_reg.test(that.data.phoneNumber)) { 
        that.setData({errMsg: '请填写正确的手机号码！'})
        setTimeout(() => {
          that.setData({errMsg: ''})
        }, 1000);
        return false
      } 
    }
    var sessionId = wx.getStorageSync('sessionId')
    that.setData({
      isClickCode: false,
      getCodeValue: '60秒',
    })
    that.timer()
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
					that.setData({errMsg: '验证码发送成功！'})
          setTimeout(() => {
            that.setData({errMsg: ''})
          }, 1000);
				} else {
          that.setData({errMsg: res.data.msg})
          setTimeout(() => {
            that.setData({errMsg: ''})
          }, 1000);
				}
			}
		})
  },
  // 验证码倒计时
  timer: function() {
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
            isClickCode: true,
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
  // 账号注册
  accountSubmit(e) {
    let that = this
    let formObj = e.detail.value
    let sessionId = wx.getStorageSync('sessionId')
    if (!formObj.accountNO || !formObj.password) {
      this.setData({errMsg: '请填写完整信息！'})
      setTimeout(() => {
        this.setData({errMsg: ''})
      }, 1000);
      return false
    }
    wx.showLoading({
      title: '注册中...',
    })
    wx.request({
      url: 'https://51jka.com.cn/wxCirculation/wxRegister',
      data: {
        accountNO: formObj.accountNO,
        passwordmd5: formObj.password,
        wxUNID:  wx.getStorageSync('appCourtid'),
        wxOpenID: app.globalData.OPEN_ID
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": sessionId
      },
      method: 'GET',
      success(res) {
        console.log('注册返回信息', res)
        wx.hideLoading();
        if (res.data.result == true) {
          wx.showModal({
            title: '成功',
            content: '注册成功',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                that.getUserInfo()
                wx.switchTab({
                  url: '/pages/signFor/signFor',
                  success: function(e) {
                    let page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '失败',
            content: res.data.msg
          })
        }
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({
          title: '注册失败，请检查网络！',
          icon: 'none',
          mask: true
        })
      }
    })
  },
  // 提交注册
  registerSubmit(e) {
    let that = this
    let formObj = e.detail.value
    let sessionId = wx.getStorageSync('sessionId')
    if (!formObj.phoneNumber || !formObj.name || !formObj.verificationCode) {
      this.setData({errMsg: '请填写完整信息！'})
      setTimeout(() => {
        this.setData({errMsg: ''})
      }, 1000);
      return false
    }
    wx.showLoading({
      title: '注册中...',
    })
    wx.request({
      url: 'https://51jka.com.cn/wxCourt/saveUser',
      data: {
        wechatid: wx.getStorageSync('appCourtid'),
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
        console.log('注册返回信息', res)
        if (res.data.result == true) {
          //隐藏loading
          wx.hideLoading()
          wx.showModal({
            title: '成功',
            content: '注册成功',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                that.getUserInfo()
                wx.switchTab({
                  url: '/pages/signFor/signFor',
                  success: function(e) {
                    let page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
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
  getUserInfo() {
    // 调用接口获取openID
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    const openPrams = JSON.parse(wx.getStorageSync('openParams'))
    wx.login({
      success: resOne => {
        wx.request({
          url: 'https://51jka.com.cn/wxCirculation/getOpenid',
          data: {
            js_code: resOne.code,
            grant_type: 'authorization_code',
            encryptedData: openPrams.encryptedData,
            iv: openPrams.iv
          },
          timeout: 30000,
          method: 'GET',
          success: function(res) {
            wx.hideLoading();
            // console.log('授权获取openID', res.data)
            if (!res.data.data) {
              wx.showToast({
                title: '接口返回信息错误，请重试',
                icon: 'none',
              })
              wx.setStorageSync('courtid','1')
              wx.setStorageSync('staffid','410')
              wx.setStorageSync('retcode', '0')
            }
            if (res.data.result) {
              let jsonObj = JSON.parse(res.data.data); //json字符串转json对象
              wx.setStorageSync('avatarUrl',jsonObj.avatarUrl)
              // 存储unionid
              if (jsonObj.unionId.length > 10) {
                wx.setStorageSync('appCourtid',jsonObj.unionId)
                let OPEN_ID = jsonObj.unionId; //获取到的unionId 
                app.globalData.OPEN_ID = OPEN_ID;
              }
            }
            wx.setStorageSync('courtid',res.data.wxlogin.courtid)
            wx.setStorageSync('staffid',res.data.wxlogin.staffid)
            wx.setStorageSync('retcode',res.data.wxlogin.retcode)
            wx.setStorageSync('retmessage',res.data.wxlogin.retmessage)
          },
          fail: function() {
            wx.hideLoading();
            wx.showModal({
              title: '失败',
              content: '连接服务器失败，请重试',
            })
          }
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