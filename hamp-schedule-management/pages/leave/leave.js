// pages/leave/leave.js
const app = getApp()
let that = this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    begindate: '',
    amflag1: '',
    enddate: '',
    amflag2: '',
    memo: '',
    arr: ['上午', '下午'],
    objectArray: [
      {
        id: 0,
        name: '上午'
      },{
        id: 1,
        name: '下午'
      }
    ]
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
  // 时间选择
  bindDateChange: function(e) {
    let _index = e.currentTarget.dataset.index
    if (_index == 1) {
      that.setData({
        begindate: e.detail.value
      })
    } else {
      that.setData({
        enddate: e.detail.value
      })
    }
  },
  // 上午、下午
  bindPickerChange: function(e) {
    let _index = e.currentTarget.dataset.index
    if (_index == 1) {
      that.setData({
        amflag1: e.detail.value
      })
    } else {
      that.setData({
        amflag2: e.detail.value
      })
    }
  },
  vacateSubmit(e) {
    that.setData({
      memo: e.detail.value.textarea
    })
    let begindate = that.data.begindate;
    let enddate = that.data.enddate;
    let amflag1 = that.data.amflag1;
    let amflag2 = that.data.amflag2;
    if (!e.detail.value.textarea) {
      wx.showToast({
				title: '请输入请假事由！',
				icon: 'none',
				mask: true,
      })
    } else if (!begindate || !enddate || !amflag1 || !amflag2) {
      wx.showToast({
				title: '请完整请假日期！',
				icon: 'none',
				mask: true,
      })
    } else {
      that.getJudgeVacate()
    }
  },
  // 提交请假
  getJudgeVacate() {
    wx.showLoading({
      title: '提交中...',
    })
		let staffid = wx.getStorageSync('staffid');
		let courtid = wx.getStorageSync('courtid');
		wx.request({
			url: 'https://51jka.com.cn/wxJudge/getCanVacateCancel',
			data: {
        courtid: courtid,
				staffid: staffid,
        begindate: that.data.begindate,
        enddate: that.data.enddate,
        amflag1: that.data.amflag1,
        amflag2: that.data.amflag2,
        memo: that.data.memo
			},
			method: 'GET',
			success: function(res) {
				wx.hideLoading()
        if(res.data.result) {
          wx.showToast({
            title: '提交成功！',
            icon: 'none',
            mask: true
          })
          that.setData({
            begindate: '',
            amflag1: '',
            enddate: '',
            amflag2: '',
            memo: '',
          })
        }
      },
      fail: function(err){ 
				wx.hideLoading();
				wx.showToast({
					title: '提交失败，请检查网络！',
					icon: 'none',
					mask: true
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