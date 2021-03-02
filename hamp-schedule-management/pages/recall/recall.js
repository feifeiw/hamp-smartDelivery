// pages/recall/recall.js
const app = getApp();
let that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailItem: '',
    scheduleID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
		that.clearCache() //清本页缓存
    that.setData({
      OPEN_ID: app.globalData.OPEN_ID,
			wxlogin: app.wxlogin,
      detailItem: JSON.parse(options.item),
      scheduleID: options.scheduleID
		})
  },
  clearCache() {
    that.setData({
			detailItem: ''
		})
  },
  returnSubmit(e) {
		wx.showLoading({
		  title: '正在撤回...',
    })
		let staffid = wx.getStorageSync('staffid');
		let courtid = wx.getStorageSync('courtid');
		wx.request({
			url: 'https://51jka.com.cn/wxJudge/getApplyReschedule',
			data: {
				scheduleID: that.data.scheduleID,
				courtid: courtid,
				staffid: staffid,
				memo: e.detail.value.textarea
			},
			method: 'GET',
			success: function(res) {
				wx.hideLoading();
				if (res.data.result){
					wx.showToast({
						title: '撤回重排成功！',
						icon: 'success',
						mask: true
          })
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/search/search',
            })
          }, 1500);
				} else {
					wx.showToast({
						title: '失败，请重试！',
						icon: 'error',
						mask: true
					})
				}
			},
			fail: function(err){ 
				wx.hideLoading();
				wx.showToast({
					title: '撤销失败，请检查网络！',
					icon: 'error',
					mask: true
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