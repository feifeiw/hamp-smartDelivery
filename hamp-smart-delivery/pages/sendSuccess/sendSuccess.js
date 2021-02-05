// pages/sendSuccess/sendSuccess.js
const app = getApp();
let that = this;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    imgIndex: 0,
    facialIndex: 0,
    photoArr: [],
		facialphotoArr: [],
		memo: '',
		imageFile: [],
		values: [],
		imgSize: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
		//案件id
		let retcode = wx.getStorageSync('retcode');
		let staffid = wx.getStorageSync('staffid');
		let courtid = wx.getStorageSync('courtid');
		let retmessage = wx.getStorageSync('retmessage');
		let msgData = wx.getStorageSync('sendCaseInfo');
		that.setData({
			OPEN_ID: app.globalData.OPEN_ID,
			msgData: msgData,
			wxlogin: app.wxlogin,
			retcode: retcode,
			staffid: staffid,
			courtid: courtid,
			retmessage: retmessage
		})
		that.getSignReason()
	},
	getSignReason: function (e) {
		wx.showLoading({
			title: '查询中',
		})
		let sessionId = wx.getStorageSync('sessionId');
		wx.request({
			url: 'https://51jka.com.cn/wxCourt/getSign4directType',
			data: {          
				courtid: wx.getStorageSync('courtid'),
				loseflag: 0
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Cookie": sessionId
			},
			method: 'GET',
			success: function(res) {
				wx.hideLoading();
				if (res.data.result == true) {
					let resdata = Array.from(res.data.list)
					resdata.map(item => {
						item.checked = false
					})
					that.setData({
						items: resdata
					})
				}
			},
			fail: function(res) {
				wx.hideLoading();
				wx.showToast({
					title: '查询失败',
					icon: 'none',
					mask: true
				})
			}
		})
	},
  // 签收原因点击事件
  radioChange: function (e) {
    const items = this.data.items
    const values = e.detail.value
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = false
      if (items[i].typeID === e.detail.value) {
        items[i].checked = true
      }
    }
    this.setData({
      items,
      values: values
    })
  },
  // 图片预览
	previewImage: function(e) {
		var current = e.currentTarget.dataset.src;
		var arr = this.data.photoArr;
		// console.log(arr[0])
		wx.previewImage({
			current: current,
			urls: arr,
			success(res) {
				// console.log(res)
			},
			fail(res) {
				// console.log(res)
			}
		})
	},
	// 电子面单图片预览
	facialPreviewImage: function(e) {
		var current = e.currentTarget.dataset.src;
		var arr = this.data.facialphotoArr;
		wx.previewImage({
			current: current,
			urls: arr,
			success(res) {
				// console.log(res)
			},
			fail(res) {
				// console.log(res)
			}
		})
		// 测试、获取图片信息
		wx.getImageInfo({
			src: arr[0],
			success: function (res) {
				const imgSize = Math.round(that.data.imgSize/1024*100)/100
				const msg = '宽'+res.width+'，高'+res.height+'，大小'+that.data.imgSize+'='+imgSize+'kb'
				wx.showModal({
					title: '图片大小',
					content: msg,
					showCancel: false,
					confirmText: "确定",
					success(res) {
					}
				})
			}
		})
	},
	// 拍照
	photograph(e) {
		var that = this;
		var indexImg = that.data.photoArr.length;
		if (indexImg < 5) {
			wx.chooseImage({
				count: 5, // 默认9
				sizeType: ['original'],
				sourceType: ['album', 'camera'],
				success: function(res) {
					var tempFilePaths = res.tempFilePaths;
					var photoArr = that.data.photoArr;
					tempFilePaths.forEach(function(i) {
						photoArr.push(i)
					})
					// console.log(photoArr);
					that.setData({
						photoArr: photoArr
					})
					var imgIndex = that.data.photoArr.length;
					that.setData({
						imgIndex: imgIndex
					})
					// console.log(that.data.photoArr)
				}
			})
		} else {
			wx.showToast({
				title: '最多上传5张',
				image: '../../static/image/icon_Incomplete.png',
				icon: 'none'
			})
		}
	},
	// 电子面单拍照
	facialphotograph(e) {
		var that = this;
		var facialIndex = that.data.facialphotoArr.length;
		if (facialIndex < 1) {
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original'],
				sourceType: ['album', 'camera'],
				success: function(res) {
					var tempFilePaths = res.tempFilePaths;
					// console.log('图片的本地临时文件列表', res.tempFiles[0].size)
					var facialphotoArr = that.data.facialphotoArr;
					tempFilePaths.forEach(function(i) {
						facialphotoArr.push(i)
					})
					// console.log(facialphotoArr);
					that.setData({
						facialphotoArr: facialphotoArr,
						imgSize:  res.tempFiles[0].size
					})
					var facialIndex = that.data.facialphotoArr.length;
					that.setData({
						facialIndex: facialIndex
					})
					// console.log(that.data.facialphotoArr)
				}
			})
		}
	},
	//删除图片
	deleteImg(e) {
		var that = this;
		var index = e.currentTarget.dataset.index;
		// console.log(that.data.photoArr)
		var photoArr = that.data.photoArr;
		photoArr.splice(index, 1);
		var imgIndex = photoArr.length;
		// console.log(photoArr)
		that.setData({
			photoArr: photoArr,
			imgIndex: imgIndex
		})
	},
	//电子面单删除图片
	facialDeleteImg(e) {
		var that = this;
		var index = e.currentTarget.dataset.index;
		// console.log(that.data.facialphotoArr)
		var facialphotoArr = that.data.facialphotoArr;
		facialphotoArr.splice(index, 1);
		var facialIndex = facialphotoArr.length;
		// console.log(facialphotoArr)
		that.setData({
			facialphotoArr: facialphotoArr,
			facialIndex: facialIndex
		})
  },
  // 提交
  formSendSubmit: function (e) {
		let that = this;
		that.setData({
			memo: e.detail.value.textarea
		})
		let reasonArr = that.data.values;
		let facialIndex = that.data.facialphotoArr.length; //电子面单张数
		let indexImg = that.data.photoArr.length; //回执照片张数
		if (reasonArr.length < 1) {
			wx.showToast({
				title: '请选择签收原因',
				icon: 'none',
				mask: true,
			})
		} else if (facialIndex < 1) {
			wx.showToast({
				title: '请上传面单图片',
				icon: 'none',
				mask: true,
			})
		} else if (indexImg < 3) {
			wx.showToast({
				title: '最少选择3张回执图片',
				icon: 'none',
				mask: true,
			})
		} else if (!that.data.memo) {
			wx.showToast({
				title: '请填写备注信息',
				icon: 'none',
				mask: true,
			})
		} else {
			wx.showLoading({
				title: '提交中...',
			})
			that.upLoadFile(that.data.msgData.deliverreccordid)
    }
	},
	// 提交表单
	updateState (textarea) {
		let reasonArr = that.data.values;
		let sessionId = wx.getStorageSync('sessionId');
		wx.request({
			url: 'https://51jka.com.cn/wxCourt/updateState',
			data: {
				courtid: wx.getStorageSync('courtid'),
				barcode: wx.getStorageSync('barcode'),
				staffid: wx.getStorageSync('staffid'),
				signtype: reasonArr,
				memo: that.data.memo,
				image1: that.data.imageFile[0],
				image2: that.data.imageFile[1],
				image3: that.data.imageFile[2],
				image4: that.data.imageFile[3],
				// deliverreccordid: that.data.msgData.deliverreccordid,
				// signresult: 1,
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Cookie": sessionId
			},
			method: 'GET',
			success: function(res) {
				// console.log('提交结果', res)
				if (res.data.result == true) {
					wx.hideLoading();
					wx.showModal({
						title: '成功',
						content: '提交成功',
						showCancel: false,
						confirmText: "确定",
						success(res) {
							if (res.confirm) {
								wx.switchTab({
									url: '/pages/send/send'
								})
							}
						}
					})
					// that.upLoadFile(that.data.msgData.deliverreccordid);
				} else {
					//隐藏loading
					wx.hideLoading();
					wx.showToast({
						title: '提交失败，请重试',
						icon: 'none',
						mask: true,
					})
				}
			},
			fail: function(res) {
				//隐藏loading
				wx.hideLoading();
				wx.showToast({
					title: '提交失败，请检查网络！',
					icon: 'none',
					mask: true
				})
			}
		})
	},
  //上传图片
  upLoadFile (id) {
    var that = this;
    //电子面单上传
    var sessionId = wx.getStorageSync('sessionId');
    wx.showLoading({
      title: '电子面单上传中...',
    })
    wx.uploadFile({
      url: 'https://51jka.com.cn/wxCourt/uploadPhoto',
      filePath: that.data.facialphotoArr[0],
      name: 'file',
      formData: {
        courtid: wx.getStorageSync('courtid'),
        staffid: wx.getStorageSync('staffid'),
        deliverreccordid: that.data.msgData.deliverreccordid,
        location: that.data.region,
        num: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": sessionId
      },
      success(res) {
				var data = JSON.parse(res.data)
				console.log(res.data)
        if (data.result) {
					console.log('电子面单上传成功');
					that.setData({
						imageFile: [data.data]
					})
					console.log(data.data.fileSize,data.data.width,data.data.height)
          //上传图片
          var i = 0;
          that.uploadImg(i, id);
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '上传失败,请重新提交',
            icon: 'none',
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '服务器连接失败',
          icon: 'none',
        })
      },
      complete: function() {
      }
    })
  },
  //上传回执照片
  uploadImg (i, id) {
    var that = this;
    wx.showLoading({
      title: '回执照片上传中...',
    })
    var indexImg = that.data.photoArr.length;
    var upIndex = i - 1 + 3;
    wx.uploadFile({
      url: 'https://51jka.com.cn/wxCourt/uploadPhoto',
      filePath: that.data.photoArr[i],
      name: 'file',
      formData: {
        courtid: wx.getStorageSync('courtid'),
        staffid: wx.getStorageSync('staffid'),
        deliverreccordid: that.data.msgData.deliverreccordid,
        location: that.data.region,
        num: upIndex
      },
      success(res) {
        var data = JSON.parse(res.data)
        if (data.result) {
					console.log('回执照片上传成功');
					const _file = that.data.imageFile.concat(data.data)
					that.setData({
						imageFile: _file
					})
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '上传失败,请重新提交',
            icon: 'none',
          })
        }
        i++;
        if (i == indexImg) {
          return i;
        } else {
          that.uploadImg(i, id);
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '服务器连接失败',
          icon: 'none',
        })
      },
      complete: function() {
        if (i == indexImg) { //当图片传完时，停止调用
					wx.hideLoading();
					that.updateState()
        }
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