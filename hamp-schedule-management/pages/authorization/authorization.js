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
												// 用户已经授权过,不需要显示授权页面,所以不需要改变isHide 的值
												// 根据自己的需求有其他操作再补充
												wx.login({
														success: res => {
																// 获取到用户的 code 之后：res.code
																console.log("用户的code:" + res.code);
														}
												});
										}
								});
						} else {
								// 用户没有授权
								// 改变 isHide 的值，显示授权页面
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
		if (e.detail.userInfo) {
			//用户按了允许授权按钮
			var that = this;
			app.globalData.userInfo = e.detail.userInfo
			// 获取到用户的信息了，打印到控制台上看下
			console.log("用户的信息如下：");
			console.log(e.detail.userInfo);
			//授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
			that.setData({
				isHide: false,
				userInfo: e.detail.userInfo,
				hasUserInfo: true
			});
			// wx.login({
			// 	success: res1 => {
			// 		wx.getSetting({
			// 			success: res2 => {
			// 				if (res2.authSetting['scope.userInfo']) {
			// 					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
			// 					wx.getUserInfo({
			// 						success: loginres => {
			// 							console.log("loginres", loginres)
			// 							// that.setData({
			// 							// 	globalData : app.globalData,
			// 							// })
			// 							that.data.globalData.userInfo = loginres.userInfo
			// 							if (that.userInfoLoadCallback){
			// 								that.userInfoLoadCallback(loginres.userInfo)
			// 						 }
			// 							wx.showLoading({
			// 								title: '加载中',
			// 								mask: true,
			// 								success: function(res1) {},
			// 								fail: function(res1) {},
			// 								complete: function(res1) {},
			// 							})
			// 							wx.request({
			// 								url: 'https://51jka.com.cn/wxJudge/getOpenid',
			// 								data: {
			// 									js_code: res1.code,
			// 									grant_type: 'authorization_code',
			// 									encryptedData: loginres.encryptedData,
			// 									iv: loginres.iv
			// 								},
			// 								timeout: 30000,
			// 								method: 'GET',
			// 								success: function(res) {
			// 									if (res.data.result) {
			// 										let jsonObj = res.data.data; //json字符串
			// 										let jsonObj2 = JSON.parse(jsonObj); //json字符串转json对象
			// 										if (jsonObj2.unionId.length > 10) {
			// 											wx.hideLoading();
			// 											//(原先使用的是openid，后来关联多个小程序时，多个小程序中的openid不相同.所以使用的是unionid) 
			// 											let OPEN_ID = jsonObj2.unionId; //获取到的unionId 
			// 											that.data.globalData.OPEN_ID = OPEN_ID;
			// 										} else {
			// 											that.onLaunch();
			// 										}
			// 										console.log(res.data.wxlogin.retcode)
			// 										if (res.data.wxlogin.retcode != 0) {
			// 											that.data.wxlogin.courtid = null;
			// 											that.data.wxlogin.staffid = null;
			// 											that.data.wxlogin.retcode = null;
			// 											that.data.wxlogin.retmessage = '';
			// 											wx.navigateTo({
			// 												url: '/pages/register/register',
			// 												success: function(res) {},
			// 												fail: function(res) {},
			// 												complete: function(res) {},
			// 											})
			// 											wx.showModal({
			// 												title: '请注册',
			// 												content: res.data.wxlogin.retmessage
			// 											})
			// 										} else {
			// 											that.data.wxlogin.courtid = res.data.wxlogin.courtid;
			// 											that.data.wxlogin.staffid = res.data.wxlogin.staffid;
			// 											that.data.wxlogin.retcode = res.data.wxlogin.retcode;
			// 											that.data.wxlogin.retmessage = res.data.wxlogin.retmessage;
			// 										}
			// 									} else {
			// 									}
			// 								},
			// 								fail: function() {
			// 									wx.showModal({
			// 										title: '失败',
			// 										content: '连接服务器失败',
			// 									})
			// 								}
			// 							})
			// 						}
			// 					})
			// 				} else {
			// 					wx.navigateTo({
			// 						url: '/pages/authorization/authorization',
			// 					})
			// 					wx.showModal({
			// 						title: '未授权，请先授权',
			// 						content: "未授权，请先授权"
			// 					})
			// 				}
			// 			}
			// 		})
			// 	}
			// });
			// wx.navigateTo({
			// 	url: '/pages/index/index?pageForm='
			// })
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
