// pages/files/files.js
const app = getApp();
let until = require('../../utils/util')
let that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
		holdOrgData: [],
		orgCaseAll: 0,
		orgFileAll: 0,
		orgName: '',
		orgID: ''
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
			orgID: options.orgID,
			orgName: options.orgName
    })
    that.getFileHoldOrg()
	},

  // 清除当前页缓存
  clearCache() {
	  that.setData({
			holdOrgData: [],
	  })
  },

  // 查询持有统计
  getFileHoldOrg: function () {
    wx.showLoading({
			title: '查询中',
		})
		let retcode = wx.getStorageSync('retcode');
		if (retcode == 0) {
			wx.request({
				url: 'https://51jka.com.cn/wxCirculation/reportFileHoldbystaff',
				data: {
					courtid: wx.getStorageSync('courtid'),
					orgID: that.data.orgID
				},
				method: 'GET',
				success: function(res) {
					wx.hideLoading();
					if (res.data) {
						let _casenum = 0
						let _filenum = 0
						res.data.forEach(element => {
							_casenum += Number(element.casecount)
							_filenum += Number(element.filecount)
						});
						that.setData({
							holdOrgData: res.data,
							orgCaseAll: _casenum,
							orgFileAll: _filenum
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
	// 跳转流转过程
	linkOrgDetail(e) {
		let item = JSON.stringify(e.currentTarget.dataset.item)
		wx.navigateTo({
			url: '../fileHoldManDetail/fileHoldManDetail?detailItem=' + item
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