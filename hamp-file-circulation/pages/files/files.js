// pages/files/files.js
const app = getApp();
let until = require('../../utils/util')
let that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["每日签收", "每日转出", "当前持有"],
    activeIndex: 0,
    dateStart: '', // 默认起始时间  
    dateEnd: '', // 默认结束时间 
    dataArr: [], // 列表
    signInData: [], // 每日签收
    rollOutData: [], // 每日转出
		holdData: [], // 当前持有
		updateLoadText: '上拉加载更多',
		uploadFlag: true,
		pageNum: 1,
		paddTop: '100'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		that = this;
		that.clearCache() //清本页缓存
    let time = until.formatTime(new Date())
    this.setData({
      OPEN_ID: app.globalData.OPEN_ID,
      wxlogin: app.wxlogin,
      dateStart: time,
      dateEnd: time
    })
    that.getSingInList()
  },
  bindSearch() {
		let nowIndex = that.data.activeIndex
		that.setData({
			dataArr: [],
			updateLoadText: '上拉加载更多',
			uploadFlag: true,
			pageNum: 1
    });
    if (nowIndex == 0) {
      this.getSingInList()
    } else if (nowIndex == 1) {
      this.getRollOutList()
    } else if (nowIndex == 2) {
      this.getHoldList()
    }
  },
  // 清除当前页缓存
  clearCache() {
	  that.setData({
			dateStart: until.formatTime(new Date()),
			dateEnd: until.formatTime(new Date()),
			activeIndex: 0,
			dataArr: [],
			updateLoadText: '上拉加载更多',
			uploadFlag: true,
			pageNum: 1
	  })
  },
  // 时间段选择  
  bindDateStartChange(e) {
    that.setData({
      dateStart: e.detail.value,
    })
  },
  bindDateEndChange(e) {
    let that = this;
    that.setData({
      dateEnd: e.detail.value,
    })
  },
  // 切换tab
  tabClick: function (e) {
    let tabIndex = e.currentTarget.id
    that.setData({
      activeIndex: e.currentTarget.id,
			dataArr: [],
			updateLoadText: '上拉加载更多',
			uploadFlag: true,
			pageNum: 1
    });
    if (tabIndex == 0) {
      that.getSingInList()
    } else if (tabIndex == 1) {
      that.getRollOutList()
    } else if (tabIndex == 2) {
      that.getHoldList()
    }
  },
  // 获取每日签收
  getSingInList: function () {
    wx.showLoading({
			title: '查询中',
		})
		let retcode = wx.getStorageSync('retcode');
		if (retcode == 0) {
			wx.request({
				url: 'https://51jka.com.cn/wxCirculation/getsign',
				data: {
					courtid: wx.getStorageSync('courtid'),
					staffid: wx.getStorageSync('staffid'),
					begindate: that.data.dateStart + ' 00:00',
					enddate: that.data.dateEnd + ' 23:59',
					transflag: 0,
					pageSize: 10,
					pageNum: that.data.pageNum
				},
				method: 'GET',
				success: function(res) {
					if (res.data.rows) {
						const _data = that.data.dataArr.concat(res.data.rows)
						that.setData({
							dataArr: _data,
							updateLoadText: '上拉加载更多'
						})
						wx.hideLoading();
					} else {
						that.setData({
							uploadFlag: false,
              updateLoadText: '没有更多数据了~'
						})
						wx.hideLoading();
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
  // 获取每日转出
  getRollOutList: function () {
		console.log('下一页', that.data.pageNum)
    wx.showLoading({
			title: '查询中',
		})
		let retcode = wx.getStorageSync('retcode');
		if (retcode == 0) {
			wx.request({
        url: 'https://51jka.com.cn/wxCirculation/getsign',
				data: {
					courtid: wx.getStorageSync('courtid'),
					staffid: wx.getStorageSync('staffid'),
					begindate: that.data.dateStart + ' 00:00',
					enddate: that.data.dateEnd + ' 23:59',
					transflag: 1,
					pageSize: 10,
					pageNum: that.data.pageNum
				},
				method: 'GET',
				success: function(res) {
					if (res.data.rows) {
						const _data = that.data.dataArr.concat(res.data.rows)
						that.setData({
							dataArr: _data,
							updateLoadText: '上拉加载更多'
						})
						wx.hideLoading();
					} else {
						that.setData({
							uploadFlag: false,
              updateLoadText: '没有更多数据了~'
						})
						wx.hideLoading();
					}
				},
				fail: function(res) {
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
		if (!that.data.uploadFlag) return
		const num = that.data.pageNum + 1
		that.setData({
			updateLoadText: '正在加载....',
			pageNum: num
		})
		if (that.data.activeIndex == 0) {
			that.getSingInList()
		} else if (that.data.activeIndex == 1) {
			console.log('加载', that.data.activeIndex)
			that.getRollOutList()
		} else if (that.data.activeIndex == 2) {
			that.getHoldList()
		}
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})