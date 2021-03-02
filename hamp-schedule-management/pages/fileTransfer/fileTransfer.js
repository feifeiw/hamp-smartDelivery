// pages/files/files.js
const app = getApp();
let until = require('../../utils/util')
let that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tranferInfo: [],
		caseInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		that = this;
    that.setData({
      OPEN_ID: app.globalData.OPEN_ID,
			wxlogin: app.wxlogin,
			caseInfo: JSON.parse(options.item),
		})
    that.getFileTransferInfo()
	},
  // 根据案件ID获取排期
  getFileTransferInfo: function () {
    wx.showLoading({
			title: '查询中',
		})
		let retcode = wx.getStorageSync('retcode');
		if (retcode == 0) {
			wx.request({
				url: 'https://51jka.com.cn/wxJudge/getCaseScheduleInfo',
				data: {
					courtid: wx.getStorageSync('courtid'),
					caseID: that.data.caseInfo.caseID
				},
				method: 'GET',
				success: function(res) {
					wx.hideLoading();
					if (res.data) {
						that.setData({
							tranferInfo: res.data,
						})
					}
				},
				fail: function(res) {
					wx.hideLoading();
					wx.showToast({
						title: '查询失败，请检查网络！',
						icon: 'none',
						mask: true
					})
				}
			})
		} else {
			wx.showModal({
				title: '请注册',
				content: that.data.wxlogin.retmessage
			})
			setTimeout(() => {
				wx.navigateTo({
					url: '/pages/register/register'
				})
			}, 1500);
		}
	},
	toCall(e) {
		let phone = e.currentTarget.dataset.phone
		wx.makePhoneCall({
      phoneNumber: phone
    })
	},
	// 案件重排
	getReschedule(e) {
		let scheduleID = that.data.tranferInfo[0].scheduleID
		let item = JSON.stringify(that.data.caseInfo)
		wx.navigateTo({
			url: '../recall/recall?item=' + item + '&scheduleID=' +scheduleID
		})
	},
	// 跳转流转过程
	linkTransBaseInfo() {
		let caseNO = that.data.caseInfo.caseNO
		wx.navigateTo({
			url: '../fileTransferInfo/fileTransferInfo?caseNO=' + caseNO
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