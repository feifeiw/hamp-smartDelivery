Component({
  data: {
    selected: null,
    color: "#000000",
    userAuth: '',
    selectedColor: "#5275f5",
    allList: [{
      list1: [{
        "pagePath": "/pages/signFor/signFor",
        "text": "扫码签收",
        "iconPath": "/static/image/signFor.png",
        "selectedIconPath": "/static/image/signFor_select.png"
      },{
        "pagePath": "/pages/files/files",
        "text": "我的卷宗",
        "iconPath": "/static/image/file.png",
        "selectedIconPath": "/static/image/file_select.png"
      },{
        "pagePath": "/pages/user/user",
        "text": "我的",
        "iconPath": "/static/image/my.png",
        "selectedIconPath": "/static/image/my_select.png"
      }],
      list2: [{
        "pagePath": "/pages/searchFiles/searchFiles",
        "text": "卷宗查询",
        "iconPath": "/static/image/chaxun.png",
        "selectedIconPath": "/static/image/chaxun_select.png"
      },{
        "pagePath": "/pages/fileHold/fileHold",
        "text": "持有统计",
        "iconPath": "/static/image/tongji.png",
        "selectedIconPath": "/static/image/tongji_select.png"
      },{
        "pagePath": "/pages/user/user",
        "text": "我的",
        "iconPath": "/static/image/my.png",
        "selectedIconPath": "/static/image/my_select.png"
      }]
    }],
    list: []
  },
  lifetimes: {
    attached() {
      const userAuth = wx.getStorageSync('userAuth')
      console.log('权限', userAuth)
      if (userAuth.role == 1) {
        this.setData({
          list: this.data.allList[0].list1
        })
      }else if(userAuth.role == 2){
        this.setData({
          list: this.data.allList[0].list2
        })
      }
    },
  },
  methods: {
    changeTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      // this.setData({
      //   selected: data.index
      // })
      wx.switchTab({ url })
    }
  }
})