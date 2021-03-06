var host = 'https://api.mlab.com/api/1/databases/my-db1/collections/'
var apiKey = 'q4vsE-BwyJnqZDJSC_d1240H82QBoKVv'

module.exports = {
  postKey (q, resolve, reject) {
    resolve = resolve ? resolve : function (){}
    reject = reject ? reject : function (){}

    fetch(url('pollingman', q))
    .then(res => res.json())
    .then(resolve)
    .catch(reject)
  },

  clearImage () {
    var d = new Date()
    d.setHours(0,0,0,0)
    var yMidnight = d.getTime() - 24 * 1000 * 3600

    fetch(url('clear'))
    .then(res => res.json())
    .then(datas => new Promise((resolve, reject) => {
      var clearDate = datas[0].date
   
      if (yMidnight - clearDate < 24 * 1000 * 3600) {
        reject(false)
      } else {
        resolve()
      }
    }))
    .then(() => {
      return fetch(url('photo', JSON.stringify({ date: { $lt: yMidnight } })) + '&m=true', {
        method: 'put',
        headers: {
          'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify([])   
      })
    })
    .then(() => {
      return fetch(url('polling', JSON.stringify({ date: { $lt: yMidnight }, photo: true })) + '&m=true', {
        method: 'put',
        headers: {
          'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify( { "$set" : { "photo" : null } } )
      })
      .then(datas => {
        console.log(datas)
      })      
    })
    .then(() => {
      return fetch(url('clear'), {
        method: 'put',
        headers: {
          'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify([{date: yMidnight}])     
      })         
    })
    .catch(err => {
      console.log(err)
    })
  },

  getData (collection, q, resolve, reject) {
    resolve = resolve ? resolve : function (){}
    reject = reject ? reject : function (){}
    fetch(url(collection, q))
    .then(res => res.json())
    .then(resolve)
    .catch(reject)
  },

  postData (data, resolve, reject) {
    fetch(url('collector', JSON.stringify({id : data.collectorId })))
    .then(res => res.json())
    .then(datas => {
      var collector = datas[0]
      collector[`score${data.score}`]++

      var arr = [ 'battery', 'bottle', 'bag', 'bulb' ]

      arr.forEach(o => {
        if (collector[o] === void 0) {
          collector[o] = 0
        }
        collector[o] += data[o]
      })
      console.log(collector)
      return collector
    })
    .then(collector => {
      return fetch(url('collector'), {
        method: 'post',
        headers: {
          'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(collector)
      })
    })
    .then(() => {
      return fetch(url('village', JSON.stringify({id : data.villageId })))
    })
    .then(res => res.json())
    .then(datas => {
      var village = datas[0]

      var arr = [ 'rot', 'unrot', 'recycle', 'harm' ]

      arr.forEach(o => {
        if (village[o]=== void 0) {
          village[o] = 0
        }
        village[o] += data[o]
      })

      return village
    })
    .then(village => {
      return fetch(url('village'), {
        method: 'post',
        headers: {
          'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(village)
      })
    })
    .then(resolve)
    .catch(reject)
  }
}

function url(collection, q) {
  if (q) {
    return `${host}${collection}?apiKey=${apiKey}&q=${q}`
  }
  return `${host}${collection}?apiKey=${apiKey}`
}
