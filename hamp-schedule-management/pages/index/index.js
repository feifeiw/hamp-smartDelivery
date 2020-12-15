//index.js
//获取应用实例
const app = getApp()
let until = require('../../utils/util')
Page({
  data: {
    choseDate: '',
    startDate: '', // 开始日期
		endDate: '', // 结束日期
		dataArr: [],
		curDate:'',
		Today: '',
		signeddates: [],
		heightAuto: false,
		showArr: []
  },
  //事件处理函数
  onLoad: function () {
	let that = this
	let today = until.formatTime(new Date());
	that.setData({
		choseDate: today,
		Today: today,
		markDays: [today]
	})
    wx.showLoading({
		title: '查询中',
    })
    //获取当天日期
	var DATE = that.data.choseDate;
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
		if (that.data.wxlogin.retcode == 0 || retcode == 0) {
			wx.request({
				url: 'https://51jka.com.cn/wxJudge/getschedule',
				data: {
					startdate: startdate,
					enddate: enddate,
					courtid: courtid,
					staffid: staffid
				},
				method: 'GET',
				success: function(res) {
          wx.hideLoading();
					if (res.data.result == true) {
						const data = res.data.data
						const arr = data.map(item => item.courttime.substring(0, 10))
						const sortArr = that.statisticalFieldNumber(arr)
						that.setData({
							showArr: res.data.data,
							signeddates: sortArr
						})
						that.screenShow(res.data.data)
						that.myComponent = that.selectComponent('#calendar'); // 页面获取自定义组件实例
						that.myComponent.stratLoad()
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
				url: '../user/user',
			})
			wx.showModal({
				title: '未绑定微信，不允许登录',
				content: that.data.wxlogin.retmessage
			})
		}
	},
	statisticalFieldNumber(arr) {
			return arr.reduce(function (prev, next) {
					prev[next] = (prev[next] + 1) || 1;
					return prev;
			}, {})
	},
	arrowClick (e) {
		let _flag = e.currentTarget.dataset.flag
		this.setData({
			heightAuto: !_flag
		})
	},
	onDayClick(event){
		let that = this
		console.log('触发改变日期', event.detail)
		this.setData({
			choseDate: event.detail
		})
		this.screenShow(this.data.showArr)
	},
	screenShow (data) {
		// console.log(this.data.choseDate)
    const screenData = data.filter(item => {
			if (item.courttime.substring(0, 10) == this.data.choseDate) {
				return item
			}
		})
		this.setData({
			dataArr: screenData
		})
	},
	onReady: function () {
		this.myComponent = this.selectComponent('#calendar'); // 页面获取自定义组件实例
		this.myComponent.stratLoad()
	}
})
