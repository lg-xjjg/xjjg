var html = require('choo/html')
var Nanocomponent = require('choo/component')
var ImageCompressor = require('image-compressor.js')
var QCZ = require('./cz.js')
const { getData } = require('../fetch')

var TITLE = '统计结果'

module.exports = view

class QTotal extends Nanocomponent {
  constructor (state, emit, cunminList) {
    super()
    this.state = state
    this.emit = emit
  }

  createElement () {
    return html`
      <div class='w-100 f5 mv3 ml2'>
        <p>今日总体情况:</p>
        ${this.state.today ?
          html`
            <ul class='pa0 list'>
              <li class='dib mr2'>好: ${this.state.today.score1}户</li>
              <li class='dib mr2'>中: ${this.state.today.score2}户</li>
              <li class='dib mr2'>差: ${this.state.today.score3}户</li>
              <li class='dib mr2'>没有垃圾: ${this.state.today.score10}户</li>
              <p class='f5'>
                合格率：<span class='purple-blue'>${this.state.today.hg}</span>
                参与率：<span class='purple-blue'>${this.state.today.cy}</span>
              </p>
            </ul>
          `:
          html`
            <div></div>
          `
        }
      </div>
    `
  }

  load () {
    var midnight = new Date()

    midnight.setHours(0,0,0,0)

    getData('polling', JSON.stringify({
      villageId: this.state.villageId,
      date: { $gt: midnight.getTime() }
    }), datas => {
      var score1 = 0
      var score2 = 0
      var score3 = 0
      var score10 = 0

      datas.forEach(d => {
        if (d.score === 1) {
          score1++
        }

        if (d.score === 2) {
          score2++
        }

        if (d.score === 3) {
          score3++
        }

        if (d.score === 10) {
          score10++
        }
      })
      var t = score1 + score2 + score3 + score10

      var hg = ((score1 / t) * 100).toFixed(1) + '%'
      var cy = (((score1 + score2) / t) * 100).toFixed(1) + '%'

      if (t === 0) {
        hg = '0%'
        cy = '0%'
      }

      this.emit('state:today', {score1, score2, score3, score10, hg, cy})
      this.render()
    }, err => {
      console.log(err)
    })
  }

  update () {
    return true
  }
}

class QNormal extends Nanocomponent {
  constructor (state, emit, cunminList) {
    super()
    this.state = state
    this.emit = emit
    this.handleClick = this.handleClick.bind(this)
    this.cunminList = cunminList
  }

  createElement () {
    return html`
      <div class='w-100 f4 flex items-center mv3 ml2'>
        <span>显示非常住户:</span>
        <div
          onclick=${this.handleClick}
          class='ml2 bg-white br2 b--blue ba bw015 w2 h2 flex items-center justify-center'>
          ${this.state.showUnNormal ? html`<i class='icon icon_agree icon-25'></i>` : html`<div></div>`}
        </div>
      </div>
    `
  }

  handleClick () {
    var showUnNormal = !this.state.showUnNormal
    this.emit('state:showUnNormal', showUnNormal)
    this.cunminList.render()
  }

  update () {
    return true
  }
}

class QOption extends Nanocomponent {
  constructor (state, emit, cunminList) {
    super()
    this.state = state
    this.emit = emit
    this.handleClick = this.handleClick.bind(this)
    this.cunminList = cunminList
  }

  createElement () {
    return html`
      <div class='w-100 f4 flex items-center mv3 ml2'>
        <span>显示次数:</span>
        <div
          onclick=${this.handleClick}
          class='ml2 bg-white br2 b--blue ba bw015 w2 h2 flex items-center justify-center'>
          ${this.state.showTime ? html`<i class='icon icon_agree icon-25'></i>` : html`<div></div>`}
        </div>
      </div>
    `
  }

  handleClick () {
    var showTime = !this.state.showTime
    this.emit('state:showTime', showTime)
    this.cunminList.render()
  }

  update () {
    return true
  }
}

class ReportList extends Nanocomponent {
  constructor (state, emit, qBox) {
    super()
    this.state = state
    this.emit = emit
  }

