// pages/search/search.js
const app = getApp();
let that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr: [ ],
		roldAuth: '',
		caseValue: '',
    caseNO: '',
    yearArr: [2021, 2020, 2019],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
  // 查询卷宗列表
  getCaseList: function () {
    if (!that.data.caseValue) {
      wx.showToast({
        title: '请输入案号！',
        icon: 'none',
      })
      return
    }
    wx.showLoading({
			title: '查询中',
		})
		that.setData({
			dataArr: [],
		})
		let retcode = wx.getStorageSync('retcode');
		if (retcode == 0) {
			wx.request({
				url: 'https://51jka.com.cn/wxJudge/queryCaseByCaseNO',
				data: {
					courtid: wx.getStorageSync('courtid'),
					year0: that.data.yearArr[that.data.index],
					caseNO: that.data.caseValue
				},
				method: 'GET',
				success: function(res) {
					if (res.data) {
            that.setData({
              dataArr: res.data
            })
          }
          wx.hideLoading();
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
          url: '/pages/register/register',
        })
      }, 1500);
		}
  },
  // 跳转排期信息
	linkTransBase(e) {
    console.log(e.currentTarget.dataset.item)
		let item =  e.currentTarget.dataset.item
		wx.navigateTo({
			url: '../fileTransfer/fileTransfer?item=' + JSON.stringify(item)
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