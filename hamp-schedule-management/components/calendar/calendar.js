// calendar.js
Component({
  properties: {
    // 第一列星期几
    weekstart: {
      type: Number,
      default: 7
    },
    // 已经签到的日期
    signeddates: {
      type: Object,
      default: {}
    },
    // 是否展开
    open: {
      type: Boolean,
      default: true
    },
    Today: {
      type: String,
      default: ''
    }
  },
  data: {
    text: {
      year: '年',
      month: '月',
      week: ['一', '二', '三', '四', '五', '六', '日'],
      today: '今'
    },
    y: new Date().getFullYear(), // 年
    m: new Date().getMonth(), // 月
    dates: [], // 当前月日期集合
    positionTop: 0,
    monthOpen: true,
    choose: '',
    height: '',
    Today: '',
    showClick: ''
  },
  methods: {
    stratLoad() {
      this.getToDay()
      this.getWeek()
      this.isSigned()
    },
    getToDay() {
      const dataArr = this.monthDay(this.data.y, this.data.m)
      dataArr.map(item => {
        let _month = ''
        let _date = item.date
        if (item.month < 10) {
          _month = `0${item.month + 1}`
        } else {
          _month = item.month + 1
        }
        if (item.date < 10) {
          _date = `0${item.date}`
        }
        const _day = `${item.year}-${_month}-${_date}`
        if (this.data.Today == _day) {
          item.isDay = true
        }
      })
      this.setData({
        dates: dataArr
      })
    },
    getWeek () {
      // 2
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth()
      let d = date.getDate()
      let week =this.data.text.week.slice(this.data.weekstart - 1).concat(this.data.text.week.slice(0, this.data.weekstart - 1))
      this.setData({
        choose: `${y}-${m + 1}-${d}`,
        weekDay: week
      })
    },
    // 获取当前月份天数
    monthDay(y, m) {
      let firstDayOfMonth = new Date(y, m, 1).getDay() // 当月第一天星期几
      let lastDateOfMonth = new Date(y, m + 1, 0).getDate() // 当月最后一天
      let lastDayOfLastMonth = new Date(y, m, 0).getDate() // 上一月的最后一天
      let dates = [] // 所有渲染日历
      let weekstart = this.data.weekstart == 7 ? 0 : this.data.weekstart // 方便进行日期计算，默认星期从0开始
      let startDay = (() => {
        // 周初有几天是上个月的
        if (firstDayOfMonth == weekstart) {
          return 0
        } else if (firstDayOfMonth > weekstart) {
          return firstDayOfMonth - weekstart
        } else {
          return 7 - weekstart + firstDayOfMonth
        }
      })()
      let endDay = 7 - ((startDay + lastDateOfMonth) % 7) // 结束还有几天是下个月的
      for (let i = 1; i <= startDay; i++) {
        dates.push({
          date: lastDayOfLastMonth - startDay + i,
          day: weekstart + i - 1 || 7,
          month: m - 1 >= 0 ? m - 1 : 12,
          year: m - 1 >= 0 ? y : y - 1,
        })
      }
      for (let j = 1; j <= lastDateOfMonth; j++) {
        dates.push({
          date: j,
          day: (j % 7) + firstDayOfMonth - 1 || 7,
          month: m,
          year: y,
          lm: true
        })
      }
      for (let k = 1; k <= endDay; k++) {
        dates.push({
          date: k,
          day: (lastDateOfMonth + startDay + weekstart + k - 1) % 7 || 7,
          month: m + 1 <= 11 ? m + 1 : 0,
          year: m + 1 <= 11 ? y : y + 1
        })
      }
      return dates
    },
    // 已经签到处理
    isSigned() {
      // console.log(this.data.signeddates)
      const _singleDates = this.data.signeddates
      const _dates = this.data.dates
      _dates.map(item => {
        // let dy = `${item.year}-${item.month+1}-${item.date}`
        let dy = [item.year, item.month+1, item.date].map(this.formatNumber).join('-')
        if (_singleDates[dy] > 0) {
          if (_singleDates[dy] == 1) {
            item.tips = '.'
          } else if (_singleDates[dy] == 2) {
            item.tips = '..'
          } else if (_singleDates[dy] == 3) {
            item.tips = '...'
          } else if (_singleDates[dy] > 3) {
            item.tips = '—'
          }
        } else {
          item.tips = ''
        }
        this.setData({
          dates: _dates
        })
      })
    },
    formatNumber (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    },
    // 点击回调
    selectOne(e) {
      const i = e.currentTarget.dataset.item
      let date = [i.year, i.month+1, i.date].map(this.formatNumber).join('-')
      let _dateShow = `${i.year}-${i.month + 1}-${i.date}`
      let selectD = new Date(date)
      if (selectD.getMonth() != this.data.m) {
        console.log('不在可选范围内')
        return false
      }
      this.setData({
        choose: date,
        showClick: _dateShow
      })
      this.triggerEvent('onClick', date)
    },
    // 上个月，下个月
    turning(e) {
      let that = this
      let _action = e.currentTarget.dataset.name
      if (_action === 'next') {
        if (that.data.m + 1 == 12) {
          that.setData({
            m: 0,
            y:  that.data.y + 1
          })
        } else {
          that.setData({
            m: that.data.m + 1
          })
        }
      } else {
        if (that.data.m + 1 == 1) {
          that.setData({
            m: 11,
            y: that.data.y - 1
          })
        } else {
          that.setData({
            m: that.data.m - 1
          })
        }
      }
      // that.setData({
      //   dates: that.monthDay(that.data.y, that.data.m)
      // })
      this.getToDay()
      this.isSigned()
    }
  }
})