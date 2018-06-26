module.exports = (state, emitter) => {
  const INIT_DATA = {
    tab: true,
    drate: false,
    czstatus: 1,
    czdetail: {},
    delevery: false
  }

  Object.assign(state, INIT_DATA)

  emitter.on('state:tab', tab => {
    state.tab = tab
  })

  emitter.on('state:czstatus', czstatus => {
    state.czstatus = czstatus
  })

  emitter.on('state:czdetail', czdetail => {
    state.czdetail = czdetail
  })

  emitter.on('state:drate', datas => {
    var drate = datas.map(d => {
      var total = d.rot + d.unrot + d.harm + d.recycle
      var rest = total - d.unrot

      return {
        name: d.name,
        rot: d.rot,
        unrot: d.unrot,
        harm: d.harm,
        recycle: d.recycle,
        total: total,
        n: rest / total,
        num: ((rest / total) * 100).toFixed(1) + '%'
      }
    })

    drate = drate.sort((a, b) => {
      return b.n - a.n
    })

    state.drate = drate
  })

  emitter.on('state:delevery', datas => {
    console.log(datas)
    datas = datas.sort((a, b) => {
      return (b.score1 * 2 - b.score2  - b.score3 * 2 - b.score4 * 4) - (a.score1 * 2 - a.score2  - a.score3 * 2 - a.score4 * 4)
    })

    datas = datas.map(b => {
      b.total = b.score1 * 2 - b.score2  - b.score3 * 2 - b.score4 * 4
      return b
    })

    state.delevery = datas
  })
}
