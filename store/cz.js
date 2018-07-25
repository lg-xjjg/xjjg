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

      d.t_rot = d.t_rot ? d.t_rot : 0
      d.t_unrot = d.t_unrot ? d.t_unrot : 0
      d.t_harm = d.t_harm ? d.t_harm : 0
      d.t_recycle = d.t_recycle ? d.t_recycle : 0

      var t_total = d.t_rot + d.t_unrot + d.t_harm + d.t_recycle
      var rest = total - d.unrot
      var t_rest = t_total - d.t_unrot
      var num = total ? ((rest / total) * 100).toFixed(1) + '%' : '0%'
      var t_num = t_total ? ((t_rest / t_total) * 100).toFixed(1) + '%' : '0%'
      return {
        name: d.name,
        rot: d.rot,
        unrot: d.unrot,
        harm: d.harm,
        recycle: d.recycle,
        total: total,
        t_rot: d.t_rot,
        t_unrot: d.t_unrot,
        t_harm: d.t_harm,
        t_recycle: d.t_recycle,
        t_total: t_total,        
        n: total === 0 ? -1 : rest / total,
        t_n: t_total === 0 ? -1 : t_rest / t_total,
        t_num: t_num,
        num: num
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
