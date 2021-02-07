// pages/files/files.js
const app = getApp();
let until = require('../../utils/util')
let that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
		staffname: '',
		dataArr: [],
		updateLoadText: '上拉加载更多',
		uploadFlag: true,
		pageNum: 1,
		paddTop: '100',
		filecount: ''
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
			staffname: options.staffname,
			filecount: options.filecount
    })
    that.getHoldList()
	},

  // 清除当前页缓存
  clearCache() {
		that.setData({
			dataArr: [],
			updateLoadText: '上拉加载更多',
			uploadFlag: true,
			pageNum: 1
	  })
	},
	ShowDetail(e) {
		let that = this;
		let index = e.currentTarget.dataset.index;
		let _caseno = e.currentTarget.dataset.caseno
		let _startStatus = that.data.dataArr[index].showIndex
		that.data.dataArr.map(item => {
			item.showIndex = false
			if (_startStatus && item.caseno == _caseno) {
				item.showIndex = false
			} else if (!_startStatus && item.caseno == _caseno) {
				item.showIndex = !item.showIndex
			}
		})
		that.setData({
			dataArr: that.data.dataArr
		})
		if (!_startStatus) {
			this.setData({
				caseNO: _caseno
			})
			that.getHoledDetail(_caseno)
		}
	},
	// 获取持有详情
	getHoledDetail(_caseno) {
		wx.showLoading()
		wx.request({
			url: 'https://51jka.com.cn/wxCirculation/gethold2',
			data: {
				courtid: wx.getStorageSync('courtid'),
				staffid: wx.getStorageSync('staffid'),
				caseNO: _caseno
			},
			method: 'GET',
			success: function(res) {
				wx.hideLoading();
				if (res.data) {
					that.setData({
						detailArr: res.data,
					})
				}
			},
			fail: function(res) {
				wx.hideLoading();
				wx.showToast({
					title: '查询卷宗详情失败，请重试！',
					icon: 'none',
					mask: true
				})
			}
		})
	},
	// 获取当前持有
  getHoldList: function () {
		wx.showLoading({
			title: '查询中',
		})
    let retcode = wx.getStorageSync('retcode');
		if (retcode == 0) {
			wx.request({
        url: 'https://51jka.com.cn/wxCirculation/gethold',
				data: {
					courtid: wx.getStorageSync('courtid'),
					staffid: wx.getStorageSync('staffid'),
					pageSize: 10,
					pageNum: that.data.pageNum
				},
				method: 'GET',
				success: function(res) {
					if (res.data.rows) {
						wx.hideLoading();
						const _data = that.data.dataArr.concat(res.data.rows)
						_data.map(item => item.showIndex = false)
						that.setData({
							dataArr: _data,
							updateLoadText: '上拉加载更多'
						})
					} else {
						//隐藏loading
						wx.hideLoading();
						that.setData({
							uploadFlag: false,
              updateLoadText: '没有更多数据了~'
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
	// 跳转流转过程
	linkCirculation(e) {
		let fileNO = e.currentTarget.dataset.fileno
		let _detail = JSON.stringify(e.currentTarget.dataset.case)
		let filecount = e.currentTarget.dataset.count
		wx.navigateTo({
			url: '../fileTransfer/fileTransfer?fileNO=' + fileNO+'&filecount='+filecount+'&caseInfo='+_detail+'&caseNO='+that.data.caseNO
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