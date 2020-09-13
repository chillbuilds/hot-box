let activeSocket = false
var socket;
var jobs = []

function socketSetup() {
  if(activeSocket === false){

    socket = new WebSocket('ws://192.168.1.16:7070')
    activeSocket = true

    socket.onopen = function(e) {
      console.log('Server connection established')
      socket.send(JSON.stringify({request: 'connection'}))
      $('#connectBtn').attr('style', 'background: rgba(0, 255, 0, 0.5);')
    }
    
    socket.onmessage = function(event) {
      let data = JSON.parse(event.data)
      if(data.request == 'update'){
        jobs = []
        for(var i = 0; i < data.jobs.length; i++){
          jobs.push(data.jobs[i])
        }
        console.log(jobs)
      }
    }
    
    socket.onclose = function(event) {
      if (event.wasClean) {
        $('#connectBtn').attr('style', 'background: rgba(0, 0, 0, 0);')
        activeSocket = false
      } else {
        // server process killed or network down
        alert(`You pull the monster mask off the server as it utters, "I would have gotten away with it, too. If it wasn't for error code ${event.code}"`)
        activeSocket = false
        $('#connectBtn').attr('style', 'background: rgba(255, 0, 0, 0.5);')
      }
    }
    
    socket.onerror = function(error) {
      $('#connectBtn').attr('style', 'background: rgba(255, 0, 0, 0.5);')
      activeSocket = false
    }
  }else{
    activeSocket = false
    socket.send('Browser connection closed')
    socket.close()
  }
}

function interval() {
  setInterval(function() {socket.send(JSON.stringify({request: 'refresh'}))}, 3000)
}

socketSetup()
interval()

$('#createJob').on('click', function() {
  var err = []
  let name = $('#nameInput').val()
  let temp = parseInt($('#tempInput').val())
  let tempStr = $('#tempInput').val()
  let time = $('#timeInput').val()
  let timeParse = time.split(':')
  let hr = parseInt(timeParse[0])
  let min = parseInt(timeParse[1])
  if(hr < 0 || hr > 99){err.push('Hour must be between 0 and 99')}
  if(min < 0 || min > 61){err.push('Minutes must be between 0 and 60')}
  if(name.length < 1){err.push('Job name required')}
  if(name.length > 30){err.push('Job name exceeds allowed limit')}
  if(tempStr == '')(err.push('Temp required'))
  if(temp > 150 || temp < 85){err.push('Provided temp is outside accepted bounds')}
  if(time.length < 1){err.push('Time required')}
  if(timeParse.length != 2 && time.length >= 1){err.push('Provided time is formatted incorrectly')}
  if(err.length > 0){
    for(var i = 0; i < err.length; i++){
      console.log(err[i])
    }
  }else{socket.send(JSON.stringify({request: 'create',name: name, temp: temp, time: time}))}
})

$('#erase').on('click', function() {
  $('#nameInput').val('')
  $('#tempInput').val('')
  $('#timeInput').val('')
})