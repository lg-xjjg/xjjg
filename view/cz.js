var html = require('choo/html')
var css = require('sheetify')
var Nanocomponent = require('choo/component')
var mitt = require('mitt')
var amme = mitt()
const { postKey, getData, postData, clearImage } = require('../fetch/cz.js')

var TITLE = '分类记录'

class DeleveryList extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.handleClick = this.handleClick.bind(this)
    this.back = this.back.bind(this)
  }

  createElement () {
    if (!this.state.delevery) {
      return html`
        <ul class='w-100 pa0 h5_5'>
          <div class='tc mt4'>
            <i class='icon icon_spinner icon-40'></i>
          </div>
        </ul>
      `
    } else {
      return html`
        <ul class='w-100 pa0 h5_5'>
          <li class='flex f7'>
            <div class='flex w-14 h2 ba bw05 b--purple-blue items-center justify-center'><span>排名</span></div>
            <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>姓名</span></div>
            <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>优</span></div>
            <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>中</span></div>
            <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>差</span></div>
            <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>拒分拣</span></div>
            <div class='flex w-14 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>总分</span></div>
          </li>
          ${this.state.delevery.map((d, i) => html`
            <li class='flex f7'>
              <div class='flex w-14 h2 bb br bl bw05 b--purple-blue items-center justify-center'><span>${i + 1}</span></div>
              <div
                class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'>
                <span>${d.name}</span>
              </div>
              <div class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score1}</span></div>
              <div class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score2}</span></div>
              <div class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score3}</span></div>
              <div class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.score4}</span></div>
              <div class='flex w-14 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.total}</span></div>
            </li>
          `)}
        </ul>
      `
    }
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

  load () {
    if (!this.state.delevery) {
      getData('collector', null, datas => {
        this.emit('state:delevery', datas)
        this.render()
      }, err => {
        console.log(err)
      })
    }
  }

  update () {
    return true
  }
}

class DrateList extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.handleClick = this.handleClick.bind(this)
    this.back = this.back.bind(this)
  }

  createElement () {
    if (!this.state.drate) {
      return html`
        <ul class='w-100 pa0 h5_5'>
          <div class='tc mt4'>
            <i class='icon icon_spinner icon-40'></i>
          </div>
        </ul>
      `
    } else if (this.state.czstatus === 1){
      return html`
        <ul class='w-100 pa0 h5_5'>
          <li class='flex'>
            <div class='flex w-33 h2 ba bw05 b--purple-blue items-center justify-center'><span>排名</span></div>
            <div class='flex w-33 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>村庄</span></div>
            <div class='flex w-33 h2 bt bb br bw05 b--purple-blue items-center justify-center'><span>减量率</span></div>
          </li>
          ${this.state.drate.map((d, i) => html`
            <li class='flex'>
              <div class='flex w-33 h2 bb br bl bw05 b--purple-blue items-center justify-center'><span>${i + 1}</span></div>
              <div
                onclick=${this.handleClick(d)}
                class='flex w-33 h2 bb br bw05 b--purple-blue items-center justify-center purple-blue'>
                <span>${d.name}</span>
              </div>
              <div class='flex w-33 h2 bb br bw05 b--purple-blue items-center justify-center'><span>${d.num}</span></div>
            </li>
          `)}
        </ul>
      `
    } else if (this.state.czstatus === 2){
      return html`
        <ul class='w-100 pa0'>
          <button class='f4 mt2 ml2 mb2 bn bg-purple-blue h2 br2 white' onclick=${this.back()}>返回</button>
          <p class='f4 ml2'>可腐烂：<span class='purple-blue'>${this.state.czdetail.rot}kg</span></p>
          <p class='f4 ml2'>不可腐烂：<span class='purple-blue'>${this.state.czdetail.unrot}kg</span></p>
          <p class='f4 ml2'>可回收：<span class='purple-blue'>${this.state.czdetail.recycle}kg</span></p>
          <p class='f4 ml2'>有毒有害：<span class='purple-blue'>${this.state.czdetail.harm}kg</span></p>
          <p class='f4 ml2'>总重：<span class='purple-blue'>${this.state.czdetail.total}kg</span></p>
        </ul>
      `
    }
  }

  back () {
    return e => {
      this.emit('state:czstatus', 1)
      this.emit('render')
      this.render()
    }
  }

  handleClick (d) {
    return () => {
      this.emit('state:czstatus', 2)
      this.emit('state:czdetail', d)
      this.render()
    }
  }

  load () {
    if (!this.state.drate) {
      getData('village', null, datas => {
        this.emit('state:drate', datas)
        this.render()
      }, err => {
        console.log(err)
      })

      clearImage()
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
    this.drateList = new DrateList(state, emit)
    this.DeleveryList = new DeleveryList(state, emit)
  }

  createElement () {
    return html`
      <section class='w-100'>
        ${this.state.tab ? this.drateList.render() : this.DeleveryList.render()}
      </section>
    `
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
      <section class='w-100 flex justify-between purple-blue'>
        <div
          onclick=${this.handleClick(true)}
          class='h2 flex w-50 b--blue bw1 items-center tc ${tab ? "bb" : "o-50"}'>
          <p class='w-100'>减量率</p>
        </div>
        <div
          onclick=${this.handleClick(false)}
          class='h2 flex w-50 b--blue bw1 items-center tc ${!tab ? "bb" : "o-50"}'>
          <p class='w-100'>收运员</p>
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

class Component extends Nanocomponent {
  constructor (state, emit) {
    super()
    this.state = state
    this.emit = emit
    this.qBox = new QBox(state, emit)
    this.qTab = new QTab(state, emit, this.qBox)
  }

  createElement () {
    return html`
      <main class='w-100 flex flex-column flex-auto bg-dz items-center'>
        <header class='w-100 tc purple-blue f3 bold05 bg-white pv2 tracked'>称重结果</header>
        ${this.qTab.render()}
        ${this.qBox.render()}
      </main>
    `
  }

  update () {
    return true
  }
}

module.exports = Component
