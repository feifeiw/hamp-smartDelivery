// pages/files/files.js
const app = getApp();
let until = require('../../utils/util')
let that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr: [], // 列表
		paddTop: '100',
		roldAuth: '',
		tranferInfo: [],
		fileNO: '',
		caseInfo: '',
		filecount: '',
		caseNO: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		that = this;
    that.setData({
      OPEN_ID: app.globalData.OPEN_ID,
			wxlogin: app.wxlogin,
			fileNO: options.fileNO,
			caseInfo: JSON.parse(options.caseInfo),
			filecount: options.filecount,
			caseNO: options.caseNO
		})
    that.getFileTransferInfo()
	},
  // 获取卷宗流转信息
  getFileTransferInfo: function () {
    wx.showLoading({
			title: '查询中',
		})
		let retcode = wx.getStorageSync('retcode');
		if (retcode == 0) {
			wx.request({
				url: 'https://51jka.com.cn/wxCirculation/getFileTransferInfo',
				data: {
					courtid: wx.getStorageSync('courtid'),
					fileNO: that.data.fileNO
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
					//隐藏loading
					wx.hideLoading();
					wx.showToast({
						title: '查询失败，请检查网络！',
						icon: 'none',
						mask: true,
						success: function(res) {},
						fail: function(res) {},
						complete: function(res) {},
					})
				}
			})
		} else {
			wx.navigateTo({
				url: '/pages/register/register',
				success: function(res) {},
				fail: function(res) {},
				complete: function(res) {},
			})
			wx.showModal({
				title: '请注册',
				content: that.data.wxlogin.retmessage
			})
		}
	},
	toCall(e) {
		let phone = e.currentTarget.dataset.phone
		wx.makePhoneCall({
      phoneNumber: phone
    })
	},
	// 跳转流转过程
	linkTransBaseInfo() {
		let caseNO = that.data.caseNO
		wx.navigateTo({
			url: '../fileTransferInfo/fileTransferInfo?caseNO=' + caseNO+'&filecount='+that.data.filecount
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