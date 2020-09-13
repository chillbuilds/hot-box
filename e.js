const ipCheck = require('./modules/ipCheck')
const fs = require('fs')
const http = require('http')
const ws = require('ws')
const port = 7070
const {spawn} = require('child_process')
let piip;
var jobs = []
var jobNames = []

function tempCheck() {spawn('python', ['/home/pi/Desktop/hot-box/python/ds18b20.py'])}
function relayOn() {spawn('python', ['/home/pi/Desktop/hot-box/python/relayOn.py'])}
function relayOff() {spawn('python', ['/home/pi/Desktop/hot-box/python/relayOff.py'])}

tempCheck()
relayOff()

const wss = new ws.Server({noServer: true})

function accept(req, res) {
  // all incoming requests must be websockets
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    res.end()
    return
  }

  // can be Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end()
    return
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect)
}

function onConnect(ws) {
  ws.on('message', function (message) {
    ws.send(message)
    let obj = JSON.parse(message)
    if(obj.request == "create"){create(obj)}
    if(obj.request == "refresh"){
      jobUpdate()
      ws.send(JSON.stringify({request: 'update',jobs: jobs}))
    }
  })
}

function create(obj) {
  let newObj = {name: obj.name,temp: obj.temp,time: obj.time}
  fs.writeFileSync(`./jobs/${obj.name}.json`, JSON.stringify(newObj))
}

function jobUpdate() {
  jobs = []
  jobNames = []
  fs.readdirSync('./jobs').forEach(file => {jobNames.push(file)})
  for(var i = 0; i < jobNames.length; i++){
    let x = fs.readFileSync(`./jobs/${jobNames[i]}`, 'utf-8')
    jobs.push(x)
  }
}

if (!module.parent) {
  http.createServer(accept).listen(port, piip)
  piip = ipCheck()
  console.log(`\nWebSocket server running @ ${piip}:${port}\n`)
} else {
  exports.accept = accept
  console.log('WebSocket server failed')
}