  createElement () {
    if (this.state.loading) {
      return html`
        <ul class='w-100 pa0 mt0'>
          <div class='tc mt4'>
            <i class='icon icon_spinner icon-40'></i>
          </div>
        </ul>
      `
    } else {
      return html`
        <ul class='w-100 pa0 mt0 h5 overflow-scroll'>
          <li class='flex f7'>
            <div class='flex w-20 h2 ba bw05 b--purple-blue items-center justify-center'><span>日期</span></div>
            <div class='flex w-10 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>情况</span></div>
            <div class='flex w-20 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>编号</span></div>
            <div class='flex w-20 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>姓名</span></div>
            <div class='flex w-30 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>手机</span></div>
          </li>
          ${this.state.reportList.map(r => {
            return html`
              <li class='flex f7'>
                <div class='flex w-20 h2 bb br bl bw05 b--purple-blue items-center justify-center'><span>${r.dateFormat}</span></div>
                <div class='flex w-10 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${r.score}</span></div>
                <div class='flex w-20 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${r.area + r.num}</span></div>
                <div class='flex w-20 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${r.name}</span></div>
                <div class='flex w-30 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${r.phone ? r.phone : '暂无'}</span></div>
              </li>
            `
          })}
        </ul>
      `
    }
  }

  load () {
    this.emit('state:loading', true)
    this.render()

    var midnight = new Date()

    midnight.setHours(0,0,0,0)

    getData('polling', JSON.stringify({
      villageId: this.state.villageId,
      date: { $gt: midnight.getTime() - 3 * 24 * 36 * 100000 }
    }), datas => {
      this.emit('state:reportList', datas)
      this.emit('state:loading', false)
      this.render()
    }, err => {
      console.log(err)
    })
  }

  update () {
    return true
  }
}

class QTab extends Nanocomponent {
  constructor (state, emit, qBox) {
    super()
    this.state = state
    this.emit = emit
    this.handleClick = this.handleClick.bind(this)
    this.qBox = qBox
  }

  createElement () {
    var tab = this.state.tab

    return html`
      <section class='w-100 flex justify-between purple-blue b--blue bw1 bt'>
        <div
          onclick=${this.handleClick(true)}
          class='h2 flex w-50 b--blue bw1 items-center tc ${tab ? "bb br bl" : "o-50"}'>
          <p class='w-100'>总体排名</p>
        </div>
        <div
          onclick=${this.handleClick(false)}
          class='h2 flex w-50 b--blue bw1 items-center tc ${!tab ? "bb br bl" : "o-50"}'>
          <p class='w-100'>三日内不合格名单</p>
        </div>
      </section>
    `
  }

  handleClick (tab) {
    return e => {
      this.emit('state:tab', tab)
      this.qBox.render()
      this.render()
    }
  }

  update () {
    return true
  }
}

class QPhoto extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.back = this.back.bind(this)
  }

  createElement () {
    return html`
      <div class='w-100 flex flex-column flex-auto items-center'>
        <div class='w-90'>
          <p class='f4 purple-blue' onclick=${this.back()}>返回</p>
          <img src=${this.state.photo} />
        </div>
      </div>
    `
  }

  back () {
    return e => {
      this.emit('state:status', 3)
      this.emit('render')
    }
  }

  update () {
    return true
  }
}

class PersonList extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.back = this.back.bind(this)
    this.clickPhoto = this.clickPhoto.bind(this)
  }

  createElement () {
    return html`
      <div class='w-100 flex flex-column flex-auto items-center'>

        <div class='w-90'>
          <p class='f4 purple-blue' onclick=${this.back()}>返回</p>
          <p class='f5'>姓名: <span class='f4 purple-blue'>${this.state.person.name}</span></p>
          <p class='f5'>手机: <span class='f4 purple-blue'>${this.state.person.phone ? this.state.person.phone : '暂无'}</span></p>
          <div class='w-70 flex justify-between'>
            <span>优: <b class='purple-blue'>${this.state.person.score1}</b></span>
            <span>中: <b class='purple-blue'>${this.state.person.score2}</b></span>
            <span>差: <b class='purple-blue'>${this.state.person.score3}</b></span>
          </div>
        </div>
        <ul class='w-90 pa0 h5 overflow-scroll'>
          <li class='flex'>
            <div class='flex w-50 h2 ba bw05 b--purple-blue items-center justify-center'><span>日期</span></div>
            <div class='flex w-50 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>结果</span></div>
          </li>
          ${this.state.person.list.map((d, i) => html`
            <li class='flex f6'>
              <div class='flex w-50 h2 bl bb br bw05 b--purple-blue items-center justify-center'><span>${d.dateFormat}</span></div>
              <div class='flex w-50 h2 bb br bw05 b--purple-blue items-center justify-center'>
                <span onclick=${this.clickPhoto(d)} class='${d.photo ? "purple-blue" : ""}'>
                  ${d.score === 1 ? '优' : (d.score === 2 ? '中' : (d.score === 3 ? '差' : '没有垃圾'))}
                </span>
              </div>
            </li>
          `)}
        </ul>
      </div>
    `
  }

  back () {
    return e => {
      this.emit('state:status', 2)
      this.emit('render')
    }
  }

  clickPhoto (data) {
    return e => {
      if (!data.photo) {
        return
      }

      this.emit('state:loading', true)
      this.emit('render')

      getData('photo', JSON.stringify({ id: data.id, date: data.date }), datas => {
        var photo = datas[0].photo
        this.emit('state:photo', photo)
        this.emit('state:status', 4)
        this.emit('state:loading', false)
        this.emit('render')
      }, err => {
        console.log(err)
      })
    }
  }

  update () {
    return true
  }
}

