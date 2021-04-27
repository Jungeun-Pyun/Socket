//net tcp 지원 모듈
const net = require('net')
const server = net.createServer(function(socket) {
    // console.log(socket)
    console.log('Client connected')
    socket.write('Welcome to Socket Server')
    socket.write('\nHow old I am?')
    socket.on('data', function(chunck) {
        console.log('Get message from Client : ', chunck) //chunck를 string화 하지 않으면 buffer로 전달됨
        const correctAnswer = '20'
        let answer = "틀렸습니다"
        if(correctAnswer == chunck.toString()){
            answer = '정답입니다'
        }
        socket.write(answer)
    })
    socket.on('end',function(){
        console.log('Client disconnected')
    })
})
server.on('listening', function(){
    console.log('Server is listening')
})
server.on('close', function(){
    console.log('Server closed')
})
server.listen(3000)