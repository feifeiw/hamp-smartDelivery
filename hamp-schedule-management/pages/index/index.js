//index.js
//获取应用实例
const app = getApp()
let until = require('../../utils/util')
let that = this
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
		OPEN_ID: '',
		isVacateflag: false // 是否显示请假
  },
  //事件处理函数
  onLoad: function (option) {
		that = this
		if (app.globalData.OPEN_ID && app.globalData.OPEN_ID != '') {
			that.setData({
				OPEN_ID: app.globalData.OPEN_ID
			})
		} else {
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
		console.log(that.data.choseDate)
		let DATE = that.data.choseDate;
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
					startdate: DATE ? DATE + ' 00:00' : 'null',
					enddate: DATE ? DATE + ' 23:59' : 'null',
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
						wx.showToast({
							title: '查询失败',
							icon: 'none',
							duration: 0,
							mask: true
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
			wx.showModal({
				title: '请注册',
				content: retmessage
			})
			setTimeout(() => {
				wx.navigateTo({
					url: '/pages/register/register',
				})
			}, 1500);
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
		that.setData({
			heightAuto: !_flag
		})
	},
	onDayClick(event){
		console.log('触发改变日期', event.detail)
		that.setData({
			choseDate: event.detail
		})
		that.screenShow(that.data.showArr)
	},
	screenShow (data) {
		that.isShowRevokeBtn()
    const screenData = data.filter(item => {
			if (item.courttime.substring(0, 10) == that.data.choseDate) {
				return item
			}
		})
		that.setData({
			dataArr: screenData
		})
	},
	// 判断当日日程是否有请假，有请假则显示撤回请假按钮
	isShowRevokeBtn() {
		wx.showLoading({
		  title: '查询中...',
    })
		let staffid = wx.getStorageSync('staffid');
		let courtid = wx.getStorageSync('courtid');
		wx.request({
			url: 'https://51jka.com.cn/wxJudge/getCanVacateCancel',
			data: {
				begindate: that.data.choseDate,
				courtid: courtid,
				staffid: staffid
			},
			method: 'GET',
			success: function(res) {
				wx.hideLoading()
				if(res.data) {
					if (res.data.data.vacateflag == 1) {
						that.setData({
							isVacateflag: true
						})
					}
				} else {
					wx.showToast({
						title: '查询当日请假日程失败！',
						icon: 'none',
						mask: true
					})
				}
			},
			fail: function(err){ 
				wx.hideLoading();
				wx.showToast({
					title: '查询失败，请检查网络！',
					icon: 'none',
					mask: true
				})
			}
		})
	},
	// 撤销请假
	revokeLeave(){
		wx.showModal({
			title: '撤销请假',
			content: '确定撤销当前日期请假信息？',
			success: function(res) {
				if (res.confirm) {
					wx.showLoading({
						title: '正在撤销...',
					})
					let staffid = wx.getStorageSync('staffid');
					let courtid = wx.getStorageSync('courtid');
					wx.request({
						url: 'https://51jka.com.cn/wxJudge/getJudgeVacateCancel',
						data: {
							begindate: that.data.choseDate,
							courtid: courtid,
							staffid: staffid,
							memo: ''
						},
						method: 'GET',
						success: function(res) {
							wx.hideLoading();
							if(res.data.result) {
								wx.showToast({
									title: '撤销请假成功！',
									icon: 'success',
									mask: true
								})
							} else {
								wx.showToast({
									title: '撤销失败，请重试！',
									icon: 'error',
									mask: true
								})
							}
						},
						fail: function(err){ 
							wx.hideLoading();
							wx.showToast({
								title: '撤销失败，请检查网络！',
								icon: 'error',
								mask: true
							})
						}
					})
				}
			}
		})
	},
	onReady: function () {
		that.myComponent = that.selectComponent('#calendar'); // 页面获取自定义组件实例
		that.myComponent.stratLoad()
	}
})
