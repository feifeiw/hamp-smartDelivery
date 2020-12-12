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
    dateStart: '',//默认起始时间  
    dateEnd: '',//默认结束时间 
    dataArr: [], // 列表
    signInData: [], // 每日签收
    rollOutData: [], // 每日转出
    holdData: [] // 当前持有
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    if (nowIndex == 0) {
      this.getSingInList()
    } else if (nowIndex == 1) {
      this.getRollOutList()
    } else if (nowIndex == 2) {
      this.getHoldList()
    }
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
    });
    if (tabIndex == 0) {
      if (that.data.signInData.length > 0) {
        that.setData({
          dataArr: that.data.signInData
        })
        return
      }
      this.getSingInList()
    } else if (tabIndex == 1) {
      if (that.data.rollOutData.length > 0) {
        that.setData({
          dataArr: that.data.rollOutData
        })
        return
      }
      this.getRollOutList()
    } else if (tabIndex == 2) {
      if (that.data.holdData.length > 0) {
        that.setData({
          dataArr: that.data.holdData
        })
        return
      }
      this.getHoldList()
    }
  },
  // 获取每日签收
  getSingInList: function () {
    wx.showLoading({
			title: '查询中',
		})
		var retcode = wx.getStorageSync('retcode');
		if (that.data.wxlogin.retcode == 0 || retcode == 0) {
			wx.request({
				url: 'https://51jka.com.cn/wxCirculation/getsign',
				data: {
					courtid: wx.getStorageSync('courtid'),
					staffid: wx.getStorageSync('staffid'),
					begindate: that.data.dateStart + ' 00:00',
					enddate: that.data.dateEnd + ' 23:59',
					transflag: 0
				},
				method: 'GET',
				success: function(res) {
					if (res.data.result == true) {
						wx.hideLoading();
						that.setData({
              dataArr: res.data.data,
              signInData: res.data.data
						})
					} else {
						//隐藏loading
						wx.hideLoading();
						wx.showToast({
							title: '查询失败',
							icon: 'none',
							duration: 0,
							mask: true,
							success: function(res) {
							}
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
				url: '../register/register',
				success: function(res) {},
				fail: function(res) {},
				complete: function(res) {},
			})
			wx.showModal({
				title: '未绑定微信，不允许登录',
				content: that.data.wxlogin.retmessage
			})
		}
  },
  // 获取每日转出
  getRollOutList: function () {
    wx.showLoading({
			title: '查询中',
		})
		var retcode = wx.getStorageSync('retcode');
		if (that.data.wxlogin.retcode == 0 || retcode == 0) {
			wx.request({
        url: 'https://51jka.com.cn/wxCirculation/getsign',
				data: {
					courtid: wx.getStorageSync('courtid'),
					staffid: wx.getStorageSync('staffid'),
					begindate: that.data.dateStart + ' 00:00',
					enddate: that.data.dateEnd + ' 23:59',
					transflag: 0
				},
				method: 'GET',
				success: function(res) {
					if (res.data.result == true) {
						wx.hideLoading();
						that.setData({
              dataArr: res.data.data,
              rollOutData: res.data.data
						})
					} else {
						//隐藏loading
						wx.hideLoading();
						wx.showToast({
							title: '查询失败',
							icon: 'none',
							duration: 0,
							mask: true,
							success: function(res) {
							}
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
				url: '../register/register',
				success: function(res) {},
				fail: function(res) {},
				complete: function(res) {},
			})
			wx.showModal({
				title: '未绑定微信，不允许登录',
				content: that.data.wxlogin.retmessage
			})
		}
  },
  // 获取当前持有
  getHoldList: function () {
		wx.showLoading({
			title: '查询中',
		})
    var retcode = wx.getStorageSync('retcode');
		if (that.data.wxlogin.retcode == 0 || retcode == 0) {
			wx.request({
        url: 'https://51jka.com.cn/wxCirculation/gethold',
				data: {
					courtid: wx.getStorageSync('courtid'),
					staffid: wx.getStorageSync('staffid'),
				},
				method: 'GET',
				success: function(res) {
					if (res.data.result) {
						wx.hideLoading();
						that.setData({
              dataArr: res.data.data,
              holdData: res.data.data
						})
					} else {
						//隐藏loading
						wx.hideLoading();
						wx.showToast({
							title: '查询失败',
							icon: 'none',
							duration: 0,
							mask: true,
							success: function(res) {
							}
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
				url: '../register/register',
				success: function(res) {},
				fail: function(res) {},
				complete: function(res) {},
			})
			wx.showModal({
				title: '未绑定微信，不允许登录',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})