var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

let sockets = {}
app.get('/', function(req, res){
  //sendFile을 통해 index 화면을 호출 합니다.
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected : ');
  socket.on('chat message', function(msg){ // chat message 채널
    //socket으로 부터 메세지를 받았습니다.
    let roomName = socket.roomName
    console.log('roomName : ',roomName) //123
    // console.log('sockets : ',sockets)
    io.to(roomName).emit('chat message', msg);
    // 특정 roomName으로 emit 함        
    //접속 된 socket에게 메세지를 보냅니다.
  });

  socket.on('room', function(room){ // room 이라는 채널이 추가되었음
    if(!sockets[room]){
      sockets[room] = []
      // console.log(sockets)
      socket.roomName = room //해당 socket에 roomname을 지정해준 경우
      // socket1.roomName = 123
      
      sockets[room].push(socket)
       // sockets = {
      //    "123":[socket1]

      // }
      socket.join(room)
      
    } else {
      if (sockets[room].length < 2){ //1대1 채팅용으로 인원제한 걸어주는 경우
        socket.roomName = room     
        // socket2.roomName = 123 
        sockets[room].push(socket)
        // sockets = {
      //    "123":[socket1, socket2],
      //    "room1":[socket1, socket2],
      //    "room2":[socket1, socket2],
      // }
        // sockets =  [[socket1, socket2], [socket3, socket4]]
        socket.join(room)
        console.log('sockets : ', sockets)
      } else {
        socket.emit('result','failed')
      }  
    }    
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});




// if(socket.roomName){
//   io.to(roomName).emit('chat message', msg);
// }