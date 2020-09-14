const ipCheck = require('./modules/ipCheck')
const fs = require('fs')
const http = require('http')
const ws = require('ws')
const moment = require('moment')
const port = 7070
const {spawn} = require('child_process')
let piip;
var jobs = []
var jobNames = []
let stopTime;
let activeJob = false

let currentJob = {}

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
    if(obj.request == 'create'){create(obj)}
    if(obj.request == 'refresh'){
      jobUpdate()
      ws.send(JSON.stringify({request: 'update',jobs: jobs}))
      if(activeJob == true){
        let time = moment(new Date)
        let timeTest = stopTime - time
        timeTest = timeTest/60000
        console.log(Math.round(timeTest))
        currentJob = {request: 'current',jobName: currentJob.jobName, temp: 0, timeLeft: Math.round(timeTest)}
        ws.send(JSON.stringify(currentJob))
      }
    }
    if(obj.request == 'run' && activeJob == true){ws.send(JSON.stringify({request: 'error', error:'Cancel current job before starting a new one'}))}
    if(obj.request == 'run' && activeJob == false){startJob(obj.file)}
    if(obj.request == 'erase' && obj.file != undefined){fs.unlinkSync(`./jobs/${obj.file}.json`);console.log(obj)}
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

function startJob(file) {
  activeJob = true
  let job = JSON.parse(fs.readFileSync(`./jobs/${file}.json`, 'utf-8'))
  let rawTime = job.time
  let timeArr = rawTime.split(':')
  stopTime = moment(new Date)
  stopTime.add(timeArr[1], 'minutes')
  stopTime.add(timeArr[0], 'hours')
  currentJob = {jobName: job.name, temp: 0, timeLeft: 0}
}

if (!module.parent) {
  http.createServer(accept).listen(port, piip)
  piip = ipCheck()
  console.log(`\nWebSocket server running @ ${piip}:${port}\n`)
} else {
  exports.accept = accept
  console.log('WebSocket server failed')
}