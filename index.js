const ipCheck = require('./modules/ipCheck')
const http = require('http')
const ws = require('ws')
const port = 7070
const {spawn} = require('child_process')
let piip;
function forward() {spawn('python', ['/home/pi/Desktop/bot-controller/assets/scripts/forward.py'])}
function reverse() {spawn('python', ['/home/pi/Desktop/bot-controller/assets/scripts/reverse.py'])}
function left() {spawn('python', ['/home/pi/Desktop/bot-controller/assets/scripts/left.py'])}
function right() {spawn('python', ['/home/pi/Desktop/bot-controller/assets/scripts/right.py'])}
function stop() {spawn('python', ['/home/pi/Desktop/bot-controller/assets/scripts/stop.py'])}
function weapon1(direction) {
  if(direction === 'down'){
    spawn('python', ['/home/pi/Desktop/bot-controller/assets/scripts/weapon-on.py'])}
  else{spawn('python', ['/home/pi/Desktop/bot-controller/assets/scripts/weapon-off.py'])}
  }

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
    console.log(message)
    switch(message) {
      case 'keydown @ 87':
        forward()
        break
      case 'keyup @ 87':
        stop()
        break
      case 'keydown @ 83':
        reverse()
        break
      case 'keyup @ 83':
        stop()
        break
      case 'keydown @ 65':
        left()
        break
      case 'keyup @ 65':
        stop()
        break
      case 'keydown @ 68':
        right()
        break
      case 'keyup @ 68':
        stop()
        break
      case 'stop':
        stop()
        break
      case 'keydown @ 32':
        weapon1('down')
        break
      case 'keyup @ 32':
        weapon1('up')
        break
      default:
        console.log('weird shit in the switch statement')
    }
  })
}

if (!module.parent) {
  http.createServer(accept).listen(port);
  console.log(`\nWebSocket server running on port ${port}\n`)
  piip = ipCheck()
  console.log(piip)
} else {
  exports.accept = accept
  console.log('WebSocket server failed')
}