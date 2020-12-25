// pages/signFor/signFor.js
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

  },
  startScanCode(e){
    var that = this
    that.setData({
			OPEN_ID: app.globalData.OPEN_ID,
			wxlogin: app.wxlogin
    })
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.result) {
          wx.showModal({
            title: '',
            content: '扫码签收成功！',
            showCancel: false,
            success (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/files/files',
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '失败',
            content: '扫码失败，请重试',
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