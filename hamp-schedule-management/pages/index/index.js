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
		showArr: [],
		OPEN_ID: ''
  },
  //事件处理函数
  onLoad: function (option) {
		let that = this
		//判断是否获取到动态设置的globalData
		console.log('首页', app.globalData)
		if (app.globalData.OPEN_ID && app.globalData.OPEN_ID != '') {
			that.setData({
				OPEN_ID: app.globalData.OPEN_ID
			})
			console.log('首页已获取到', that.data)
		} else {
			// 声明回调函数获取app.js onLaunch中接口调用成功后设置的globalData数据
			console.log('调用app.js定义callback')
			app.userInfoLoadCallback = userInfo => {
				if (userInfo != '') {
					that.setData({
						OPEN_ID: app.globalData.OPEN_ID
					})
				}
			}
		}
    wx.showLoading({
		  title: '查询中',
    })
		//获取当天日期
		let today = until.formatTime(new Date());
		let DATE = that.data.choseDate;
		let startdate = DATE + ' 00:00';
		let enddate = DATE + ' 23:59';
		let retcode = wx.getStorageSync('retcode');
		let staffid = wx.getStorageSync('staffid');
		let courtid = wx.getStorageSync('courtid');
		let retmessage = wx.getStorageSync('retmessage');
		that.setData({
			end: DATE,
			startdate: DATE,
			enddate: DATE,
			choseDate: today,
			Today: today,
		})
		
		if (retcode == 0) {
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
							success: function() {
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
			console.log('请注册')
			wx.navigateTo({
				url: '/pages/register/register',
			})
			wx.showModal({
				title: '请注册',
				content: retmessage
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
