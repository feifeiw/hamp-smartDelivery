// pages/send/send.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
			OPEN_ID: app.globalData.OPEN_ID,
			wxlogin: app.wxlogin
    })
  },
  // 扫码送达
  sendScanCode: function (options) {
    var that = this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log('扫码结果', res)
        let barcode = res.result
        wx.setStorageSync('barcode', barcode)
				wx.showLoading({
					title: '识别中',
        })
        let retcode = wx.getStorageSync('retcode');
        if (retcode == 0) {
          wx.request({
            url: 'https://51jka.com.cn/wxCourt/getDelivery',
            data: {
							barcode: barcode,
							courtid: wx.getStorageSync('courtid'),
							staffid: wx.getStorageSync('staffid'),
						},
            method: 'GET',
            success(res) {
              wx.hideLoading()
              console.log('扫码结果', res)
              if (res.data.result == true) {
                wx.setStorageSync('sendCaseInfo', res.data.data)
                wx.navigateTo({
                  url: '/pages/sendInformation/sendInformation?'
                })
              } else {
                wx.showModal({
									title: '二维码无效，请重试！',
									content: res.data.msg
								})
              }
            },
            fail: function(res) {
							wx.hideLoading()
							wx.showToast({
								title: '查询失败，请检查网络！',
								icon: 'none',
								mask: true,
							})
						}
          })
        } else {
          wx.hideLoading()
					wx.showModal({
						title: '未绑定微信，不允许登录',
						content: that.data.wxlogin.retmessage
          })
          wx.navigateTo({
						url: '/pages/authorization/authorization',
					})
				}
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