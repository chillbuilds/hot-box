let activeSocket = false
var socket;

function socketSetup() {
  if(activeSocket === false){

    socket = new WebSocket('wss://192.168.1.16:7070')
    activeSocket = true

    socket.onopen = function(e) {
      console.log('Server connection established')
      socket.send('Browser connection established')
      $('#connectBtn').attr('style', 'background: rgba(0, 255, 0, 0.5);')
    }
    
    socket.onmessage = function(event) {
      console.log(`Data from server: ${event.data}`)
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

socketSetup()