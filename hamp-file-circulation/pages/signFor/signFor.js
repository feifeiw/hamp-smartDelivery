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
        // 调用签收接口
        if (res.result) {
          let expressno = res.result;
          wx.showLoading({
            title: '识别中...',
          })
          let retcode = wx.getStorageSync('retcode');
          let staffid = wx.getStorageSync('staffid');
          let courtid = wx.getStorageSync('courtid');
          if (retcode === 0) {
            wx.request({
              url: 'https://51jka.com.cn/wxCirculation/updateState',
              data: {
                courtid: courtid,
                staffid: staffid,
                expressno :expressno
              },
              method: 'GET',
              success: function(res) {
                if (res.data.result == true) {
                  wx.hideLoading();
                  wx.showModal({
                    title: '成功',
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
                  //隐藏loading
                  wx.hideLoading();
                  wx.showModal({
                    title: '失败',
                    content: res.data.msg
                  })
                }
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