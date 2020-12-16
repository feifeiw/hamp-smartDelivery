// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '立即登录',
    avatarUrl: '',
    userInfo: {},
    userList: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo && app.globalData.userInfo != '') {
			that.setData({
				OPEN_ID: app.globalData.OPEN_ID,
				wxlogin: app.wxlogin
			})
		} else {
			// 声明回调函数获取app.js onLaunch中接口调用成功后设置的globalData数据
			app.userInfoLoadCallback = userInfo => {
				if (userInfo != '') {
					that.setData({
						OPEN_ID: app.globalData.OPEN_ID,
						wxlogin: app.wxlogin
					})
				}
			}
    }
    var sessionId = wx.getStorageSync('sessionId');
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      avatarUrl: wx.getStorageSync('avatarUrl')
    })
    var retcode = wx.getStorageSync('retcode');
    var courtid = wx.getStorageSync('appCourtid');
    if (app.wxlogin.retcode == 0 || retcode == 0) {
      // 调用用户信息接口
      wx.request({
        url: 'https://51jka.com.cn/wxCourt/myInfo',
        data: {
          unionId: courtid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": sessionId
        },
        method: 'GET',
        success: function(res) {
          wx.hideLoading()
          if (res.data.result) {
            that.setData({
              userList: res.data.data
            })
          } else {
            wx.showModal({
              title: '失败',
              content: '获取用户信息失败',
            })
          }
        },
        fail: function(res) {
          //隐藏loading
          wx.hideLoading();
          wx.showToast({
            title: '查询失败，请检查网络！',
            icon: 'none',
            mask: true
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/register/register',
      })
      wx.showModal({
        title: '请注册',
        content: that.data.wxlogin.retmessage
      })
    }
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