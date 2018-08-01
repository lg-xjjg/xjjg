var host = 'https://api.mlab.com/api/1/databases/my-db1/collections/'
var apiKey = 'q4vsE-BwyJnqZDJSC_d1240H82QBoKVv'

module.exports = {
  getData (collection, q, resolve, reject) {
    resolve = resolve ? resolve : function (){}
    reject = reject ? reject : function (){}
    fetch(url(collection, q))
    .then(res => res.json())
    .then(resolve)
    .catch(reject)
  },
  clearData () {
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

    var midNight = new Date()
    midNight.setHours(0, 0, 0, 0)

    fetch(url('village', JSON.stringify({
      cDate: { $lt: midNight.getTime() }      
    }) + '&m=true'), {
      method: 'put',
      headers: {
        'Content-type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        "$set": {
          "t_rot": 0,
          "t_unrot": 0,
          "t_harm": 0,
          "t_recycle": 0
        }
      })      
    })
    .then(res => {
    })
    .catch(err => {
      console.log(err)
    })    
  }  
}

function url(collection, q) {
  if (q) {
    return `${host}${collection}?apiKey=${apiKey}&q=${q}`
  }
  return `${host}${collection}?apiKey=${apiKey}`
}
