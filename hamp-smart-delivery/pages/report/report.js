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
    allFail: [],
    pageNum: 1,
    updateLoadText: '上拉加载更多',
		uploadFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getInReportList()
  },
  tabClick: function(e) {
    var tabIndex = e.currentTarget.id
    that.setData({
      activeIndex: e.currentTarget.id,
			dataArr: [],
			updateLoadText: '上拉加载更多',
			uploadFlag: true,
			pageNum: 1
    });
    // 初始查询，二次调用缓存数据
    if (tabIndex == 0) {
      that.getInReportList()
    } else  if (tabIndex == 1){
      that.getSuccessReportList()
    } else if (tabIndex == 2){
      that.getFailReportList()
    }
  },
  // 查询送达中
  getInReportList: function () {
    wx.showLoading({
			title: '查询中',
    })
    wx.request({
			url: 'https://51jka.com.cn/wxCourt/getUnfinishedTask',
			data: {
				courtid: wx.getStorageSync('courtid'),
        staffid: wx.getStorageSync('staffid'),
        pageSize: 10,
				pageNum: that.data.pageNum
			},
			method: 'GET',
			success: function(res) {
				if (res.data.code == 0) {
          wx.hideLoading();
          if (res.data.rows) {
            const _data = that.data.dataArr.concat(res.data.rows)
            that.setData({
              dataArr: _data,
              updateLoadText: '上拉加载更多'
            })
          } else {
            that.setData({
              uploadFlag: false,
              updateLoadText: '没有更多数据了~'
            })
          }
				} else {
					//隐藏loading
          wx.hideLoading();
          wx.showToast({
						title: '查询失败',
						icon: 'none',
						duration: 2000,
						mask: true,
					})
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
          duration: 1000,
					mask: true,
				})
			}
		})
  },
  // 查询送达失败
  getFailReportList: function () {
    wx.showLoading({
			title: '查询中',
    })
    wx.request({
			url: 'https://51jka.com.cn/wxCourt/getFailedTask',
			data: {
				courtid: wx.getStorageSync('courtid'),
        staffid: wx.getStorageSync('staffid'),
        begindate: '',
        endate: '',
        pageSize: 10,
				pageNum: that.data.pageNum
			},
			method: 'GET',
			success: function(res) {
				if (res.data.code == 0) {
          wx.hideLoading();
          if (res.data.rows) {
            const _data = that.data.dataArr.concat(res.data.rows)
            that.setData({
              dataArr: _data,
              updateLoadText: '上拉加载更多'
            })
          } else {
            that.setData({
              uploadFlag: false,
              updateLoadText: '没有更多数据了~'
            })
          }
				} else {
					//隐藏loading
          wx.hideLoading();
          that.setData({
            uploadFlag: false,
            updateLoadText: '没有更多数据了~'
          })
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
        enddate: '',
        pageSize: 10,
				pageNum: that.data.pageNum
			},
			method: 'GET',
			success: function(res) {
				if (res.data.code == 0) {
          wx.hideLoading();
          if (res.data.rows) {
            const _data = that.data.dataArr.concat(res.data.rows)
            that.setData({
              dataArr: _data,
              updateLoadText: '上拉加载更多'
            })
          } else {
            that.setData({
              uploadFlag: false,
              updateLoadText: '没有更多数据了~'
            })
          }
				} else {
					//隐藏loading
          wx.hideLoading();
          that.setData({
            uploadFlag: false,
            updateLoadText: '没有更多数据了~'
          })
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