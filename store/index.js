module.exports = (state, emitter) => {
  const INIT_DATA = {
    page: 'record'
  }

  const XJJG_DATA = {
    loading: true,
    status: 0,
    village: [],
    villageId: null,
    showUnNormal: false,
    showTime: false,
    reportList: [],
    tab: true,
    today: null,
    cunmin: [],
    person: {},
    photo: null
  }

  emitter.on('state:reportList', reportList => {
    reportList = reportList.filter(r => {
      return r.score !== 1 && r.score !== 10
    })

    reportList = reportList.map(d => {
      var t = new Date(d.date)
      var y = t.getFullYear()
      var month = t.getMonth() + 1
      var day = t.getDate()
      month = month.length === 1 ? '0' + month : month
      day = day.length === 1 ? '0' + day : day
      d.dateFormat = `${y}.${month}.${day}`

      if (d.score === 2) {
        d.score = '中'
      } else if (d.score === 3) {
        d.score = '差'
      }

      return d
    })

    reportList = reportList.sort((a, b) => {
      return b.date - a.date
    })

    state.reportList = reportList
  })

  emitter.on('state:villageId', villageId => {
    state.villageId = villageId
  })

  emitter.on('state:status', status => {
    state.status = status
  })

  emitter.on('state:page', page => {
    state.page = page
  })

  emitter.on('state:showUnNormal', showUnNormal => {
    state.showUnNormal = showUnNormal
  })

  emitter.on('state:showTime', showTime => {
    state.showTime = showTime
  })

  emitter.on('state:tab', tab => {
    state.tab = tab
  })

  emitter.on('state:loading', bool => {
    state.loading = bool
  })

  emitter.on('state:village', datas => {
    datas = datas.map(d => {
      var t = d.score1 + d.score2 + d.score3
      
      d.goodRate = t === 0 ? 0 : d.score1 / t
      d.good = (d.goodRate * 100).toFixed(1) + '%'
      d.join = (((d.score1 + d.score2) / t) * 100).toFixed(1) + '%'

      if (t === 0) {
        d.good = d.join = '0%'
      }
      return d
    })

    datas = datas.sort((a, b) => {
      return b.goodRate - a.goodRate
    })

    state.village = datas
  })

  emitter.on('state:photo', photo => {
    state.photo = photo
  })

  emitter.on('state:today', today => {
    state.today = today
  })

  emitter.on('state:cunmin', datas => {
    datas = datas.map(d => {
      d.total = d.score1 * 2 - d.score2 - d.score3 * 2
      d.time = d.score1 + d.score2 + d.score3 + d.score10
      return d
    })

    datas = datas.sort((a, b) => {
      return b.total - a.total
    })

    state.cunmin = datas
  })

  emitter.on('state:person', datas => {
    var total = 0
    var score1 = 0
    var score2 = 0
    var score3 = 0

    state.person.list = datas.list.map(d => {
      var t = new Date(d.date)
      var y = t.getFullYear()
      var month = t.getMonth() + 1
      var day = t.getDate()
      month = month.length === 1 ? '0' + month : month
      day = day.length === 1 ? '0' + day : day
      d.dateFormat = `${y}.${month}.${day}`

      total += 1
      if (d.score === 1) {
        score1 += 1
      } else if (d.score === 2) {
        score2 += 1
      } else if (d.score === 3) {
        score3 += 1
      }

      return d
    })

    state.person.list = state.person.list.sort((a, b) => {
      return b.date - a.date
    })

    state.person.name = datas.name
    state.person.phone = datas.phone
    state.person.score1 = score1
    state.person.score2 = score2
    state.person.score3 = score3
  })

  Object.assign(state, XJJG_DATA, INIT_DATA)
}
