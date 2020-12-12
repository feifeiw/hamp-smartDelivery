// pages/report/report.js
const app = getApp();
var that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["送达中", "送达成功", "送达失败"],
    activeIndex: 0,
    dataArr: [], // 列表
    allIn: [],
    allSuccess: [],
    allFail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  tabClick: function(e) {
    var tabIndex = e.currentTarget.id
    that.setData({
      activeIndex: e.currentTarget.id,
      dataArr: [],
    });
    // 初始查询，二次调用缓存数据
    if (tabIndex == 0) {
      // 送达中
      if (that.data.allIn.length < 0) {
        thia.data.dataArr = that.data.allIn
        return
      }
      // that.getInReportList()
    } else  if (tabIndex == 1){
      // 送达成功
      if (that.data.allSuccess.length < 0) {
        thia.data.dataArr = that.data.allSuccess
        return
      }
      that.getSuccessReportList()
    } else if (tabIndex == 2){
      // 送达失败
      if (that.data.allFail.length < 0) {
        thia.data.dataArr = that.data.allFail
        return
      }
      // that.getFailReportList()
    }
  },
  // 查询送达中
  getInReportList: function () {
    // wx.showLoading({
		// 	title: '查询中',
    // })
  },
  // 查询送达失败
  getFailReportList: function () {
    // wx.showLoading({
		// 	title: '查询中',
    // })
  },
  // 查询送达成功列表
  getSuccessReportList: function () {
    wx.showLoading({
			title: '查询中',
		})
    wx.request({
			url: 'https://51jka.com.cn/wxCourt/getFinishedTaskBytime',
			data: {
				courtid: wx.getStorageSync('courtid'),
				staffid: wx.getStorageSync('staffid'),
				startdate: '',
				enddate: ''
			},
			method: 'GET',
			success: function(res) {
				console.log(res)
				if (res.data.result == true) {
					that.setData({
            dataArr: res.data.list,
            allSuccess: res.data.list
          })
          wx.hideLoading();
				} else {
					//隐藏loading
					wx.hideLoading();
					wx.showToast({
						title: '查询失败',
						icon: 'none',
						duration: 1000,
						mask: true,
					})
				}
			},
			fail: function(res) {
				//隐藏loading
				wx.hideLoading();
				wx.showToast({
					title: '查询失败，请检查网络！',
          icon: 'none',
          duration: 1000,
					mask: true,
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