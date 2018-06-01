var html = require('choo/html')
var Nanocomponent = require('choo/component')
var ImageCompressor = require('image-compressor.js')

const { getData } = require('../fetch')

var TITLE = '分类结果'

module.exports = view

class PersonList extends Nanocomponent {
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
          <p class='f5'>姓名: <span class='f4 purple-blue'>${this.state.person.name}</span></p>
          <p class='f5'>手机: <span class='f4 purple-blue'>${this.state.person.phone ? this.state.person.phone : '暂无'}</span></p>
          <div class='w-70 flex justify-between'>
            <span>优: <b class='purple-blue'>${this.state.person.score1}</b></span>
            <span>中: <b class='purple-blue'>${this.state.person.score2}</b></span>
            <span>差: <b class='purple-blue'>${this.state.person.score3}</b></span>
          </div>
        </div>
        <ul class='w-90 pa0'>
          <li class='flex'>
            <div class='flex w-50 h2 ba bw05 b--purple-blue items-center justify-center'><span>日期</span></div>
            <div class='flex w-50 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>结果</span></div>
          </li>
          ${this.state.person.list.map((d, i) => html`
            <li class='flex f6'>
              <div class='flex w-50 h2 bl bb br bw05 b--purple-blue items-center justify-center'><span>${d.date}</span></div>
              <div class='flex w-50 h2 bb br bw05 b--purple-blue items-center justify-center'><span>
                ${d.score === 1 ? '优' : (d.score === 2 ? '中' : '差')}
              </span></div>
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
    this.back = this.back.bind(this)
  }

  createElement () {
    return html`
      <ul class='w-100 pa0'>
        <p class='f4 purple-blue ml2' onclick=${this.back()}>返回</p>
        <li class='flex'>
          <div class='flex w-20 h2 ba bw05 b--purple-blue items-center justify-center'><span>排名</span></div>
          <div class='flex w-20 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>姓名</span></div>
          <div class='flex w-20 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>上</span></div>
          <div class='flex w-20 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>中</span></div>
          <div class='flex w-20 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>下</span></div>
        </li>
        ${this.state.cunmin.map((d, i) => html`
          <li class='flex f7'>
            <div class='flex w-20 h2 bb br bl bw05 b--purple-blue items-center justify-center'><span>${i + 1}</span></div>
            <div
              onclick=${this.handleClick(d.id, d.name , d.phone)}
              class='flex w-20 h2 bb br bw05 b--purple-blue items-center justify-center purple-blue'>
              <span>${d.name}</span>
            </div>
            <div class='flex w-20 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score1}</span></div>
            <div class='flex w-20 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score2}</span></div>
            <div class='flex w-20 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score3}</span></div>
          </li>
        `)}
      </ul>
    `
  }

  back () {
    return e => {
      this.emit('state:status', 1)
      this.emit('render')
    }
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
      <ul class='w-100 pa0'>
        <li class='flex'>
          <div class='flex w-20 h2 ba bw05 b--purple-blue items-center justify-center'><span>排名</span></div>
          <div class='flex w-20 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>村庄</span></div>
          <div class='flex w-20 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>上</span></div>
          <div class='flex w-20 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>中</span></div>
          <div class='flex w-20 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>下</span></div>
        </li>
        ${this.state.village.map((d, i) => html`
          <li class='flex f7'>
            <div class='flex w-20 h2 bb br bl bw05 b--purple-blue items-center justify-center'><span>${i + 1}</span></div>
            <div
              onclick=${this.handleClick(d.id)}
              class='flex w-20 h2 bb br bw05 b--purple-blue items-center justify-center purple-blue'>
              <span>${d.name}</span>
            </div>
            <div class='flex w-20 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score1}</span></div>
            <div class='flex w-20 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score2}</span></div>
            <div class='flex w-20 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score3}</span></div>
          </li>
        `)}
      </ul>
    `
  }

  handleClick (villageId) {
    return e => {
      this.emit('state:loading', true)
      this.emit('render')
      getData('cunmin', JSON.stringify({ villageId }), datas => {
        this.emit('state:status', 2)
        this.emit('state:cunmin', datas)
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

class Component extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.villageList = new VillageList(state, emit)
    this.cunminList = new CunminList(state, emit)
    this.personList = new PersonList(state, emit)
  }

  createElement () {
    return html`
      <main class='w-100 flex flex-column flex-auto bg-dz items-center'>
        <header class='w-100 tc purple-blue f3 bold05 bg-white pv2 tracked'>分类结果</header>
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
              this.cunminList.render() :
              this.personList.render()
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

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  var component = new Component(state, emit)

  return html`
    <body class='w-100 h-100 overflow-hidden flex flex-column bg-n-white'>
      ${component.render()}
    </body>
  `
}