class CunminList extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.handleClick = this.handleClick.bind(this)
    this.qNormal = new QNormal(state, emit, this)
    this.qOption = new QOption(state, emit, this)
  }

  createElement () {
    if (this.state.loading) {
      return html`
        <ul class='w-100 pa0 mt0'>
          <div class='tc mt4'>
            <i class='icon icon_spinner icon-40'></i>
          </div>
        </ul>
      `
    } else {
      var cunmins = this.state.cunmin.filter(d => {
        if (!d.isNormal && !this.state.showUnNormal) {
          return false
        }
        return true
      })

      if (this.state.showTime) {
        cunmins = cunmins.sort((a, b) => {
          return a.time - b.time
        })
      }
      return html`
        <ul class='w-100 pa0 mt1 h5 overflow-scroll'>
          ${this.qNormal.render()}
          ${this.qOption.render()}
          ${!this.state.showTime ?
            html`
              <li class='flex'>
                <div class='flex w-14 h2 ba bw05 b--purple-blue items-center justify-center'><span>排名</span></div>
                <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>编号</span></div>
                <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>姓名</span></div>
                <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>优</span></div>
                <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>中</span></div>
                <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>差</span></div>
                <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>总分</span></div>
              </li>
            ` :
            html`
              <li class='flex'>
                <div class='flex w-33 h2 ba bw05 b--purple-blue items-center justify-center'><span>编号</span></div>
                <div class='flex w-33 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>姓名</span></div>
                <div class='flex w-33 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>次数</span></div>
              </li>
            `
          }
          ${!this.state.showTime ? cunmins.map((d, i) => html`
            <li class='flex f7'>
              <div class='flex w-14 h2 bb br bl bw05 b--purple-blue items-center justify-center'><span>${i + 1}</span></div>
              <div class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.area + d.num}</span></div>
              <div
                onclick=${this.handleClick(d.id, d.name , d.phone)}
                class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center purple-blue'>
                <span>${d.name}</span>
              </div>
              <div class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score1}</span></div>
              <div class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score2}</span></div>
              <div class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score3}</span></div>
              <div class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.total}</span></div>
            </li>
          `) : cunmins.map((d, i) => html`
          <li class='flex f7'>
            <div class='flex w-50 h2 bb br bl bw05 b--purple-blue items-center justify-center'>
              <span>${d.area + d.num}</span>
            </div>
            <div
              onclick=${this.handleClick(d.id, d.name , d.phone)}
              class='flex w-50 h2 bb br bw05 b--purple-blue items-center justify-center purple-blue'>
              <span>${d.name}</span>
            </div>
            <div class='flex w-50 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.time}</span></div>
          </li>
          `)}
        </ul>
      `
    }
  }

  load () {
    this.emit('state:loading', true)
    this.render()
    getData('cunmin', JSON.stringify({ villageId: this.state.villageId }), datas => {
      this.emit('state:status', 2)
      this.emit('state:cunmin', datas)
      this.emit('state:loading', false)
      this.render()
    }, err => {
      console.log(err)
    })
  }

  handleClick (id, name, phone) {
    return e => {
      this.emit('state:loading', true)
      this.emit('render')

      getData('polling', JSON.stringify({ id }), datas => {
        var d = {}
        d.list = datas
        d.name = name
        d.phone = phone
        this.emit('state:status', 3)
        this.emit('state:person', d)
        this.emit('state:loading', false)
        this.emit('render')
      }, err => {
        console.log(err)
      })
    }
  }

  update () {
    return true
  }
}

