// pages/map/map.js
const app = getApp()
const img = '../image/location.png'

Page({
  data: {
    latitude: '',
    longitude: '',
  },
  onLoad: function () {
    this.setData({
      latitude: wx.getStorageSync('latitude'),
      longitude: wx.getStorageSync('longitude'),
    })
  },
  onShow: function() {
    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.moveToLocation()
  },
  onMarkerTap(e) {
    console.log('@@ markertap', e)
  },
  onCalloutTap(e) {
    console.log('@@ onCalloutTap', e)
  },
  onLabelTap(e) {
    console.log('@@ labletap', e)
  }
})
