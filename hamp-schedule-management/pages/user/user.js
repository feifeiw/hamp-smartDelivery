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
    var sessionId = wx.getStorageSync('sessionId');
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      avatarUrl: wx.getStorageSync('avatarUrl'),
      OPEN_ID: app.globalData.OPEN_ID,
      wxlogin: app.wxlogin
    })

    var retcode = wx.getStorageSync('retcode');
    var courtid = wx.getStorageSync('appCourtid');
    if (that.data.wxlogin.retcode == 0 || retcode == 0) {
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
        url: '../register/register',
      })
      wx.showModal({
        title: '未绑定微信，不允许登录',
        content: that.data.wxlogin.retmessage
      })
    }   
    // if (app.globalData.userInfo) {
		// 	this.setData({
		// 		userInfo: app.globalData.userInfo,
		// 		hasUserInfo: true
		// 	})
		// } else if (this.data.canIUse) {
		// 	// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
		// 	// 所以此处加入 callback 以防止这种情况
		// 	app.userInfoReadyCallback = res => {
		// 		this.setData({
		// 			userInfo: res.userInfo,
		// 			hasUserInfo: true
		// 		})
		// 	}
		// } else {
		// 	// 在没有 open-type=getUserInfo 版本的兼容处理
		// 	wx.getUserInfo({
		// 		success: res => {
		// 			app.globalData.userInfo = res.userInfo
		// 			this.setData({
		// 				userInfo: res.userInfo,
		// 				hasUserInfo: true
		// 			})
		// 		}
		// 	})
		// }
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