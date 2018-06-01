module.exports = (state, emitter) => {
  const INIT_DATA = {
    loading: true,
    status: 0,
    village: [],
    cunmin: [],
    person: {}
  }

  emitter.on('state:status', status => {
    state.status = status
  })

  emitter.on('state:loading', bool => {
    state.loading = bool
  })

  emitter.on('state:village', datas => {
    state.village = solveData(datas)
  })

  emitter.on('state:cunmin', datas => {
    state.cunmin = solveData(datas)
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
      d.date = `${y}.${month}.${day}`

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

    state.person.name = datas.name
    state.person.phone = datas.phone
    state.person.score1 = ((score1 / total) * 100).toFixed(1) + '%'
    state.person.score2 = ((score2 / total) * 100).toFixed(1) + '%'
    state.person.score3 = ((score3 / total) * 100).toFixed(1) + '%'
  })

  Object.assign(state, INIT_DATA)
}

function solveData (datas) {
  datas = datas.sort((a, b) => {
    return (b.score1 * 2 - b.score2  - b.score3 * 2) - (a.score1 * 2 - a.score2  - a.score3 * 2)
  })

  datas = datas.map(d => {
    var t = d.score1 + d.score2 + d.score3
    d.score1 = ((d.score1 / t) * 100).toFixed(1) + '%'
    d.score2 = ((d.score2 / t) * 100).toFixed(1) + '%'
    d.score3 = ((d.score3 / t) * 100).toFixed(1) + '%'
    return d
  })

  return datas
}
