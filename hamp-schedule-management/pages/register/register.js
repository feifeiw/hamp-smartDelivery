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
    errMsg: '',
    OPEN_ID: '',
    globalData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('globalData信息', app.globalData)
		that.setData({
			OPEN_ID: app.globalData.OPEN_ID,
			globalData: app.globalData,
			wxlogin: app.wxLogin
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
						title: '',
						content: res.data.msg
					})
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
    console.log('注册入参', e.detail.value)
    wx.request({
      url: 'https://51jka.com.cn/wxCourt/saveUser',
      data: {
        wechatid: app.globalData.OPEN_ID,
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
          console.log('注册成功信息', res.data.data)
          wx.hideLoading()
          wx.showModal({
            title: '成功',
            content: '注册成功',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
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