// pages/files/files.js
const app = getApp();
let that = this;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataArr: [], // 列表
		paddTop: '100',
		roldAuth: '',
		detailArr: [],
		yearArr: [2021, 2020, 2019],
		index: 0,
		caseValue: '',
		caseNO: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		that = this;
		that.clearCache() //清本页缓存
    this.setData({
      OPEN_ID: app.globalData.OPEN_ID,
      wxlogin: app.wxlogin,
    })
	},
	bindKeyInput(e) {
		this.setData({
      caseValue: e.detail.value
    })
	},
	// 时间选择
	bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
	},
  // 清除当前页缓存
  clearCache() {
	  that.setData({
			dataArr: [],
			detailArr: []
	  })
  },
	// 点击展开/收起详情
	getDetail(e) {
		let that = this;
		let index = e.currentTarget.dataset.index;
		let _caseno = e.currentTarget.dataset.caseno
		let _startStatus = that.data.dataArr[index].showIndex
		that.data.dataArr.map(item => {
			item.showIndex = false
			if (_startStatus && item.caseNO == _caseno) {
				item.showIndex = false
			} else if (!_startStatus && item.caseNO == _caseno) {
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
			that.getCasefile(_caseno)
		}
	},
	// 获取详情
	getCasefile(_caseno) {
		wx.showLoading()
		that.setData({
			detailArr: '',
		})
		wx.request({
			url: 'https://51jka.com.cn/wxCirculation/getCasefile2',
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
  // 查询卷宗列表
  getCaseList: function () {
    wx.showLoading({
			title: '查询中',
		})
		that.setData({
			dataArr: [],
		})
		let retcode = wx.getStorageSync('retcode');
		if (retcode == 0) {
			wx.request({
				url: 'https://51jka.com.cn/wxCirculation/getCasefile',
				data: {
					courtid: wx.getStorageSync('courtid'),
					staffid: wx.getStorageSync('staffid'),
					year0: that.data.yearArr[that.data.index],
					caseNO: that.data.caseValue
				},
				method: 'GET',
				success: function(res) {
					wx.hideLoading();
					if (res.data) {
						const _data = res.data
						_data.map(item => item.showIndex = false)
						that.setData({
							dataArr: _data
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
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0
			})
    }
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