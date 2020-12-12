//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    choseDate: '2020-01-01',
    startdate: '', // 开始日期
		enddate: '', // 结束日期
    dataArr: []
  },
  //事件处理函数
  onLoad: function () {
    var that = this
    wx.showLoading({
			title: '查询中',
    })
    //获取当天日期
		var DATE = this.data.choseDate;
		that.setData({
			OPEN_ID: app.globalData.OPEN_ID,
			end: DATE,
			startdate: DATE,
			enddate: DATE,
			wxlogin: app.wxlogin
		})
		//查询当天
		var startdate = DATE + ' 00:00';
		var enddate = DATE + ' 23:59';
		var retcode = wx.getStorageSync('retcode');
		var staffid = wx.getStorageSync('staffid');
		var courtid = wx.getStorageSync('courtid');
    var retmessage = wx.getStorageSync('retmessage');
    console.log('code', that.data.wxlogin.retcode, retcode)
		if (that.data.wxlogin.retcode == 0 || retcode == 0) {
			wx.request({
				url: 'https://51jka.com.cn/wxJudge/getschedule',
				data: {
					courtid: courtid,
					staffid: staffid
				},
				method: 'GET',
				success: function(res) {
          wx.hideLoading();
          console.log(res)
					if (res.data.result == true) {
						that.setData({
							dataArr: res.data.data,
						})
					} else {
						//隐藏loading
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
					console.log(res)
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
			})
			wx.showModal({
				title: '未绑定微信，不允许登录',
				content: that.data.wxlogin.retmessage
			})
		}
  },
})