class VillageList extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.handleClick = this.handleClick.bind(this)
  }

  createElement () {
    return html`
      <ul class='w-100 pa0 h5 overflow-scroll'>
        <li class='flex'>
          <div class='flex w-25 h2 ba bw05 b--purple-blue items-center justify-center'><span>排名</span></div>
          <div class='flex w-25 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>村庄</span></div>
          <div class='flex w-25 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>合格率</span></div>
          <div class='flex w-25 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>参与率</span></div>
        </li>
        ${this.state.village.map((d, i) => html`
          <li class='flex f7'>
            <div class='flex w-25 h2 bb br bl bw05 b--purple-blue items-center justify-center'><span>${i + 1}</span></div>
            <div
              onclick=${this.handleClick(d.id)}
              class='flex w-25 h2 bb br bw05 b--purple-blue items-center justify-center purple-blue'>
              <span>${d.name}</span>
            </div>
            <div class='flex w-25 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.good}</span></div>
            <div class='flex w-25 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.join}</span></div>
          </li>
        `)}
      </ul>
    `
  }

  handleClick (villageId) {
    return e => {
      this.emit('state:villageId', villageId)
      this.emit('state:status', 2)
      this.emit('render')
    }
  }

  update () {
    return true
  }
}

class QBox extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.qTab = new QTab(state, emit, this)
    this.cunminList = new CunminList(state, emit)
    this.reportList = new ReportList(state, emit)
    this.back = this.back.bind(this)
    this.qTotal = new QTotal(state, emit)
  }

  createElement () {
    return html`
      <section class='w-100'>
        <p class='f4 purple-blue ml2' onclick=${this.back()}>返回</p>
        ${this.qTotal.render()}
        ${this.qTab.render()}
        ${this.state.tab ? this.cunminList.render() : this.reportList.render()}
      </section>
    `
  }

  back () {
    return e => {
      this.emit('state:status', 1)
      this.emit('render')
    }
  }

  update () {
    return true
  }
}

class QXJJG extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.cunminList = new CunminList(state, emit)
    this.personList = new PersonList(state, emit)
    this.villageList = new VillageList(state, emit)
    this.qPhoto = new QPhoto(state, emit)
    this.qBox = new QBox(state, emit)
  }

  createElement () {
    return html`
      <main class='w-100 flex flex-column flex-auto bg-dz items-center'>
        <header class='w-100 tc purple-blue f3 bold05 bg-white pv2 tracked'>分类情况</header>
        <section class='w-100'>
        ${ this.state.loading ?
          html`
            <div class='tc mt4'>
              <i class='icon icon_spinner icon-40'></i>
            </div>
          `
          :
          ( this.state.status === 1 ?
            this.villageList.render() :
            (
              this.state.status === 2 ?
              this.qBox.render() :
              (
                this.state.status === 3 ?
                this.personList.render() :
                this.qPhoto.render()
              )
            )
          )
        }
        </section>
      </main>
    `
  }

  load () {
    if (this.state.status === 0) {
      getData('village', null, datas => {
        this.emit('state:status', 1)
        this.emit('state:village', datas)
        this.emit('state:loading', false)
        this.emit('render')
      }, err => {
        console.log(err)
      })
    }
  }

  update () {
    return true
  }
}

class CBox extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.qXJJG = new QXJJG(state, emit)
    this.qCZ = new QCZ(state, emit)
  }

  createElement () {
    if (this.state.page === 'record') {
      return this.qXJJG.render()
    } else if (this.state.page === 'weight') {
      return this.qCZ.render()
    }
  }

  update () {
    return true
  }
}

class Footer extends Nanocomponent {
  constructor (state, emit, cBox) {
    super()
    this.cBox = cBox
    this.state = state
    this.emit = emit
  }

  createElement () {
    return html`
      <footer
        class='bg-white w-100 pv012 tc flex justify-around fixed bottom-0'>
        <i class='icon icon_add ${this.state.page === 'record' ? 'icon_record_active animated pulse' : 'icon_record'}'
          onclick=${this.handleClick('record')}></i>
        <i class='icon icon_line ${this.state.page === 'weight' ? 'icon_weight_active animated pulse' : 'icon_weight'}'
          onclick=${this.handleClick('weight')}></i>
      </footer>
    `
  }

  handleClick (page) {
    return () => {
      if (page !== this.state.page) {
        this.emit('state:page', page)
        this.cBox.render()
        this.render()
      }
    }
  }

  update () {
    return true
  }
}

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  var cBox = new CBox(state, emit)
  var footer = new Footer(state, emit, cBox)

  return html`
    <body class='w-100 flex flex-column bg-n-white'>
      ${cBox.render()}
      ${footer.render()}
    </body>
  `
}
