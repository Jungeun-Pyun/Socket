//net : tcp 지원 모듈
const net = require('net')
const server = net.createServer(function(socket) { 
    //서버생성
    //http.createServer와 유사하게 사용함
    // console.log(socket)
    console.log('Client connected')
    socket.write('Welcome to Socket Server')
    //socket.write : socket 측으로 메세지 보냄
    socket.on('data', function(chunck) { //'Hello Socket Server\n'
    //socket.on : socket으로부터 메세지 받음
        console.log('Get message from Client : ', chunck.toString()) 
        //TCP로 전달하는 데이터는 바이너리 데이터 (자바스크립트에선 바이너리 데이터를 buffer로 받음)
        //chunck를 string화 하지 않으면 buffer로 전달됨
    })
    socket.on('end',function(){
        //socket.on('end') : socket의 상태에 따른 동작, socket이 접속 종료할 때 메세지 받음
        console.log('Client disconnected')
    })
})
server.on('listening', function(){
    //서버가 시작됨!
    console.log('Server is listening')
})
server.on('close', function(){
    //서버 종료
    console.log('Server closed')
})
server.listen(3000) //포트 300번 사용함