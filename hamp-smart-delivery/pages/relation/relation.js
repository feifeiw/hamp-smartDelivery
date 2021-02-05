// pages/relation/relation.js
const app = getApp()
let that = this;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFirst: true,
    isSecond: false,
    codeNumOne: '',
    codeNumTwo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.setData({
			OPEN_ID: app.globalData.OPEN_ID,
			wxlogin: app.wxlogin
    })
  },
  // 扫码
  scanCodeRelationOne: function (e) {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.result) {
          that.setData({
            codeNumOne: res.result
          })
        }
        wx.showToast({
          title: '扫描成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          isFirst: false,
          isSecond: true
        })
      }
    })
  },
  scanCodeRelationTwo: function(e) {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.result) {
          // 弹出确认关联框
          that.setData({
            codeNumTwo: res.result,
            isFirst: false,
            isSecond: false
          })
          wx.showModal({
            title: '关联',
            content: '确认关联当前案件信息？',
            showCancel: true, // 是否显示取消按钮
            cancelText:"取消", // 默认是“取消”
            cancelColor:'black', // 取消文字的颜色
            confirmText:"确认", // 默认是“确定”
            confirmColor: 'skyblue', // 确定文字的颜色
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
                wx.showLoading({
                  title: '关联中...',
                })
                let retcode = wx.getStorageSync('retcode');
                if (retcode == 0) {
                  console.log('此处调用确认关联接口')
                  wx.request({
                    url: 'https://51jka.com.cn/wxCourt/expressnumber',
                    data: {
                      courtid: wx.getStorageSync('courtid'),
                      staffid: wx.getStorageSync('staffid'),
                      casebarcode: that.data.codeNumOne,
                      expbarcode: that.data.codeNumTwo
                    },
                    method: 'GET',
                    success: function(res) {
                      if (res.data.retcode == 0) {
                        wx.hideLoading();
                        wx.showToast({
                          title: '关联成功！',
                          icon: 'success',
                          duration: 2000,
                        })
                        that.setData({
                          isFirst: true,
                          isSecond: false
                        })
                      } else {
                        //隐藏loading
                        wx.hideLoading();
                        wx.showToast({
                          title: '关联失败，请重试',
                          icon: 'none',
                          duration: 2000,
                          mask: true,
                        })
                      }
                    },
                    fail: function(res) {
                      //隐藏loading
                      wx.hideLoading();
                      wx.showToast({
                        title: '关联失败，请检查网络！',
                        icon: 'none',
                        duration: 2000,
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