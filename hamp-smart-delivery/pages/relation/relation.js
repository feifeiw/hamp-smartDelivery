// pages/relation/relation.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFirst: true,
    isSecond: false
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
  // 扫码
  scanCodeRelation: function (e) {
    var that = this
    var ids = e.currentTarget.dataset.id
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log('扫码结果', res)
        var retcode = wx.getStorageSync('retcode');
        if (ids == 1) {
          // 进入第二部
          wx.showToast({
            title: '扫描成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isFirst: false,
            isSecond: true
          })
        } else if (ids == 2) {
          // 弹出确认关联框
          that.setData({
            isFirst: false,
            isSecond: false
          })
          wx.showModal({
            title: '关联',
            content: '确认关联当前案件信息？',
            showCancel: true,//是否显示取消按钮
            cancelText:"取消",//默认是“取消”
            cancelColor:'black',//取消文字的颜色
            confirmText:"确认",//默认是“确定”
            confirmColor: 'skyblue',//确定文字的颜色
            success: function (res) {
              if (res.cancel) {
                  //点击取消,默认隐藏弹框
                  wx.hideLoading()
                  that.setData({
                    isFirst: true,
                    isSecond: false
                  })
              } else {
                //点击确定-调用确认关联接口
                if (that.data.wxlogin.retcode == 0  || retcode == 0) {
                  console.log('此处调用确认关联接口')
                  that.setData({
                    isFirst: true,
                    isSecond: false
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
            }
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