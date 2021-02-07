// pages/authorization/authorization.js
const app = getApp()
Page({
	data: {
		//判断小程序的API，回调，参数，组件等是否在当前版本可用。
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		isHide: true
	},

	onLoad: function() {
		var that = this;
		// 查看是否授权
		wx.getSetting({
				success: function(res) {
						if (res.authSetting['scope.userInfo']) {
								wx.getUserInfo({
										success: function(res) {
												// 用户已经授权过,不需要显示授权页面,所以不需要改变isHide 的值,直接跳转首页
												wx.login({
														success: res => {
																// 获取到用户的 code 之后：res.code
																console.log("用户的code:" + res.code);
														}
												});
												wx.switchTab({
													url: '/pages/signFor/signFor',
												})
										}
								});
						} else {
								// 用户没有授权
								that.setData({
									isHide: true,
									OPEN_ID: app.globalData.OPEN_ID,
									globalData : app.globalData,
									wxlogin : app.wxLogin
								});
						}
				}
		});
	},

	bindGetUserInfo: function(e) {
		const params = {
			encryptedData: e.detail.encryptedData,
			iv: e.detail.iv
		}
		wx.setStorageSync('openParams', JSON.stringify(params))
		console.log("用户的信息如下：", e);
		if (e.detail.userInfo) {
			//用户按了允许授权按钮
			var that = this;
			app.globalData.userInfo = e.detail.userInfo
			that.setData({
				isHide: false,
				userInfo: e.detail.userInfo,
			});
			// 调用接口获取openID
			wx.showLoading({
				title: '授权中',
				mask: true,
			})
			wx.login({
				success: resOne => {
					wx.request({
						url: 'https://51jka.com.cn/wxCirculation/getOpenid',
						data: {
							js_code: resOne.code,
							grant_type: 'authorization_code',
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
						},
						timeout: 30000,
						method: 'GET',
						success: function(res) {
							wx.hideLoading();
							// console.log('授权获取openID', res.data)
							if (!res.data.data) {
								wx.showToast({
									title: '接口返回信息错误，请重试',
									icon: 'none',
								})
								that.setData({
									isHide: true,
								})
								return
							}
							if (res.data.result) {
								let jsonObj = JSON.parse(res.data.data); //json字符串转json对象
								wx.setStorageSync('avatarUrl',jsonObj.avatarUrl)
								// 存储unionid
								if (jsonObj.unionId.length > 10) {
									wx.setStorageSync('appCourtid',jsonObj.unionId)
									let OPEN_ID = jsonObj.unionId; //获取到的unionId 
									app.globalData.OPEN_ID = OPEN_ID;
								}
							}
							wx.setStorageSync('courtid',res.data.wxlogin.courtid)
							wx.setStorageSync('staffid',res.data.wxlogin.staffid)
							wx.setStorageSync('retcode',res.data.wxlogin.retcode)
							wx.setStorageSync('retmessage',res.data.wxlogin.retmessage)
							// 获取权限标识
							wx.showLoading({
								title: '获取权限标识...',
							})
							wx.request({
								url: 'https://51jka.com.cn/wxCirculation/getAuth',
								data: {
									courtid: res.data.wxlogin.courtid,
									staffid: res.data.wxlogin.staffid
								},
								method: 'GET',
								success: function(data) {
									wx.hideLoading();
									if (!data.statusCode == 200) return
									wx.setStorageSync('userAuth', data.data.data)
									let _rolePath = ''
									if (data.data.data.role == 2) {
										_rolePath = '/pages/searchFiles/searchFiles'
									} else {
										_rolePath = '/pages/signFor/signFor'
									}
									wx.switchTab({
										url: _rolePath,
										success: function(e) {
											let page = getCurrentPages().pop();
											if (page == undefined || page == null) return;
											page.onLoad();
										}
									})
								},
								fail: function(err) {
									wx.hideLoading();
									wx.showToast({
										title: '获取权限标识失败，请重试！',
										icon: 'none',
										mask: true
									})
								}
							})
						},
						fail: function() {
							wx.hideLoading();
							wx.showModal({
								title: '失败',
								content: '连接服务器失败，请重试',
							})
						}
					})
				}
			})
		} else {
			//用户按了拒绝按钮
			wx.showModal({
				title: '警告',
				content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
				showCancel: false,
				confirmText: '返回授权',
				success: function(res) {
					// 用户没有授权成功，不需要改变 isHide 的值
					if (res.confirm) {
						console.log('用户点击了“返回授权”');
					}
				}
			});
		}
	}
})
